import { useEffect, useState } from "react"
import { Button, FormControlWrapper, HomeStyle, Input, InputLabel, InputWrapper, Loading } from "../../theme/ThemeStyle"
import styled from 'styled-components'
import TokenInput from "./layout/TokenInput"
import { useHistory } from "react-router-dom/cjs/react-router-dom.min"
import { useDispatch, useSelector } from "react-redux"
import { api } from "../../common/api"
import { clearAuthError, createAuthError } from "../../app/auth/authSlice"
import Logo from "../dashboard/layout/Logo"
import validator from "validator"

const Register = () => {
    const history = useHistory()
    const dispatch = useDispatch()

    const [token, setToken] = useState(['', '', '', '', '','']); 
    const [loginId, setLoginId] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isSamePassword, setSamePassword] = useState(false)
    
    const { isAuthenticated, message, tokenExpires, isValidToken, loading, error } = useSelector(state => state.auth)
    const redirect = location.search ? location.search.split('=')[1] : '/dashboard';

    useEffect(()=>{
        if(isAuthenticated){
            history.push(redirect)
        }
        
    },[isAuthenticated, history, redirect])

    useEffect(()=>{
        dispatch(clearAuthError())
    },[dispatch])
    

    const validateUserHandler = (e)=>{
        e.preventDefault()
        
        const phoneRegex = /^(\+[0-9]{1,3})?(\s?[0-9]){10,14}[0-9]$/;
        const validEmail = validator.isEmail(loginId)
        const validNumber = phoneRegex.test(loginId)

        if(validEmail || validNumber){
            
            dispatch(api.validateUser(loginId))
        }else{
            
            dispatch(createAuthError('Enter a valid email or phone number'))
            // Report that user need to enter a valid userId
        }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(()=>setSamePassword(password === confirmPassword),[confirmPassword])

    const submitHandler = (e)=>{
        e.preventDefault()

        const userDetails = {
            loginId,
            password,
            username,
            token: token.join('')
        }

        if(isSamePassword){
            dispatch(api.register(userDetails))
        }
    }
    return (
        <HomeStyle>
            <FormControl>
                
                <Logo />
                
                <FormControlWrapper >
                    <Wrapper>
                        <Title>Unlock a world of possibilities</Title>
                        <Subtitle>Register to continue</Subtitle>
                    </Wrapper>

                    {(error||message)&&<Error value={`${error?'error':'message'}`}>
                        { error || message }
                    </Error>}

                    <Wrapper>
                        <form onSubmit={validateUserHandler}>
                            <InputWrapper>
                                <InputLabel value={loginId}>Email or Phone Number</InputLabel>
                                <Input disabled={isValidToken} placeholder="Email or Phone Number" label={loginId.length} value={loginId} onChange={e => setLoginId(e.target.value)}/>
                            </InputWrapper>

                            {!(message || isValidToken)&& <Button disabled={loading} type="submit"> <Loading value={loading} /> Get code</Button>}
                        </form>

                        {message && <CodeInputWrapper>
                            <TokenInput loginId={loginId} token={token} setToken={setToken} tokenExpires={tokenExpires}/>
                        </CodeInputWrapper>}

                        {isValidToken&&<form onSubmit={submitHandler}>
                            <InputWrapper>
                                <InputLabel value={username}>Username</InputLabel>
                                <Input 
                                    placeholder="Username" 
                                    label={username} 
                                    value={username} 
                                    onChange={e => setUsername(e.target.value)}/>
                            </InputWrapper>
                            <InputWrapper>
                                <InputLabel value={password}>Password</InputLabel>
                                <Input 
                                    placeholder="Password" 
                                    label={password} 
                                    value={password}
                                    type="password"
                                    onChange={e => setPassword(e.target.value)}/>
                            </InputWrapper>
                            <InputWrapper value="shake">
                                <InputLabel value={confirmPassword}>Confirm Password</InputLabel>
                                <Input 
                                    placeholder="Confirm Password" 
                                    label={confirmPassword} 
                                    value={confirmPassword}
                                    valid={confirmPassword.length > 0 && !isSamePassword?"no":""}
                                    type="password"
                                    onChange={(e)=>setConfirmPassword(e.target.value)}/>
                            </InputWrapper>
                            <TermsAndCond>I agree with the Terms & Conditions</TermsAndCond>
                            <Button type="submit" disabled={loading}> <Loading value={loading}/> Register</Button>
                        </form>}
                        
                        <RedirectAccess onClick={()=>history.push('/login')}>Already have an account?
                            <div className="" style={{marginLeft: "5px", color:"green"}}>Login Here</div>
                        </RedirectAccess>
                    </Wrapper>
                </FormControlWrapper>
            </FormControl>

        </HomeStyle>
    )
}


const TermsAndCond = styled.div`
    margin: 10px 0 5px;
`
const Error = styled.div`
    color: ${({theme, value})=> value==="error"?theme.colors.lost:theme.colors.won};
    text-align: center;
    padding: 10px;
    border-radius: 10px;
    border: solid 1px;
    margin: 10px;
`
const CodeInputWrapper = styled.div`
    background-color: rgba(79, 161, 94, 0.2);
    border-radius: 10px;
    padding: 10px;
    margin: 10px 0;
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
    margin: 5px 0;
`

export default Register