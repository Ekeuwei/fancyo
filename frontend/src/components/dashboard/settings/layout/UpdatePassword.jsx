import { useEffect, useState } from 'react'
import { Button, Input, InputLabel, InputWrapper, Loading, NoticeMessage, SubtleLabel } from '../../../../theme/ThemeStyle'
import PropTypes from 'prop-types'
import SettingsHeading from './SettingsHeading'
import ModalContainter from '../../modals/ModalContainter'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleRight } from '@fortawesome/free-solid-svg-icons'
import { useDispatch, useSelector } from 'react-redux'
import { api } from '../../../../common/api'
import { createToast } from '../../../../app/user/userSlice'
import { clearAuthError } from '../../../../app/auth/authSlice'

const UpdatePassword = () => {
  const dispatch = useDispatch()

  const [data, setData] = useState({
    oldPassword: "",
    password: "",
    confirmPassword: ""
  })
  const [emptyFields, setEmptyFields] = useState([])
  const [isSamePassword, setSamePassword] = useState(false)
  const { loading, error, message } = useSelector(state => state.auth)
  
  const onChange = (e)=> setData(prevData => ({...prevData, [e.target.name]:e.target.value}))
  
  const [isOpen, setOpen] = useState("closed")
  const handleModalClose = ()=> setOpen("closed")
  const handleModalOpen = ()=> setOpen("opened")
  
  const handleSubmit = (e)=>{
    e.preventDefault()

    const newEmptyFields = Object.keys(data).filter(key => data[key]==='')
    setEmptyFields(newEmptyFields)

    if(newEmptyFields.length === 0){
      dispatch(api.updatePassword(data))
    }

  }

  useEffect(()=>{
    if(emptyFields.length > 0){
      const timeoutId = setTimeout(()=>setEmptyFields([]), 1000)

      return ()=> clearTimeout(timeoutId)
    }
  },[emptyFields])

  useEffect(()=>{
      setSamePassword(data.password === data.confirmPassword)
  },[data])
  
  useEffect(()=>{
    if(message){
      dispatch(createToast({message, type: 'success'}))
      handleModalClose()
      dispatch(clearAuthError())
      setData(prev => Object.keys(prev).reduce((acc, key)=>(acc[key]='', acc),{}))
    }
  },[message, dispatch])

  return (
    <div>
      <Option  onClick={handleModalOpen}>
            <Text>Change Password</Text>
            <Text>
                <FontAwesomeIcon style={{paddingLeft:"5px"}} icon={faAngleRight} />
            </Text>
        </Option>
      <ModalContainter isOpen={isOpen} handleModalClose={handleModalClose}>
        <form onSubmit={handleSubmit}>
          <SettingsHeading title={"Update Password"} handleClose={handleModalClose}/>
          <Wrapper>
            <NoticeMessage value={error?'error':''}>{error}</NoticeMessage>
            <InputWrapper value={emptyFields.includes('oldPassword')?"error":""}>
                <InputLabel value={data.oldPassword}>Old Password</InputLabel>
                <Input 
                  invalid={emptyFields.includes('oldPassword')?'empty':''}
                  label={data.oldPassword} 
                  value={data.oldPassword} 
                  placeholder='Old Password' 
                  name="oldPassword"
                  type='password'
                  onChange={onChange}/>
            </InputWrapper>
            <InputWrapper value={emptyFields.includes('password')?"error":""}>
                <InputLabel value={data.password}>New Password</InputLabel>
                <Input 
                  invalid={emptyFields.includes('password')?'empty':''}
                  label={data.password} 
                  value={data.password} 
                  placeholder='New Password' 
                  name="password"
                  type='password'
                  onChange={onChange}/>
            </InputWrapper>
            <InputWrapper value={emptyFields.includes('confirmPassword')?"error":""}>
                <InputLabel value={data.confirmPassword}>Confirm Password</InputLabel>
                <Input 
                  invalid={emptyFields.includes('confirmPassword')||(data.confirmPassword.length > 0 && !isSamePassword)?'empty':''}
                  label={data.confirmPassword} 
                  value={data.confirmPassword} 
                  placeholder='Confirm Password' 
                  name="confirmPassword"
                  type='password'
                  onChange={onChange}/>

                {emptyFields.includes('confirmPassword')||(data.confirmPassword.length > 0 && !isSamePassword)&&
                  <SubtleLabel value="error">Password does not match</SubtleLabel>}
                  
            </InputWrapper>

            <Button type='submit'>Update <Loading value={loading}/></Button>

          </Wrapper>
        </form>
      </ModalContainter>
    </div>
  )
}

UpdatePassword.propTypes = {
  isOpen: PropTypes.string,
  handleModalClose: PropTypes.func
}

const Option = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px 5px;
`
const Text = styled.p`
    margin: 0;
`
const Wrapper = styled.div`
  padding: 10px;
`

export default UpdatePassword