import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGear, faSignOut } from '@fortawesome/free-solid-svg-icons'
import { useDispatch, useSelector } from 'react-redux'
import { api } from '../../common/api'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'

const Header = () => {
    const dispatch = useDispatch()
    const history = useHistory()

    const logoutHandler = ()=> {
        dispatch(api.logout())
    }

    const user = JSON.parse(localStorage.getItem('user'))
    const { myProjects } = useSelector(state => state.project)
    
    return (
        <Wrapper>
            <Avatar onClick={()=>history.push('/settings/profile')}>
                <AvatarImage src={user?`/assets/avatars/${user.avatar.includes('.')?user.avatar:user.avatar+'.png'}`:'/assets/avatars/avatar1.png'} />
            </Avatar>
            <Details>
                <Title>Hi {user.username}</Title>
                {myProjects?.runningProjectsCount > 0?
                    <Subtitle>{`You have ${myProjects.runningProjectsCount} project${myProjects.runningProjectsCount>1?'s':''} in progress`}</Subtitle>:
                    <Subtitle>Bet Smarter, Earn Bigger! 🚀</Subtitle>}
            </Details>
            <Notification onClick={()=>history.push('/settings')}>
                <FontAwesomeIcon icon={faGear} size='lg'/>
            </Notification>
            <Notification onClick={logoutHandler}>
                <FontAwesomeIcon icon={faSignOut} size='lg'/>
            </Notification>
        </Wrapper>
    )
}
const Wrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    column-gap: 10px;
    padding: 10px;
`
const Avatar = styled.div`
    border-radius: 50%;
    width: 40px;
    height: 40px;
    overflow: hidden;
`
const AvatarImage = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover; 
`
const Details = styled.div`
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: center;
`
const Title = styled.h1`
    font-size: 18px;
    margin: 0;
`
const Subtitle = styled.h2`
    font-size: 14px;
    margin: 0;
    font-weight: 500;
`
const Notification = styled.div`
    padding: 10px;
`
export default Header