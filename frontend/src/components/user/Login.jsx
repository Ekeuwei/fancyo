import { useEffect, useState } from "react"
import { Button, FormControlWrapper, HomeStyle, Input, InputLabel, InputWrapper, Loading } from "../../theme/ThemeStyle"
import styled from 'styled-components'
import { appName } from "../../App"
import { useHistory } from "react-router-dom/cjs/react-router-dom.min"
import { useDispatch, useSelector } from "react-redux"
import { api } from "../../common/api"
import { clearAuthError } from "../../app/auth/authSlice"

const Login = () => {
    const dispatch = useDispatch()
    const [loginId, setLoginId] = useState("")
    const [password, setPassword] = useState("")
    const history = useHistory();

    const redirect = location.search ? location.search.split('=')[1] : '/dashboard';
    
    const { isAuthenticated, loading, message, error } = useSelector(state => state.auth)

    const submitHandler = (e)=>{
        e.preventDefault();
        dispatch(api.login(loginId, password))
    }

    useEffect(()=>{
        if(isAuthenticated){
            history.push(redirect)
        }
        
    },[isAuthenticated, history, redirect])

    useEffect(()=>{
        dispatch(clearAuthError())
    },[dispatch])
    
    return (
        <HomeStyle>
            <FormControl>
                <IconWrapper>

                <img src="../src/assets/fancyO.png" alt={appName} width="100px"/>
                </IconWrapper>
                
                <FormControlWrapper onSubmit={submitHandler} >
                    <Wrapper>
                        <Title>Welcome back</Title>
                        <Subtitle>Login to continue</Subtitle>
                    </Wrapper>

                    {(error||message)&&<Message value={`${error?'error':'message'}`}>
                        { error || message }
                    </Message>}

                    <Wrapper>
                        <InputWrapper>
                            <InputLabel value={loginId}>Username</InputLabel>
                            <Input placeholder="Username" label={loginId} value={loginId} onChange={e => setLoginId(e.target.value)}/>
                        </InputWrapper>
                        <InputWrapper>
                            <InputLabel value={password}>Password</InputLabel>
                            <Input 
                                placeholder="Password" 
                                label={password} 
                                value={password}
                                type="password"
                                onChange={e => setPassword(e.target.value)}
                            />
                        </InputWrapper>
                        <Label onClick={()=>history.push('/password/forgot')}>Forgot password</Label>
                        <Button type="submit" disabled={loading}> <Loading value={loading} /> Login</Button>
                        <RedirectAccess onClick={()=>history.push('/register')}>Doesn’t have an account?
                            <div className="" style={{marginLeft: "5px", color:"green"}}>Register Now</div>
                        </RedirectAccess>
                    </Wrapper>
                </FormControlWrapper>
            </FormControl>

        </HomeStyle>
    )
}

const IconWrapper = styled.div`
    display: flex;
    justify-content: center;
`

const Message = styled.div`
    color: ${({theme, value})=> value==="error"?theme.colors.lost:theme.colors.won};
    text-align: center;
    padding: 10px;
    border-radius: 10px;
    border: solid 1px;
    margin: 10px;
`

const Label = styled.div`
    font-size: 12px;
    font-weight: 500;
    margin-bottom: 10px;
    text-align: right;
    color: green;
    cursor: pointer;
`
const RedirectAccess = styled.div`
    margin-top: 5px;
    font-size: 12px;
    font-weight: 500;
    display: flex;
    justify-content: center;
    cursor: pointer;
`
const FormControl = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    row-gap: 50px;
    height: 100%;
`

const Wrapper = styled.div`
    margin-top: 20px;
`
const Title = styled.h1`
    font-size: 24px;
    font-weight: 600;
    margin: 0;
`
const Subtitle = styled.h2`
    font-weight: 400;
    font-size: 16px;
    margin: 0;
`

export default Login