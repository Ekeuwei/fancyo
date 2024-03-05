import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import styled from "styled-components"
import SettingsHeading from "./layout/SettingsHeading"
import SettingsSubHeading from "./layout/SettingsSubHeading"
import { useHistory } from "react-router-dom/cjs/react-router-dom.min"
import UpdatePassword from "./layout/UpdatePassword"
import ToggleButton from "../layout/ToggleRadioButton"
import DarkModeButton from "./layout/DarkModeButton"
import { faAngleRight } from "@fortawesome/free-solid-svg-icons"
import { useDispatch } from "react-redux"
import { api } from "../../../common/api"
import { useState } from "react"

const Settings = () => {
    const user = JSON.parse(localStorage.getItem('user'))
    const dispatch = useDispatch()
    const history = useHistory();
    const [preferences, setPreferences] = useState(user.preferences)
    
    const handleToggle = (name) => {
        let newPreferences = {
            ...preferences, 
                getNotifiedBy:{
                    ...preferences.getNotifiedBy, 
                    [name]: !preferences.getNotifiedBy[name]
                }
            }
        
        setPreferences(newPreferences)
        dispatch(api.updateProfile({preferences: newPreferences}))
    }

  return (
    <div>
        <SettingsHeading title={'Settings'}/>
        <Option onClick={()=>history.push('/settings/profile')}>
            <Text>Profile</Text>
            <Icon>
                <FontAwesomeIcon icon={faAngleRight} />
            </Icon>
        </Option>
        <SettingsSubHeading title={"Notification"} />
        <Option>
            <Text>Email Notification</Text>
            <ToggleButton value='email' isChecked={preferences.getNotifiedBy.email} handleToggle={()=>handleToggle('email')}/>
        </Option>
        <Option>
            <Text>SMS Notification</Text>
            <ToggleButton value='sms' isChecked={preferences.getNotifiedBy.sms} handleToggle={()=>handleToggle('sms')}/>
        </Option>
        <SettingsSubHeading title={"Security & Safety"} />
        <UpdatePassword />
        <SettingsSubHeading title={"Theme"} />
        <DarkModeButton darkMode={user?.preferences.darkMode}/>
    </div>
  )
}

const Option = styled.div`
    display: flex;
    align-items: center;
    padding: 0 5px;
    justify-content: space-between;
`
const Text = styled.p`
    margin: 0;
    padding: 15px 0;
`
const Icon = styled.div`
    padding: 15px 0;
`
export default Settings