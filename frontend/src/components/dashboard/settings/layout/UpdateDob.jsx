import { useState } from "react"
import { Button, Input, InputLabel, InputWrapper, NoticeMessage } from "../../../../theme/ThemeStyle"
import styled from "styled-components"
import ModalContainter from "../../modals/ModalContainter"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import SettingsHeading from "./SettingsHeading"
import { faAngleRight } from "@fortawesome/free-solid-svg-icons"
import { useDispatch, useSelector } from "react-redux"
import { api } from "../../../../common/api"
import PropTypes from 'prop-types'
import { useEffect } from "react"
import { clearAuthError } from "../../../../app/auth/authSlice"

const UpdateDateOfBirth = ({dateOfBirth}) => {
    const dispatch = useDispatch()

    const [dob, setDob] = useState(dateOfBirth)
    const [isOpen, setOpen] = useState("closed")
    const handleModalClose = ()=> setOpen("closed")
    const handleModalOpen = ()=> setOpen("opened")
    const onChange = (e)=>setDob(e.target.value)

    const { loading, error } = useSelector(state => state.auth)
    
    const handleSubmit = (e)=>{
      e.preventDefault()
      dispatch(api.updateProfile({dob}))
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
            <Text>Date of birth</Text>
            <Text onClick={handleModalOpen}>
                {dateOfBirth}
                <FontAwesomeIcon style={{paddingLeft:"5px"}} icon={faAngleRight} />
            </Text>
        </Option>
        <ModalContainter isOpen={isOpen} handleModalClose={handleModalClose}>
            <>
                <SettingsHeading title={"Update Date of Bith"} handleClose={handleModalClose}/>
                <Wrapper onSubmit={handleSubmit}>
                    <NoticeMessage value={error?'error':''}>{error}</NoticeMessage>
                    <InputWrapper>
                        <InputLabel value={dob}>Date of Birth</InputLabel>
                        <Input 
                            invalud={error}
                            value={dob} 
                            label={dob} 
                            placeholder="Date of birth"
                            onChange={onChange}
                            type="date"/>
                    </InputWrapper>
                    <Button type="submit">Update</Button>
                </Wrapper>
            </>
        </ModalContainter>
    </div>
  )
}
UpdateDateOfBirth.propTypes = {
    dateOfBirth: PropTypes.string
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

export default UpdateDateOfBirth