import { useEffect, useState } from "react"
import { Button, FormControlWrapper, HomeStyle, Input, InputButton, InputIcon, InputLabel, InputWrapper, Loading, NoticeMessage, SubtleLabel, TextArea } from "../../theme/ThemeStyle"
import styled from 'styled-components'
import TokenInput from "./layout/TokenInput"
import { useHistory } from "react-router-dom/cjs/react-router-dom.min"
import { useDispatch, useSelector } from "react-redux"
import { api } from "../../common/api"
import { clearAuthError, createAuthError } from "../../app/auth/authSlice"
import Logo from "../dashboard/layout/Logo"
import validator from "validator"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons"

const RegisterPunter = () => {
    const history = useHistory()
    const dispatch = useDispatch()

    const [isSamePassword, setSamePassword] = useState(false)
    const [token, setToken] = useState(['', '', '', '', '','']); 
    const [data, setData] = useState({
        email: '',
        bio: '',
        username: '',
        password:'',
        confirmPassword:'',
    })
    const [emptyFields, setEmptyFields] = useState([])

    const onChange = (e)=> {
        if(error){
            dispatch(clearAuthError())
        }
        setData(prevData => ({...prevData, [e.target.name]:e.target.value}))
    }
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
    
    const sendOTP = (e)=>{
        e.preventDefault()
        
        const validEmail = validator.isEmail(data.email)

        if(validEmail){
            dispatch(api.validateUser(data.email))
        }else{
            dispatch(createAuthError('Enter a valid email'))
        }
    }

    const submitHandler = (e)=>{
        e.preventDefault()
        
        const validEmail = validator.isEmail(data.email)

        const newEmptyFields = Object.keys(data).filter(key => data[key] === '')
        setEmptyFields(newEmptyFields)

        if(!validEmail){
            dispatch(createAuthError('Enter a valid email'))
        }
        else if(!isValidToken){
            dispatch(createAuthError('Email not verified'))
        }
        else if(newEmptyFields.length === 0){
            dispatch(api.registerPunter({...data, token: token.join('')}))
        }

    }
    
    useEffect(()=>{
        if(emptyFields.length > 0){
            const timeoutId = setTimeout(()=>setEmptyFields([]), 500)
            return ()=> clearTimeout(timeoutId)
        }
    },[emptyFields])

    useEffect(()=>{
        setSamePassword(data.password === data.confirmPassword)
    },[data.confirmPassword, data.password])


    return (
        <HomeStyle>
            <FormControl>
                
                <Logo logoUrl='assets/cashpanthers.png' />
                
                <FormControlWrapper >
                    <Wrapper>
                        <Title>Punter Registration</Title>
                        <Subtitle>A whole world awaits</Subtitle>
                    </Wrapper>

                    {(error||message)&&<NoticeMessage value={`${error?'error':'message'}`}>
                        { error || message }
                    </NoticeMessage>}

                    <Wrapper>
                        <form onSubmit={submitHandler}>
                            <InputWrapper value={emptyFields.includes('username')?'error':''}>
                                <InputLabel value={data.username}>Username</InputLabel>
                                <Input 
                                    placeholder="Username" 
                                    label={data.username} 
                                    value={data.username} 
                                    name="username"
                                    autoComplete="off"
                                    onChange={onChange}/>
                            </InputWrapper>
                            <InputWrapper value={emptyFields.includes('bio')?'error':''}>
                                <InputLabel value={data.bio}>About yourself</InputLabel>
                                <TextArea 
                                    placeholder="Briefly tell us about yourself" 
                                    label={data.bio} 
                                    value={data.bio} 
                                    rows={5}
                                    name="bio"
                                    onChange={onChange}/>
                            </InputWrapper>
                            <InputWrapper value={emptyFields.includes('email')?'error':''}>
                                <InputLabel value={data.email}>Email</InputLabel>
                                <Input disabled={isValidToken} placeholder="Email" name="email" label={data.email} value={data.email} onChange={onChange}/>
                                
                                {isValidToken?
                                    <InputIcon color="success"><FontAwesomeIcon icon={faCheckCircle}/></InputIcon>:
                                    <InputButton type='button' disabled={loading || isValidToken} onClick={sendOTP}> Verify <Loading value={loading} /></InputButton>
                                }
                            </InputWrapper>

                            {message && 
                                <TokenInput 
                                    loginId={data.email} 
                                    token={token} 
                                    setToken={setToken} 
                                    tokenExpires={tokenExpires}
                                    />}

                            <InputWrapper value={emptyFields.includes('password')?'error':''}>
                                <InputLabel value={data.password}>Password</InputLabel>
                                <Input 
                                    placeholder="Password" 
                                    label={data.password} 
                                    value={data.password}
                                    type="password"
                                    name="password"
                                    onChange={onChange}/>
                            </InputWrapper>
                            <InputWrapper value={emptyFields.includes('confirmPassword')?'error':''}>
                                <InputLabel value={data.confirmPassword}>Confirm Password</InputLabel>
                                <Input 
                                    placeholder="Confirm Password" 
                                    invalid={data.confirmPassword.length > 0 && !isSamePassword}
                                    label={data.confirmPassword} 
                                    value={data.confirmPassword}
                                    valid={data.confirmPassword.length > 0 && !isSamePassword?"no":""}
                                    type="password"
                                    name="confirmPassword"
                                    onChange={onChange}/>
                                    {data.confirmPassword.length > 0 && !isSamePassword&&
                                    <SubtleLabel value="error">Password does not match</SubtleLabel>}
                            </InputWrapper>
                            <TermsAndCond>I agree with the Terms & Conditions</TermsAndCond>
                            <Button type="submit" disabled={loading || !isSamePassword}> <Loading value={isValidToken && loading}/> Register</Button>
                        </form>
                        
                    </Wrapper>
                </FormControlWrapper>
            </FormControl>

        </HomeStyle>
    )
}


const TermsAndCond = styled.div`
    margin: 10px 0 5px;
`

const FormControl = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    row-gap: 50px;
    margin: 20px auto;
    max-width: 500px;
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

export default RegisterPunter