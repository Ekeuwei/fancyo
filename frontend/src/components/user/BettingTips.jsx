import { useState } from "react"
import { BodyWrapper, Button, Input, InputLabel, InputWrapper, Loading, NoticeMessage } from "../../theme/ThemeStyle"
import styled from "styled-components"
import { useDispatch, useSelector } from "react-redux"
import { createUserError } from "../../app/user/userSlice"
import { api } from "../../common/api"
import NavHeader from "../dashboard/layout/NavHeader"

const BettingTips = () => {
  const dispatch = useDispatch()
  const [freeTicket, setFreeTicket] = useState('')
  const [vipTicket, setVipTicket] = useState('')

  const { loading, error, betTicket:bvnDetails } = useSelector(state => state.user)

  const fetchBvn = (e)=>{
    e.preventDefault()

    if(vipTicket !=='' && freeTicket !== ''){
      dispatch(api.loadBetTicket(freeTicket, vipTicket))
    }else{
        dispatch(createUserError('Please enter both VIP and Free ticket'))
    }
  }

  return (
    <>
      <NavHeader title={'Validate BVN'} />
      <BodyWrapper>

        {error&&
        <NoticeMessage value='error'>
            { error }
        </NoticeMessage>}

        <FormControl onSubmit={fetchBvn}>

          <InputWrapper>
            <InputLabel value={freeTicket} >free ticket id</InputLabel>
            <Input 
                label={'freeTicket'} 
                value={freeTicket} 
                onChange={e => setFreeTicket(e.target.value)} 
                name="free"
                placeholder="Free Ticket"/>
            </InputWrapper>
            <InputWrapper>
            <InputLabel value={vipTicket} >vip ticket id</InputLabel>
              <Input 
                  label={'freeTicket'} 
                  value={vipTicket} 
                  onChange={e => setVipTicket(e.target.value)} 
                  name="vip"
                  placeholder="Vip Ticket"/>
            
            </InputWrapper>

            <ValidateButton disabled={loading} type="submit">
                  Load Ticket <Loading value={loading} />
              </ValidateButton>



        </FormControl>

        {bvnDetails&&Object.keys(bvnDetails).map(key=>(
            <Entry key={key}>
                <Label>{key.replace(/([a-z])([A-Z])/g, '$1 $2')}</Label>
                <Value>{bvnDetails[key]}</Value>
            </Entry>
        ))}
      </BodyWrapper>
    </>
  )
}

const FormControl = styled.form`
  /* margin: auto; */
  max-width: 500px;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 10;
`

const Entry = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: 10px;
    border-bottom: 1px solid ${({theme})=> theme.colors.dark4};
    
`
const Value = styled.p`
    margin: 0;
    font-size: 18px;
    margin-bottom: 10px;
`
const Label = styled(Value)`
    text-transform: uppercase;
    margin-bottom: 5px;
    font-size: 10px;
    color: ${({theme})=>theme.colors.dark2};
`
const ValidateButton = styled(Button)`
    padding: 0 12px;
    border-radius: 7px;
    height: 50px;
    width: fit-content;
`
export default BettingTips