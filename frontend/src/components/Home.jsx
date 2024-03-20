import styled from 'styled-components'
import { Button, HomeStyle } from "../theme/ThemeStyle";
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
const Home = () => {
    const appName = import.meta.env.VITE_APP_NAME
    const history = useHistory();

    return (
        <HomeStyle>
            <Wrapper style={{alignItems:"center"}}>
                <img src="assets/fancyO.png" alt={appName} width="100px"/>
            </Wrapper>
            <Wrapper>
                <WelcomeMessage>Welcome to {appName} your go-to platform for low risk investment in the world of sports betting!</WelcomeMessage>
            </Wrapper>
            <Wrapper>
                <Title>Invest smarter</Title>
                <Subtitle>Not harder with {appName}</Subtitle>
            </Wrapper>

            <ButtonWrapper>
                <Btn onClick={()=>history.push('/register')}>Get Started</Btn>
                <Btn onClick={()=>history.push('/login')}>Login</Btn>
            </ButtonWrapper>

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

const ButtonWrapper = styled(Wrapper)`
    margin-top: 30px;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 10px;
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
    max-width: 300px;
    padding: 20px;
    background-color: #16414E;
`

export default Home