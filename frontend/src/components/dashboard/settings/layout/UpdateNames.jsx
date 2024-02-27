import { useState } from 'react'
import { Button, Input, InputLabel, InputWrapper, Loading, NoticeMessage } from '../../../../theme/ThemeStyle'
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

const UpdateNames = ({accountUpdateError}) => {
  const dispatch = useDispatch()

  const { user } = useSelector(state => state.auth)

  const [names, setNames] = useState({firstName:user?.firstName, otherNames:user?.otherNames})
  const [emptyFields, setEmptyFields] = useState([])

  const onChange = (e)=> setNames(prevNames => {
    return ({...prevNames, [e.target.name]:e.target.value})
  })
  
  const [isOpen, setOpen] = useState("closed")
  const handleModalClose = ()=> setOpen("closed")
  const handleModalOpen = ()=> setOpen("opened")

  const { loading, error } = useSelector(state => state.auth)
  
  const handleSubmit = (e)=>{
    e.preventDefault()
    const newEmptyFields = Object.keys(names).filter(key => !names[key]||names[key]==='')
    setEmptyFields(newEmptyFields)
    if(newEmptyFields.length === 0){
      dispatch(api.updateProfile(names))
    }else{
      const timeoutId = setTimeout(()=>setEmptyFields([]),1000)
      return ()=> clearTimeout(timeoutId)
    }
  }

  useEffect(()=>{
    if(!(loading || error)){
      dispatch(clearAuthError())
      handleModalClose()
    }
  }, [loading, error, dispatch])

  return (
    <div>
      <Option onClick={handleModalOpen} value={accountUpdateError}> <FontAwesomeIcon icon={faEdit}/> update names </Option>
      <ModalContainter isOpen={isOpen} handleModalClose={handleModalClose}>
        <>
          <SettingsHeading title={"Update names"} handleClose={handleModalClose} />
          <Wrapper onSubmit={handleSubmit}>
            <NoticeMessage value={error?'error':''}>{error}</NoticeMessage>
            <InputWrapper value={emptyFields.includes('firstName')?'error':''}>
                <InputLabel value={names.firstName}>First Name</InputLabel>
                <Input 
                  invalid={emptyFields.includes('firstName')}
                  label={names.firstName} 
                  value={names.firstName} 
                  placeholder='First Name'
                  autoComplete='off'
                  name='firstName' 
                  onChange={onChange}/>
            </InputWrapper>
            <InputWrapper value={emptyFields.includes('otherNames')?'error':''}>
                <InputLabel value={names.otherNames}>Other names</InputLabel>
                <Input 
                  invalid={emptyFields.includes('otherNames')}
                  label={names.otherNames} 
                  value={names.otherNames} 
                  placeholder='Other Names' 
                  autoComplete='off'
                  name='otherNames' 
                  onChange={onChange}/>
            </InputWrapper>
            <Button type='submit'>Update <Loading value={loading} /></Button>

          </Wrapper>
        </>
      </ModalContainter>
    </div>
  )
}

UpdateNames.propTypes = {
  isOpen: PropTypes.string,
  handleModalClose: PropTypes.func,
  accountUpdateError: PropTypes.string,
}

const Option = styled.div`
  display: ${({value})=>value?.includes('update your profile')?'inline-flex':'none'};
  padding: 3px;
  margin-top: 5px;
  border-bottom: solid 1px;
  color: ${({theme})=> theme.colors.accent};
  cursor: pointer;
`

const Wrapper = styled.form`
  padding: 10px;
`

export default UpdateNames