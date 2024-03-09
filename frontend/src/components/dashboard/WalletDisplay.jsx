import styled from "styled-components"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { api } from "../../common/api"
import { useHistory } from "react-router-dom/cjs/react-router-dom.min"
import { formatAmountFraction } from "../../common/utils"
import { faCreditCard, faLayerGroup, faSackDollar } from "@fortawesome/free-solid-svg-icons"

const WalletDisplay = () => {
    const dispatch = useDispatch()
    const history = useHistory()

    const { walletBalance, loading } = useSelector(state => state.user)

    useEffect(()=>{
        dispatch(api.wallet())
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
    
    return (
        <Wrapper>
            <MainView>
                <Title>My portfolio</Title>
                <Balance>{loading?'** * **':formatAmountFraction(walletBalance)}</Balance>
            </MainView>
            <ButtonGroup>
                <Button onClick={()=>history.push('/cashout')}>
                    <ButtonIcon><FontAwesomeIcon icon={faSackDollar}/></ButtonIcon>
                    <ButtonText>Cashout</ButtonText>
                </Button>
                <Button onClick={()=>history.push('/deposit')}>
                    <ButtonIcon><FontAwesomeIcon icon={faCreditCard}/></ButtonIcon>
                    <ButtonText>Fund</ButtonText>
                </Button>
                <Button onClick={()=>history.push('/transactions')}>
                    <ButtonIcon><FontAwesomeIcon icon={faLayerGroup}/></ButtonIcon>
                    <ButtonText>Transactions</ButtonText>
                </Button>
            </ButtonGroup>
        </Wrapper>
    )
}
const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    position: relative;
    margin-bottom: 50px;
`
const MainView = styled.div`
    display: flex;
    flex-direction: column;
    padding: 50px;
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.text};
    border-radius: 10px;
`
const Balance = styled.h1`
    margin: 0;
    color: ${({theme})=>theme.colors.white};
`
const Title = styled.p`
    margin: 0;
    color: ${({theme})=> theme.colors.white};
`
const ButtonGroup = styled.div`
    display: flex;
    position: absolute;
    width: 100%;
    bottom: 0;
    left: 0;
    transform: translate(0, 50%);
    align-items: center;
    justify-content: space-evenly;
`
const Button = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    row-gap: 5px;
`
const ButtonIcon = styled.div`
    border-radius: 50%;
    padding: 10px;
    color: ${({theme}) => theme.colors.white};
    background-color: ${({theme}) => theme.colors.accent};
`
const ButtonText = styled.div`
    color: ${({theme})=>theme.colors.accent};
    font-size: 12px;
`

export default WalletDisplay