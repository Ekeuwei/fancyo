import { useState } from 'react'
import { Button, InputLabel, InputWrapper, Loading, NoticeMessage, TextArea } from '../../../../theme/ThemeStyle'
import PropTypes from 'prop-types'
import SettingsHeading from './SettingsHeading'
import ModalContainter from '../../modals/ModalContainter'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit } from '@fortawesome/free-solid-svg-icons'
import { useDispatch, useSelector } from 'react-redux'
import { api } from '../../../../common/api'
import { useEffect } from 'react'
import { clearAuthError } from '../../../../app/auth/authSlice'

const UpdateBio = ({initialValue}) => {
  const dispatch = useDispatch()
  const [bio, setBio] = useState(initialValue)
  const onChange = (e)=> setBio(e.target.value)
  
  const [isOpen, setOpen] = useState("closed")
  const handleModalClose = ()=> setOpen("closed")
  const handleModalOpen = ()=> setOpen("opened")

  const { loading, error } = useSelector(state => state.auth)
  
  const handleSubmit = (e)=>{
    e.preventDefault()
    dispatch(api.updateProfile({bio}))
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
            <Text>Bio</Text>
            <Text>{bio} <EditIcon onClick={handleModalOpen} icon={faEdit}/></Text>
        </Option>
      <ModalContainter isOpen={isOpen} handleModalClose={handleModalClose}>
        <>
          <SettingsHeading title={"Update bio"} handleClose={handleModalClose} />
          <Wrapper onSubmit={handleSubmit}>
            <NoticeMessage value={error?'error':''}>{error}</NoticeMessage>
            <InputWrapper>
                <InputLabel value={bio}>bio</InputLabel>
                <TextArea 
                  invalid={error}
                  label={bio} 
                  value={bio} 
                  placeholder='bio' 
                  rows={7}
                  onChange={onChange}/>
            </InputWrapper>
            <Button type='submit'>Update <Loading value={loading} /></Button>

          </Wrapper>
        </>
      </ModalContainter>
    </div>
  )
}

UpdateBio.propTypes = {
  isOpen: PropTypes.string,
  handleModalClose: PropTypes.func,
  initialValue: PropTypes.string,
}

const Option = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    row-gap: 10px;
    padding: 15px 5px;
    border-bottom: solid 1px ${({theme})=> theme.colors.dark4};
`
const Text = styled.p`
    margin: 0;
`
const Wrapper = styled.form`
  padding: 10px;
`
const EditIcon = styled(FontAwesomeIcon)`
    color: ${({theme})=> theme.colors.accent}
`
export default UpdateBio