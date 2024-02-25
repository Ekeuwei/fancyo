import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGear, faSignOut } from '@fortawesome/free-solid-svg-icons'
import { useDispatch } from 'react-redux'
import { api } from '../../common/api'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'

const Header = () => {
    const dispatch = useDispatch()
    const history = useHistory()

    const logoutHandler = ()=> {
        dispatch(api.logout())
    }

    const user = JSON.parse(localStorage.getItem('user'))
    
    return (
        <Wrapper>
            <Avatar>
                <AvatarImage src='../src/assets/avatar.png' />
            </Avatar>
            <Details>
                <Title>Hi {user.username}</Title>
                <Subtitle>You have 7 projects in progress</Subtitle>
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