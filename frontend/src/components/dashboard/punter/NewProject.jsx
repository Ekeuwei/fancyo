/* eslint-disable react/no-unescaped-entities */
import styled from "styled-components"
import { BannerNotice, Button, Input, InputLabel, InputWrapper, Loading, NoticeMessage, Select, SubtleLabel, TextArea } from "../../../theme/ThemeStyle"
import NavHeader from "../layout/NavHeader"
import ModalContainter from "../modals/ModalContainter"
import PropTypes from 'prop-types'
import { useEffect, useRef, useState } from "react"
import { estimateRoi, formatNumber, formatNumberToFloat, setAlpha } from "../../../common/utils"
import CustomDatePicker from "../layout/CustomDatePicker"
import { useDispatch, useSelector } from "react-redux"
import { api } from "../../../common/api"
import { createToast } from "../../../app/user/userSlice"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAngleRight, faEdit, faInfoCircle } from "@fortawesome/free-solid-svg-icons"
import { clearProjectErrors } from "../../../app/project/projectSlice"
import NewProjectPreview from "./NewProjectPreview"


const NewProject = ({isOpen, handleCloseModal}) => {
    const modalRef = useRef(null);
    
    const resetScrollPosition = ()=>{
        modalRef.current.scrollIntoView({
            behavior: 'auto',
            block: 'start',
        })
    }

    const dispatch = useDispatch()
    const [emptyFields, setEmptyFields] = useState([])
    const [data, setData] = useState({
        eRoi:'',
        maxOdds:'',
        minOdds:'',
        startAt:'',
        endAt:'',
        notes:'',
        minContribution: '',
        progressiveSteps:'1',
    })
    const [progressiveStaking, setProgressiveStaking] = useState(false)
    const [showInfo, setShowInfo] = useState(false)
    const [oddsError, setOddsError] = useState(false)
    const [progressiveOptions, setProgressiveOptions] = useState(false)
    const [enforceProgressiveStaking, setEnforceProgressiveStaking] = useState(false)
    const { badge } = useSelector(state => state.user)

    const onChange = (e)=> setData(prevData=>{
        if(error||message){
            dispatch(clearProjectErrors())
        }
        if(['eRoi', 'minContribution' ].includes(e.target.name)){
            e.target.value = e.target.value==0?'':formatNumber(e.target.value)
        }
        
        return {...prevData, [e.target.name]:e.target.value}
    })

    const [startAt, setStartAt] = useState(null);
    const [endAt, setEndAt] = useState(null);
    const { loading, error, message, projects } = useSelector(state => state.project)

    useEffect(()=>{
        setData(prevData => ({
            ...prevData,
            startAt: startAt?.toISOString(),
            endAt: endAt?.toISOString(),
        }))
    },[endAt, startAt])

    useEffect(()=>{
        if(emptyFields.length>0){
            const timeoutId = setTimeout(()=>setEmptyFields([]),1000)
            return ()=> clearTimeout(timeoutId)
        }
    },[emptyFields])

    useEffect(()=>{
        if(message){
            dispatch(createToast({message, type:'success'}))
            handleCloseModal()
            setData(prevData => Object.keys(prevData).reduce((acc, key) => (acc[key] = '', acc), {}));
            //clear data
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[dispatch, message])

    useEffect(()=>{
        const withinBadgeClearanceLimit = data.maxOdds > badge?.minOdds || data.minOdds > badge?.minOdds
        let start = withinBadgeClearanceLimit? (badge?.number+3) : 2
        // let start = badge?.minOdds >= parseFloat(data.maxOdds)? 1:4
        const end = 10
    
        const options = []

        for(let i = start; i < end; i++){
            options.push(<option key={i} value={i}> {`${i} Step${i>1?'s':''}`}</option>)
        }
    
        setEnforceProgressiveStaking(withinBadgeClearanceLimit)
        if(withinBadgeClearanceLimit){
            // Minimum steps
            setData(prev => ({...prev, progressiveSteps: `${(badge?.number + 3)}`}))
            // We are setting the minimum level to 3 plus the badge number
        }
        setProgressiveStaking(withinBadgeClearanceLimit)
        setProgressiveOptions(options)

        setOddsError(data.maxOdds>0 &&  data.minOdds>0 && data.minOdds >=  data.maxOdds)

        setData(prev =>{

            // Create a difference of 0.2 for allow for ticket registering
            let minOdds = prev.minOdds <= badge?.maxOdds-0.2 || prev.maxOdds <1 ? prev.minOdds : `${Math.min(badge?.maxOdds - 0.2, prev.minOdds).toFixed(1)}`;
            let maxOdds = prev.maxOdds <= badge?.maxOdds ? prev.maxOdds : `${Math.min(prev.maxOdds, badge?.maxOdds).toFixed(1)}`;
            
            return ({...prev, minOdds:isNaN(minOdds)?'':minOdds, maxOdds:isNaN(maxOdds)?'':maxOdds})
        })
    },[badge, data.minOdds, data.maxOdds])

    const handleProgressiveStaking = ()=>{
        if(!enforceProgressiveStaking){
            if(progressiveStaking){
                setData(prev => ({...prev, progressiveSteps:''}))
            }
            setProgressiveStaking(!progressiveStaking)
        }
    }

    useEffect(()=>{
        if(data.startAt && data.endAt && data.minOdds && data.progressiveSteps){
            // Estimate the roi
            const difference = new Date(data.endAt).getTime() - new Date().getTime(data.startAt);
            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const numberOfStakes = days + 1

            const estimatedRoi = estimateRoi(data.minOdds, data.progressiveSteps, numberOfStakes)

            setData(prev => ({...prev, eRoi:estimatedRoi}))
        }
    },[data.startAt, data.endAt, data.minOdds, data.progressiveSteps])

    const [currentIndex, setCurrentIndex] = useState(0);
    const handleSubmit = (e) => {
        e.preventDefault()
        
        if(currentIndex === 1){
            let newData = {...data, 
                minContribution:formatNumberToFloat(data.minContribution),
                eRoi: formatNumberToFloat(data.eRoi),
                progressiveStaking
            }
            dispatch(api.createProject(newData, projects))
        }else{

            let defaultNotes = `This project promises a ${data.eRoi}% Return on Investment (ROI)! With odds per bet ticket ranging from ${parseFloat(data.minOdds).toFixed(2)} to ${parseFloat(data.maxOdds).toFixed(2)}${progressiveStaking?', we employ a progressive staking strategy to effectively manage the bankroll and maximize your potential gains':''}.`
            
            if(!data.notes && data.eRoi && data.minOdds&& data.maxOdds){
                setData(prevData => ({...prevData, notes: defaultNotes}))
            }

            let newEmptyFields = Object.keys(data).filter(key => key!='notes' && (data[key]===''||data[key]=== undefined))
            if(!progressiveStaking){
                newEmptyFields = newEmptyFields.filter(field => field!='progressiveSteps')
            }
            setEmptyFields(newEmptyFields)

            if(newEmptyFields.length === 0 && !oddsError){
                resetScrollPosition()
                setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, 1));
            }
        }
    };

    const prevView = (e) => {
        e.preventDefault()

        if(currentIndex === 0){
            handleCloseModal()
        }else{
            resetScrollPosition()
            setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
        }
    };

    return (
        <ModalContainter isOpen={isOpen} handleModalClose={handleCloseModal}>
            <>
                <NavHeader handleModalClose={handleCloseModal} title={"New Project"}/>
                
                <FormController onSubmit={handleSubmit} >

                    <SlidderWrapper ref={modalRef} >

                    {Array.from({ length: 2 }, (_, index) => (
                            <View key={index} style={{ transform: `translateX(${(index - currentIndex*2) * 100}%)` }}>
                                {currentIndex===0?
                                    <FormValuesWrapper>
                                        <InputWrapper value={emptyFields.includes('minOdds')?'error':''}>
                                            <InputLabel value={data.minOdds}>Minimum Odds Per Ticket</InputLabel>
                                            <Input 
                                                placeholder="Minimum Odds Per Ticket"
                                                name="minOdds"
                                                invalid={emptyFields.includes('minOdds')?'error':''}
                                                autoComplete="off"
                                                onChange={onChange}
                                                value={data.minOdds}
                                                label={data.minOdds} />
                                        </InputWrapper>
                                        <InputWrapper value={emptyFields.includes('maxOdds')?'error':''}>
                                            <InputLabel value={data.maxOdds}>Maximum Odds Per Ticket</InputLabel>
                                            <Input 
                                                placeholder="Maximum Odds Per Ticket"
                                                name="maxOdds"
                                                invalid={emptyFields.includes('maxOdds')?'error':''}
                                                autoComplete="off"
                                                onChange={onChange}
                                                value={data.maxOdds}
                                                label={data.maxOdds} />
                                                {oddsError&&<SubtleLabel value='error'>Maximum Odds must be higher than minimum odds</SubtleLabel>}
                                        </InputWrapper>

                                        <InputWrapper>
                                            <InputLabel value={data.notes}>Project description</InputLabel>
                                            <TextArea 
                                                value={data.notes}
                                                label={data.notes}
                                                onChange={onChange}
                                                name="notes"
                                                rows={7}
                                                placeholder="Add notes about the project"
                                            />
                                        </InputWrapper>
                                        <InputWrapper value={emptyFields.includes('minContribution')?'error':''}>
                                            <InputLabel value={data.minContribution}>Minimum contribution amount per contributor</InputLabel>
                                            <Input 
                                                placeholder="Minimum contribution amount per contributor"
                                                name="minContribution"
                                                invalid={emptyFields.includes('minContribution')?'error':''}
                                                autoComplete="off"
                                                onChange={onChange}
                                                value={data.minContribution}
                                                label={data.minContribution} />
                                        </InputWrapper>

                                        {/* Apply progressive staking calculator (4 steps) */}
                                        {badge?.number===1?<BannerNotice color="accent">
                                            <strong>Note: </strong>Your project odd limit per bet ticket is {badge?.maxOdds} odds. Hence, progressive 
                                            staking strategy must be applied to your projects pending a badge upgrade
                                        </BannerNotice>:
                                        <BannerNotice color="accent">
                                            <strong>Note: </strong>Your project odd limit per bet ticket is {badge?.maxOdds} odds. Projects with odds ranging 
                                            above {badge?.minOdds} odds must apply progressive staking strategy.
                                        </BannerNotice>}
                                        <ProgressiveWrapper>
                                            {showInfo&&<Info><strong>Progressive staking: </strong>The progressive staking strategy is used to manage bankroll and optimize return.
                                                Instead of placing fixed bets, this strategy involves adjusting the stake size base on 
                                                the outcome of previous bets. After a loss, the stake increases progressively, aiming to 
                                                recover previous losses efficiently. Convrsely, after a win, the stake resets to the initial amount.
                                                This approach is designed to mitigate the impact of losses, maximize recovery during winning streaks, and provide
                                                a systematic framework for long-term profitability.<br/><br/>
                                                Progressive staking will not be enforced when you are handling projects below your badge limits. Hence, for instance, progressive staking will be
                                                enforced if this project's  maximum odds are upto {badge?.minOdds}. 
                                            </Info>}
                                            <CheckBoxWrapper >
                                                <Checkbox disabled={enforceProgressiveStaking} type='checkbox' onChange={handleProgressiveStaking} checked={progressiveStaking}/>
                                                <CheckBoxLabel checked={progressiveStaking} onClick={handleProgressiveStaking}>Apply progressive staking </CheckBoxLabel>
                                                <FontAwesomeIcon icon={faInfoCircle} style={{marginLeft: '10px'}} onClick={()=>setShowInfo(!showInfo)}/> 
                                            </CheckBoxWrapper>
                                            {progressiveStaking &&<InputWrapper value={emptyFields.includes('progressiveSteps')?'error':''}>
                                                <InputLabel value={data.progressiveSteps}>Staking Steps</InputLabel>
                                                <Select 
                                                    id="progressiveSteps" 
                                                    name="progressiveSteps" 
                                                    value={data.progressiveSteps} 
                                                    onChange={onChange} 
                                                    label={data.progressiveSteps} >
                            
                                                    <option value="">Steps</option>
                                                    { progressiveOptions }

                                                </Select>
                                            </InputWrapper>}
                                        </ProgressiveWrapper>

                                        <CustomDatePicker 
                                            dateTime={startAt} 
                                            invalid={emptyFields.includes('startAt')?'error':''}
                                            setDateTime={setStartAt} 
                                            placeholder="Project start time"
                                            customDateFormat={"MMMM d, yyyy h:mm aa"}
                                        />
                                        <CustomDatePicker 
                                            dateTime={endAt} 
                                            invalid={emptyFields.includes('endAt')?'error':''}
                                            setDateTime={setEndAt} 
                                            placeholder="Project end time"
                                            customDateFormat={"MMMM d, yyyy h:mm aa"}
                                        />
                                        <InputWrapper value={emptyFields.includes('eRoi')?'error':''} >
                                            <InputLabel value={data.eRoi}>Estimated ROI (%)</InputLabel>
                                                <Input 
                                                    placeholder="Estimated ROI (%)"
                                                    name="eRoi" 
                                                    autoComplete="off"
                                                    invalid={emptyFields.includes('eRoi')?'error':''}
                                                    onChange={onChange}
                                                    value={data.eRoi}
                                                    label={data.eRoi} />
                                        </InputWrapper>
                                    </FormValuesWrapper>:
                                    <NewProjectPreview project={{...data, progressiveStaking}}/>
                                }
                            </View>
                        ))}
                    </SlidderWrapper>
                    {/* <Button type="submit">Submit <Loading value={loading}/></Button> */}
                    <NoticeMessage value={error?'error':''}>{error}</NoticeMessage>
                    <ButtonWrapper>
                        <ButtonClose onClick={prevView}>{currentIndex==0?'Close':'Edit'}{currentIndex==1&&<FontAwesomeIcon icon={faEdit} style={{marginLeft: '5px'}}/>}</ButtonClose>
                        <Btn type="submit">{currentIndex===1?'Submit':'Preview'} <Loading value={loading}/> {currentIndex==0&&<FontAwesomeIcon icon={faAngleRight} style={{marginLeft: '5px'}}/>}</Btn>
                    </ButtonWrapper>
                </FormController>
            </>
        </ModalContainter>
    )
}

NewProject.propTypes = {
    isOpen: PropTypes.string,
    handleCloseModal: PropTypes.func,
}

const FormController = styled.form`
    display: flex;
    flex-direction: column;
`
const Info = styled.p`
    line-height: 1.35;
    font-size: 14px;
`
const CheckBoxWrapper = styled.div`
    display: flex;
    align-items: center;
    cursor: pointer;
`
const Checkbox = styled.input`
    width: 18px;
    height: 18px;
    margin-right: 5px;
`
const CheckBoxLabel = styled.p`
    margin: 0;
    color: ${({checked, theme})=>checked?theme.colors.text:theme.colors.dark1};
    font-weight: ${({checked})=>checked?700:500};
    font-size: 16px;
`
const ProgressiveWrapper = styled.div`
    padding: 20px;
    background: ${({theme})=>setAlpha(theme.colors.success, 0.35)};
    border-radius: 10px;
`
const FormValuesWrapper = styled.div`
    padding: 0 10px;
`
const SlidderWrapper = styled.div`
    display: flex;
    overflow: hidden;
    width: 200%;
`
const View = styled.div`
  flex: 1;
  transition: transform 0.5s ease;
`;

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

export default NewProject