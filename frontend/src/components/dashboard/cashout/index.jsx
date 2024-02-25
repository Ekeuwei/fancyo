import styled from "styled-components"
import { BodyWrapper, Button, Input, NoticeMessage } from "../../../theme/ThemeStyle"
import SelectOption from "./SelectOption"
import AddAccount from "./AddAccount"
import ModalContainter from "../modals/ModalContainter"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { api } from "../../../common/api"
import { createUserError } from "../../../app/user/userSlice"
import { formatAmount, formatAmountFraction, formatNumber, formatNumberToFloat } from "../../../common/utils"

const Cashout = () => {

  const { walletBalance, error, message } = useSelector(state => state.user)
  const { user } = useSelector(state => state.auth)
  
  const [amount, setAmount] = useState("")
  const [isOpen, setOpen] = useState("closed")
  const handleModalClose = ()=> setOpen("closed")
  const handleModalOpen = ()=> setOpen("opened")

  const [selectedOption, setSelectedOption] = useState({name:""});
  const handleSelection = (e) => {
      const option = bankAccounts.find(option => option.name === e.target.value)||{name:""}
      setSelectedOption(option);
  }

  const dispatch = useDispatch()
  
  useEffect(()=>{
      if(selectedOption.name === "Add Account"){
          handleModalOpen()
      }
  },[selectedOption])

  useEffect(()=>{
      dispatch(api.wallet())
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  const bankAccounts = user?[...user.bankAccounts, {name:"Add Account"}]:[{name:"Add Account"}]

  const handleCashout = (e)=>{
    e.preventDefault()

    if(parseFloat(walletBalance) >= formatNumberToFloat(amount) ){
      dispatch(api.cashoutRequest({...selectedOption, amount:formatNumberToFloat(amount)}))
    }else{
      dispatch(createUserError("Cashout amount lower than current balance"))
    }
  }

  return (
    <BodyWrapper>
      <Wrapper onSubmit={handleCashout}>
        {bankAccounts&& <SelectOption 
          options={bankAccounts} 
          placeHolder={'Select Account'} 
          selectedOption={selectedOption}
          handleModalOpen={handleModalOpen} 
          handleSelection={handleSelection} />}

        <Balance>Balance {formatAmountFraction(walletBalance)}</Balance>
        <Amount 
          placeholder={`min. ${formatAmount(1000)}`}
          value = {amount}
          onChange={(e)=>setAmount(formatNumber(e.target.value))}/>

        <List>
          <ListItem>Minimum per transaction NGN 1,000</ListItem>
          <ListItem>Maximum per transaction NGN 10,000,000</ListItem>
        </List>
        <NoticeMessage value={error?"error":message?"message":""}>{error || message}</NoticeMessage>
        <Button type="submit">Submit</Button>
      </Wrapper>

      <ModalContainter isOpen={isOpen} handleModalClose={handleModalClose}>
        <AddAccount handleModalClose={handleModalClose} />
      </ModalContainter>
    </BodyWrapper>
  )
}

const Wrapper = styled.form`
  display: flex;
  flex-direction: column;
  row-gap: 10px;
  padding: 10px;

`
const Amount = styled(Input)`
  text-align: right;
`
const Balance = styled.div`
  margin-top: 10px;

`
const List = styled.ol`
  font-size: 14px;
  color: ${({theme})=>theme.colors.dark2};
  margin: 10px 0 0;
`
const ListItem = styled.li`
  margin-bottom: 5px;
`
export default Cashout