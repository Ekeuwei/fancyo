import styled from 'styled-components'
import { Button, HomeStyle } from "../theme/ThemeStyle";
import logo from '../assets/fancyO.png'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
const Home = () => {
    const appName = import.meta.env.VITE_APP_NAME
    const history = useHistory();

    return (
        <HomeStyle>
            Home
            <Wrapper style={{alignItems:"center"}}>
                <img src={logo} alt={appName} width="100px"/>

            </Wrapper>
            <Wrapper>
                <WelcomeMessage>Welcome to {appName} your go-to platform for low risk investment in the world of sports betting!</WelcomeMessage>
            </Wrapper>
            <Wrapper>
                <Title>Invest smarter</Title>
                <Subtitle>Not harder with {appName}</Subtitle>
            </Wrapper>

            <Wrapper style={{marginTop:"30px"}}>
                <Btn onClick={()=>history.push('/login')}>Get Started</Btn>
            </Wrapper>

        </HomeStyle>
    )
}


const WelcomeMessage = styled.h2`
    font-weight: 500;
    line-height: 1.25;
`

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    padding: 0 40px;
    margin: 1em 0;
`
const Title = styled.h1`
    font-weight: 600;
    font-size: 40px;
    text-transform: capitalize;
    margin: 0;
`
const Subtitle = styled.h3`
    font-weight: 500;
    margin: 0;
`
const Btn = styled(Button)`
    width: 100%;
    padding: 15px;
    background-color: #16414E;
`

export default Home