import { useState } from "react"
import { BodyWrapper, Button, Input, InputLabel, InputWrapper, Loading, NoticeMessage } from "../../theme/ThemeStyle"
import styled from "styled-components"
import { useDispatch, useSelector } from "react-redux"
import { clearUserErrors, createUserError } from "../../app/user/userSlice"
import { api } from "../../common/api"
import NavHeader from "../dashboard/layout/NavHeader"

const ValidateBvn = () => {
  const dispatch = useDispatch()
  const [bvn, setBvn] = useState('')

  const { loading, error, bvnDetails } = useSelector(state => state.user)

  const fetchBvn = (e)=>{
    e.preventDefault()

    if(bvn.length === 11){
        dispatch(api.fetchBvnDetails(bvn))
    }else{
        dispatch(createUserError('Enter valid bvn'))
    }
  }

  const handleBvnInput = (e)=>{
    if(error){
        dispatch(clearUserErrors())
    }

    if(e.target.value.length <= 11){
        setBvn(e.target.value)
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

        <form onSubmit={fetchBvn}>
          <InputWrapper>
            <InputLabel value={bvn} >BVN</InputLabel>
            <Input 
              label={bvn} 
              value={bvn} 
              type="number"
              maxLength="11"
              onChange={handleBvnInput} 
              placeholder="Enter BVN"/>

            <ValidateButton disabled={loading || !bvn.length===11} type="submit">
                Validate <Loading value={loading} />
            </ValidateButton>
          </InputWrapper>



        </form>

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
    position: absolute;
    right: 2px;
    bottom: 50%;
    z-index: 1;
    padding: 0 12px;
    border-radius: 7px;
    transform: translateY(50%);
    height: calc(100% - 4px);
    width: fit-content;
`
export default ValidateBvn