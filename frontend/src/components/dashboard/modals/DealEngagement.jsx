import styled from 'styled-components'
import PropTypes from 'prop-types'
import { Button, Input, Loading, Shake, slideIn, slideOut } from '../../../theme/ThemeStyle'
import { useEffect, useRef, useState } from 'react'
import NavHeader from '../layout/NavHeader'
import ContentDetailsList from '../layout/ContentDetailsList'
import ModalContainter from './ModalContainter'
import { useDispatch, useSelector } from 'react-redux'
import { api } from '../../../common/api'
import { clearProjectErrors } from '../../../app/project/projectSlice'
import { formatAmount, formatAmountFraction, formatNumber, formatNumberToFloat } from '../../../common/utils'
import Disclaimer from './Disclaimer'

const DealEngagement = ({isOpen, handleModalClose, project, title, idx}) => {
    const dispatch = useDispatch()
    const [fieldErrors, setFieldErrors] = useState('')
    const [hasAcknowledgedTerms, setHasAcknowledgedTerms] = useState(false)
    const [amount, setAmount] = useState('')
    const [sufficientFunds, setSufficientFunds] = useState(true)

    const modalRef = useRef(null);

    const handleAmountInput = (e)=>{
        setAmount(e.target.value==0?'':formatNumber(e.target.value))
        setSufficientFunds(e.target.value===''||parseFloat(walletBalance) >= formatNumberToFloat(e.target.value))
    }

    const { walletBalance } = useSelector(state => state.user)
    const { loading, error, message, projects } = useSelector(state => state.project)

    const [confirmDialog, setConfirmDialog] = useState("closed")
    const openConfirmDialog = ()=> setConfirmDialog("opened")
    const closeConfirmDialog = ()=> setConfirmDialog("closed")

    const resetScrollPosition = ()=>{
        modalRef.current.scrollIntoView({
            behavior: 'auto',
            block: 'start',
        })
    }

    const confirmContribution = ()=>{
        dispatch(api.contribute({amount:formatNumberToFloat(amount), projectId: project._id}, projects, idx))
    }

    useEffect(()=>{
        if(error||message){
            dispatch(clearProjectErrors())
            closeConfirmDialog()

        }
    },[error, message, dispatch])

    const [currentIndex, setCurrentIndex] = useState(0);
    
    const nextView = () => {
        if(currentIndex === 1){
            const inputFields = []
            if(amount < 100)inputFields.push('amount')
            if(!hasAcknowledgedTerms)inputFields.push('hasAcknowledgedTerms')
            if(!sufficientFunds) inputFields.push('lowBal')

            setFieldErrors(inputFields)
            setTimeout(()=>setFieldErrors([]), 500)

            if(inputFields.length === 0 && sufficientFunds){
                handleModalClose()
                openConfirmDialog()
            }
        }else{
            resetScrollPosition()
            setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, 1));
        }
    };

    const prevView = () => {
        if(currentIndex === 0){
            handleModalClose()
        }else{
            resetScrollPosition()
            setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
        }
    };

    return (
        <>
            <ModalContainter isOpen={isOpen} handleModalClose={handleModalClose}>
                <SliderWrapper ref={modalRef}>
                    <NavHeader handleModalClose={handleModalClose} title={`Project ${project.uniqueId} | ${title}`} />
                    <ParentWrap >
                        {Array.from({ length: 2 }, (_, index) => (
                            <View key={index} style={{ transform: `translateX(${(index - currentIndex*2) * 100}%)` }}>
                                {currentIndex===0?
                                <Wrapper>
                                    <ContentDetailsList project={project} title = {title}/>
                                    <DealId>Ref ID: {project.uniqueId}</DealId>
                                </Wrapper> :
                                <Wrapper>
                                    <Content>
                                        <Disclaimer />
                                        <Shake value={fieldErrors.includes('hasAcknowledgedTerms')?'animate':''}>
                                            <CheckBoxWrapper onClick={()=>setHasAcknowledgedTerms(!hasAcknowledgedTerms)}>
                                                <Checkbox type='checkbox' onChange={()=>setHasAcknowledgedTerms(!hasAcknowledgedTerms)} checked={hasAcknowledgedTerms}/>
                                                <CheckBoxLabel checked={hasAcknowledgedTerms}>I undertand and agree</CheckBoxLabel>
                                            </CheckBoxWrapper>
                                        </Shake>
                                        <CommitmentWrapper>
                                            <Title>Enter Amount</Title>
                                            {!sufficientFunds&& <Shake value={fieldErrors.includes('lowBal')?'animate':''}>
                                                <SmallText>Insufficient Funds</SmallText>
                                            </Shake>}
                                            <Shake value={fieldErrors.includes('amount')?'animate':''}>
                                                <Commitment>
                                                    <AmountInput placeholder='0.00' value={amount} onChange={handleAmountInput} />
                                                    <AccountBalance>Bal. {formatAmountFraction(walletBalance)}</AccountBalance>
                                                </Commitment>
                                            </Shake>
                                        </CommitmentWrapper>
                                    </Content>
                                </Wrapper>}
                            </View>
                        ))}
                    </ParentWrap>
                    <ButtonWrapper>
                        <ButtonClose onClick={prevView}>{currentIndex==0?'Close':'Back'}</ButtonClose>
                        <Btn onClick={nextView}>{currentIndex===1?'Contribute':'Next'}</Btn>
                    </ButtonWrapper>

                </SliderWrapper>
            </ModalContainter>

            <ModalContainter isOpen={confirmDialog} handleModalClose={null}>
                <>
                    <Text>Please confirm the contribution of {formatAmount(amount)} to project ID: {project.uniqueId}</Text>
                    <ButtonWrapper>
                        <ButtonClose onClick={closeConfirmDialog}>Cancel</ButtonClose>
                        <Btn onClick={confirmContribution}> {loading&&<Loading />} I Confirm</Btn>
                    </ButtonWrapper>
                </>
            </ModalContainter>
        </>
    )
}
DealEngagement.propTypes = {
    isOpen: PropTypes.string,
    handleModalClose: PropTypes.func,
    project: PropTypes.object,
    title: PropTypes.string,
    idx: PropTypes.number
}


const ParentWrap = styled.div`
    display: flex;
    overflow: hidden;
    width: 200%;
    /* width: ${({value})=>value==='prev'?'200%':'100%'};
    flex-direction: row; */
`
const View = styled.div`
  flex: 1;
  transition: transform 0.5s ease;
  /* display: flex;
  justify-content: center;
  align-items: center; */
`;
const SliderWrapper = styled.div`
    
`
const Wrapper = styled.div`
    flex: 1;
    display: ${({value})=>value};
    /* display: ${({value})=>value==='slideOut'?'':'none'}; */
    /* animation: ${({value}) => value==='slideIn'? slideIn : value==='slideOut'? slideOut:'' } 1s forwards; */
    background-color: ${({theme})=>theme.colors.white};
`
const Title = styled.h2`
    font-size: 18px;
    margin: 10px 0;
    font-weight: 500;
    flex: 1;
`
const Text = styled.p`
    font-size: 20px;
    font-weight: 500;
    padding: 10px;
    text-align: center;
`
const SmallText = styled.div`
    font-size: 14px;
    margin-bottom: 5px;
    color: ${({theme})=> theme.colors.lost};
`
// Content
const Content = styled.div`
    flex-direction: column;
    align-items: start;
    padding: 10px;
    
`
const Label = styled.p`
    color: ${({theme})=>theme.colors.dark2};
    font-size: 12px;

`

// DealId
const DealId = styled(Label)`
    text-align: center;
    font-weight: 700;
    margin: 0;
`
// Buttons
const ButtonWrapper = styled.div`
    display: flex;
    justify-content: center;
    column-gap: 10px;
    margin: 10px;
`
const Btn = styled(Button)`
    width: fit-content;
    border-radius: 15px;
    padding: 15px 30px;
`
const ButtonClose = styled(Btn)`
    background-color: ${({theme})=>theme.colors.dark3};
`

const Checkbox = styled.input`
    width: 18px;
    height: 18px;
    margin-right: 5px;
`
const CheckBoxLabel = styled(Label)`
    margin: 0;
    color: ${({checked, theme})=>checked?theme.colors.text:theme.colors.dark1};
    font-weight: ${({checked})=>checked?700:500};
    font-size: 16px;
`
const CheckBoxWrapper = styled.div`
    display: flex;
    align-items: center;
    cursor: pointer;
`
const Commitment = styled(CheckBoxWrapper)`
    column-gap: 10px;
`
const CommitmentWrapper = styled.div`
    display: flex;
    flex-direction: column;
    padding: 0 20px 20px;
    border-radius: 10px;
    margin-top: 10px;
    color: ${({theme})=>theme.colors.white};
    background-color: ${({theme})=>theme.colors.dark2};
`
const AmountInput = styled(Input)`
    max-width: 150px;
`
const AccountBalance = styled(Title)`
    font-size: 14px;
`

export default DealEngagement