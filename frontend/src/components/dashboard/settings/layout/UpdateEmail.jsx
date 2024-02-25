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

const UpdateEmail = ({userEmail}) => {
    const dispatch = useDispatch()

    const [email, setEmail] = useState(userEmail)
    const [isOpen, setOpen] = useState("closed")
    const handleModalClose = ()=> setOpen("closed")
    const handleModalOpen = ()=> setOpen("opened")
    const onChange = (e)=>setEmail(e.target.value)

    const { loading, error } = useSelector(state => state.auth)
    
    const handleSubmit = (e)=>{
      e.preventDefault()
      dispatch(api.updateProfile({email}))
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
            <Text>Email</Text>
            <Text onClick={handleModalOpen}>
                {userEmail}
                <FontAwesomeIcon style={{paddingLeft:"5px"}} icon={faAngleRight} />
            </Text>
        </Option>
        <ModalContainter isOpen={isOpen} handleModalClose={handleModalClose}>
            <>
                <SettingsHeading title={"Update Email"} handleClose={handleModalClose}/>
                <Wrapper onSubmit={handleSubmit}>
                    <NoticeMessage value={error?'error':''}>{error}</NoticeMessage>
                    <InputWrapper>
                        <InputLabel value={email}>Email</InputLabel>
                        <Input 
                            invalud={error}
                            value={email} 
                            label={email} 
                            placeholder="Email"
                            onChange={onChange}
                            type="email"/>
                    </InputWrapper>
                    <Button type="submit">Update</Button>
                </Wrapper>
            </>
        </ModalContainter>
    </div>
  )
}
UpdateEmail.propTypes = {
    userEmail: PropTypes.string
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

export default UpdateEmail