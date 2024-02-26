import styled from 'styled-components'
import SettingsHeading from './layout/SettingsHeading'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import UpdateEmail from './layout/UpdateEmail'
import UpdateUsername from './layout/UpdateUsername'
import { faAngleRight } from '@fortawesome/free-solid-svg-icons'
import { Avatar, AvatarOverlay, BodyWrapper } from '../../../theme/ThemeStyle'

const ProfileSettings = () => {
    const user = JSON.parse(localStorage.getItem('user'))
    return (
        <div>
            <SettingsHeading title={"Profile"} />
            <BodyWrapper>
                <AvatarO>
                    <Avatar src='../assets/avatar.png'/>
                </AvatarO>
                <OptionsWrapper>
                    <UpdateUsername userName={user?.username}/>
                    <Option>
                        <Text>First Name</Text>
                        <Text>{user.firstName} </Text>
                    </Option>
                    <Option>
                        <Text>Last Name</Text>
                        <Text>{user.lastName}</Text>
                    </Option>
                    <Option>
                        <Text>Date of birth</Text>
                        <Text>{user.dob||'Edit'} <FontAwesomeIcon style={{paddingLeft:"5px"}} icon={faAngleRight} /></Text>
                    </Option>
                    <Option>
                        <Text>Location</Text>
                        <Text>{user.address||'Nigeria'} <FontAwesomeIcon style={{paddingLeft:"5px"}} icon={faAngleRight} /></Text>
                    </Option>
                    <UpdateEmail userEmail={user?.email}/>
                </OptionsWrapper>
            </BodyWrapper>
        </div>
    )
}


const OptionsWrapper = styled.div``
const Option = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px 5px;
    border-bottom: solid 1px ${({theme})=> theme.colors.dark4};
    &:first-child{
        border-top: solid 1px ${({theme})=> theme.colors.dark4};
    }
    
`
const Text = styled.p`
    margin: 0;
`

const AvatarO = styled(AvatarOverlay)`
    width: 120px;
    height: 120px;
    align-self: center;
`


export default ProfileSettings