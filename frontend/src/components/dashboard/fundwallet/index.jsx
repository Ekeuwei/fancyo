import { useEffect, useState } from "react"
import { BodyWrapper, Button, Input, InputLabel, InputWrapper, Loading, NoticeMessage } from "../../../theme/ThemeStyle"
import styled, { keyframes } from "styled-components"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCopy } from "@fortawesome/free-regular-svg-icons"
import { useDispatch, useSelector } from "react-redux"
import { api } from "../../../common/api"
import { clearLink, clearUserErrors, createUserError } from "../../../app/user/userSlice"
import { formatAmount } from "../../../common/utils"
import NavHeader from "../layout/NavHeader"

const FundWallet = () => {
  const dispatch = useDispatch()
  const [amount, setAmount] = useState('')
  const [paymentOption, setPaymentOption] = useState("transfer")
  const [textCopied, setTextCopied] = useState('')
  const { error } = useSelector(state => state.user)

  const handleAmount = (e)=> {
    setAmount(e.target.value)
    dispatch(clearUserErrors())
  }
  
  const handleCardPayment = (e)=> {
    e.preventDefault()

    if(amount >= 100){
      dispatch(api.fundWallet(amount))
    }else{
      dispatch(createUserError(`Minimum deposit is ${formatAmount(100)}`))
    }
  }

  const handleTextCopied = async()=> {
    try {
      await navigator.clipboard.writeText('0236334534');
      setTextCopied("copied")
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
    setTimeout(()=>setTextCopied(""), 4000)
  }

  const { loading, paymentLink } = useSelector(state => state.user)

  useEffect(()=>{
    if(paymentLink){
      window.location.href = paymentLink;
      dispatch(clearLink())
    }
  },[dispatch, paymentLink])

  return (
    <>
      <NavHeader title={'Fund Wallet'} />
      <BodyWrapper>
        <p>Select Payment method</p>
        <PaymentMethods>
          <PaymentButton onClick={()=>setPaymentOption("transfer")} value={paymentOption==="transfer"?"active":""}>Bank transer</PaymentButton>
          <PaymentButton onClick={()=>setPaymentOption("card")} value={paymentOption==="card"?"active":""}>Pay with card</PaymentButton>
        </PaymentMethods>
        <AccountDisplay>
          <Text>Deposit into account number below for instant crediting</Text>
          <AccountDetails>
            <Text>Guaranty Trust Bank</Text>
            <HeadingText onClick={handleTextCopied} value={textCopied}>0236334534 <FontAwesomeIcon icon={faCopy} /></HeadingText>
          </AccountDetails>
        </AccountDisplay>
        <List>
          <ListItem>Minimum per transaction NGN 1,000</ListItem>
          <ListItem>Maximum per transaction NGN 10,000,000</ListItem>
        </List>

        {error&&
        <NoticeMessage value='error'>
            { error }
        </NoticeMessage>}

        {paymentOption==="card"&&<form onSubmit={handleCardPayment}>
          <InputWrapper>
            <InputLabel value={amount} >Amount</InputLabel>
            <Input 
              label={amount} 
              type="number" 
              value={amount} 
              onChange={handleAmount} 
              placeholder="Enter amount"/>
          </InputWrapper>


        <Button disabled={loading} type="submit">
            Proceed {loading&&<Loading />}
        </Button>

        </form>}
      </BodyWrapper>
    </>
  )
}

const PaymentMethods = styled.div`
  display: flex;
  column-gap: 5px;

`
const PaymentButton = styled(Button)`
  background-color: ${({theme})=>theme.colors.bg};
  color: ${({theme, value})=>value==="active"?theme.colors.text:theme.colors.dark2};
  border: solid 2px ${({theme, value})=>value==="active"?theme.colors.accent:theme.colors.dark4};
  border-radius: 10px;
`
const List = styled.ol`
  font-size: 14px;
  color: ${({theme})=>theme.colors.dark2};
  margin: 10px 0 0;
`
const ListItem = styled.li`
  margin-bottom: 5px;
`
const AccountDisplay = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px 10px;
  padding: 10px;
  border: solid 2px ${({theme})=>theme.colors.dark3};
  border-radius: 10px;
`
const AccountDetails = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-top: 30px;
`
const Text = styled.p`
  margin: 0;
  text-align: center;
`
const HeadingText = styled.h2`
  position: relative;
  margin: 5px;
  &::before{
    position: absolute;
    content: '${({value})=>value}';
    color: ${({theme})=>theme.colors.won};
    top: 0;
    right: -5px;
    transform: translate(100%, 50%);
    font-size: 12px;
    font-weight: 500;
    animation: ${({ value }) => (value==="copied" ? slideOut : 'none')} 5s ease-out;
  }
`
const slideOut = keyframes`
  0% {
    transform: translate(100%, 100%);
    opacity: 1;
  }
  100% {
    transform: translate(100%, 0%);
    opacity: 0;
  }
`;
export default FundWallet