import { useEffect, useState } from "react"
import { Button, FormControlWrapper, HomeStyle, Input, InputLabel, InputWrapper, Loading, NoticeMessage, SubtleLabel } from "../../theme/ThemeStyle"
import TokenInput from "./layout/TokenInput"
import { useHistory } from "react-router-dom/cjs/react-router-dom.min"
import { useDispatch, useSelector } from "react-redux"
import { api } from "../../common/api"
import Logo from "../dashboard/layout/Logo"
import { clearAuthError } from "../../app/auth/authSlice"
import styled from "styled-components"
import PassworVisibilityIcon from "./layout/PassworVisibilityIcon"

const ForgotPassword = () => {
    const history = useHistory()
    const dispatch = useDispatch()

    const [token, setToken] = useState(['', '', '', '', '','']); 
    const [loginId, setLoginId] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isSamePassword, setSamePassword] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    
    const { isAuthenticated, message, isValidToken, tokenExpires, passwordReset, loading, error } = useSelector(state => state.auth)
    const redirect = location.search ? location.search.split('=')[1] : '/dashboard';

    useEffect(()=>{
        if(isAuthenticated){
            history.push(redirect)
        }
        
    },[isAuthenticated, history, redirect])

    const handleLoginIdValidation = ()=>{
        if(loginId.length > 3){
            
            dispatch(api.forgotPassword(loginId))
        }else{
            // Report that user need to enter a valid userId
        }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(()=>{
        setSamePassword(password === confirmPassword)
    },[confirmPassword, password])

    const submitHandler = (e)=>{
        e.preventDefault()

        const credentials = {
            loginId,
            password,
            token: token.join('')
        }

        if(isSamePassword){
            dispatch(api.resetPassword(credentials))
        }
    }

    useEffect(()=>{
        dispatch(clearAuthError())
    },[dispatch])

    return (
        <HomeStyle>
            <FormControl onSubmit={submitHandler}>

                <Logo />
                
                <FormControlWrapper >
                    <Wrapper>
                        <Title>Forgot Password</Title>
                        <Subtitle>Reset your password</Subtitle>
                    </Wrapper>

                    <NoticeMessage value={`${error?'error':message?'message':''}`}>
                        { error || message }
                    </NoticeMessage>

                    <Wrapper>
                        <InputWrapper>
                            <InputLabel value={loginId}>Email or Phone Number</InputLabel>
                            <Input disabled={isValidToken} placeholder="Email or Phone Number" label={loginId.length} value={loginId} onChange={e => setLoginId(e.target.value)}/>
                        </InputWrapper>

                        {!(message || isValidToken)&& <Button disabled={loading} onClick={handleLoginIdValidation}>Get code <Loading value={loading}/></Button>}

                        {message && !passwordReset && <CodeInputWrapper>
                            <TokenInput loginId={loginId} token={token} setToken={setToken} tokenExpires={tokenExpires}/>
                        </CodeInputWrapper>}

                        {isValidToken&& !passwordReset&& <>
                            <InputWrapper>
                                <InputLabel value={password}>New Password</InputLabel>
                                <Input 
                                    placeholder="New Password" 
                                    label={password} 
                                    value={password}
                                    type={showPassword?'text':'password'}
                                    onChange={e => setPassword(e.target.value)}/>
                                <PassworVisibilityIcon showPassword={showPassword} setShowPassword={setShowPassword}/>
                            </InputWrapper>
                            <InputWrapper value="shake">
                                <InputLabel value={confirmPassword}>Confirm Password</InputLabel>
                                <Input 
                                    placeholder="Confirm Password" 
                                    label={confirmPassword} 
                                    value={confirmPassword}
                                    invalid={confirmPassword.length > 0 && !isSamePassword?"error":""}
                                    type={showPassword?'text':'password'}
                                    onChange={(e)=>setConfirmPassword(e.target.value)}/>

                                {confirmPassword.length > 0 && !isSamePassword&&
                                    <SubtleLabel value="error">Password does not match</SubtleLabel>}
                                    
                            </InputWrapper>
                            <Button type="submit" disabled={loading}>Submit <Loading value={loading}/></Button>
                        </>}
                        
                        <RedirectAccess onClick={()=>history.push('/login')}>Already have an account?
                            <div className="" style={{marginLeft: "5px", color:"green"}}>Login Here</div>
                        </RedirectAccess>
                    </Wrapper>
                </FormControlWrapper>
            </FormControl>

        </HomeStyle>
    )
}



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
const FormControl = styled.form`
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

export default ForgotPassword