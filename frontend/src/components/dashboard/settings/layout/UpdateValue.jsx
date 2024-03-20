import { useState } from "react"
import { Button, Input, InputLabel, InputWrapper, Loading, NoticeMessage } from "../../../../theme/ThemeStyle"
import styled from "styled-components"
import ModalContainter from "../../modals/ModalContainter"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import SettingsHeading from "./SettingsHeading"
import { faEdit } from "@fortawesome/free-solid-svg-icons"
import { useDispatch, useSelector } from "react-redux"
import { api } from "../../../../common/api"
import PropTypes from 'prop-types'
import { useEffect } from "react"
import { clearAuthError } from "../../../../app/auth/authSlice"

const UpdateValue = ({updateValue, name}) => {
    const dispatch = useDispatch()

    const [value, setValue] = useState(updateValue)
    const [isOpen, setOpen] = useState("closed")
    const handleModalClose = ()=> setOpen("closed")
    const handleModalOpen = ()=> setOpen("opened")
    const onChange = (e)=>setValue(e.target.value)

    const { loading, error } = useSelector(state => state.auth)
    
    const handleSubmit = (e)=>{
      e.preventDefault()
      dispatch(api.updateProfile({[name]:value}))
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
            <Title>{name}</Title>
            <Text onClick={handleModalOpen}>
                {updateValue}
                <EditIcon style={{paddingLeft:"5px"}} icon={faEdit} />
            </Text>
        </Option>
        <ModalContainter isOpen={isOpen} handleModalClose={handleModalClose}>
            <>
                <SettingsHeading title={`Update ${name}`} handleClose={handleModalClose}/>
                <Wrapper onSubmit={handleSubmit}>
                    <NoticeMessage value={error?'error':''}>{error}</NoticeMessage>
                    <InputWrapper>
                        <InputLabel value={value}>{name}</InputLabel>
                        <Input 
                            invalud={error}
                            value={value} 
                            label={value} 
                            placeholder={name}
                            onChange={onChange}/>
                    </InputWrapper>
                    <Button disabled={loading} type="submit">Update <Loading value={+loading} /></Button>
                </Wrapper>
            </>
        </ModalContainter>
    </div>
  )
}
UpdateValue.propTypes = {
    updateValue: PropTypes.string,
    name: PropTypes.string,
}
const Option = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px 5px;
    column-gap: 5px;
    border-bottom: solid 1px ${({theme})=> theme.colors.dark4};
    
`
const Text = styled.p`
    margin: 0;
`
const Title = styled(Text)`
    text-transform: capitalize;
`
const Wrapper = styled.form`
    padding: 10px;
`
const EditIcon = styled(FontAwesomeIcon)`
    color: ${({theme})=> theme.colors.accent}
`

export default UpdateValue