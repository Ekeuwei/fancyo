import { useState } from 'react'
import { Button, Input, InputLabel, InputWrapper, Loading, NoticeMessage } from '../../../../theme/ThemeStyle'
import PropTypes from 'prop-types'
import SettingsHeading from './SettingsHeading'
import ModalContainter from '../../modals/ModalContainter'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleRight } from '@fortawesome/free-solid-svg-icons'
import { useDispatch, useSelector } from 'react-redux'
import { api } from '../../../../common/api'
import { useEffect } from 'react'
import { clearAuthError } from '../../../../app/auth/authSlice'

const UpdateUsername = ({userName}) => {
  const dispatch = useDispatch()
  const [username, setUsername] = useState(userName)
  const onChange = (e)=> setUsername(e.target.value)
  
  const [isOpen, setOpen] = useState("closed")
  const handleModalClose = ()=> setOpen("closed")
  const handleModalOpen = ()=> setOpen("opened")

  const { loading, error } = useSelector(state => state.auth)
  
  const handleSubmit = (e)=>{
    e.preventDefault()
    dispatch(api.updateProfile({username}))
  }

  useEffect(()=>{
    if(!(loading || error)){
      dispatch(clearAuthError())
      handleModalClose()
    }
  }, [loading, error, dispatch])

  return (
    <div>
      <Option>
            <Text>Username</Text>
            <Text onClick={handleModalOpen}>
                Edit
                <FontAwesomeIcon style={{paddingLeft:"5px"}} icon={faAngleRight} />
            </Text>
        </Option>
      <ModalContainter isOpen={isOpen} handleModalClose={handleModalClose}>
        <>
          <SettingsHeading title={"Update Username"} handleClose={handleModalClose} />
          <Wrapper onSubmit={handleSubmit}>
            <NoticeMessage value={error?'error':''}>{error}</NoticeMessage>
            <InputWrapper>
                <InputLabel value={username}>Username</InputLabel>
                <Input 
                  invalid={error}
                  label={username} 
                  value={username} 
                  placeholder='Username' 
                  onChange={onChange}/>
            </InputWrapper>
            <Button disabled={loading} type='submit'>Update <Loading value={+loading} /></Button>

          </Wrapper>
        </>
      </ModalContainter>
    </div>
  )
}

UpdateUsername.propTypes = {
  isOpen: PropTypes.string,
  handleModalClose: PropTypes.func,
  userName: PropTypes.string,
}

const Option = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px 5px;
    border-bottom: solid 1px ${({theme})=> theme.colors.dark4};
`
const Text = styled.p`
    margin: 0;
`
const Wrapper = styled.form`
  padding: 10px;
`

export default UpdateUsername