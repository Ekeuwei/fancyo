import styled from 'styled-components'
import SettingsHeading from './layout/SettingsHeading'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import UpdateEmail from './layout/UpdateEmail'
import UpdateUsername from './layout/UpdateUsername'
import { faAngleRight } from '@fortawesome/free-solid-svg-icons'
import { BodyWrapper } from '../../../theme/ThemeStyle'
import AvatarGallery from './layout/AvatarGallery'
import UpdateDateOfBirth from './layout/UpdateDob'
import UpdateBio from './layout/UpdateBio'

const ProfileSettings = () => {
    const user = JSON.parse(localStorage.getItem('user'))
    return (
        <div>
            <SettingsHeading title={"Profile"} />
            <BodyWrapper>
                <AvatarGallery />
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
                    <UpdateDateOfBirth dateOfBirth={user.dob} />
                    <Option>
                        <Text>Location</Text>
                        <Text>{user.address||'Nigeria'} <FontAwesomeIcon style={{paddingLeft:"5px"}} icon={faAngleRight} /></Text>
                    </Option>
                    <UpdateEmail userEmail={user?.email}/>
                    {user?.role==='punter'&&<UpdateBio initialValue={user?.bio}/>}
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



export default ProfileSettings