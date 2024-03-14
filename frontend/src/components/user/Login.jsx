import { useEffect, useState } from "react"
import { Button, FormControlWrapper, HomeStyle, Input, InputLabel, InputWrapper, Loading } from "../../theme/ThemeStyle"
import styled from 'styled-components'
import { useHistory } from "react-router-dom/cjs/react-router-dom.min"
import { useDispatch, useSelector } from "react-redux"
import { api } from "../../common/api"
import { clearAuthError, createAuthError } from "../../app/auth/authSlice"
import Logo from "../dashboard/layout/Logo"
import PassworVisibilityIcon from "./layout/PassworVisibilityIcon"


const Login = () => {
    const dispatch = useDispatch()
    const history = useHistory();

    const [emptyFields, setEmptyFields] = useState([])
    const [loginDetails, setLoginDetails] = useState({loginId:'', password:''})
    const [showPassword, setShowPassword] = useState(false)

    const redirect = location.search ? location.search.split('=')[1] : '/dashboard';
    
    const { isAuthenticated, loading, message, error } = useSelector(state => state.auth)

    const onChange = (e)=>{

        dispatch(clearAuthError())
        
        setLoginDetails(prevData =>({...prevData, [e.target.name]:e.target.value}))

    }

    const submitHandler = (e)=>{
        e.preventDefault();

        const emptyFields = Object.keys(loginDetails).filter(key => loginDetails[key]==='')
        
        setEmptyFields(emptyFields)

        if(emptyFields.length === 0){
            dispatch(api.login(loginDetails))
        }else{
            dispatch(createAuthError(`Provide ${emptyFields[0]==="loginId"?'email or phone number':'password'} to proceed`))
        }
    }

    useEffect(()=>{
        if(isAuthenticated){
            history.push(redirect)
        }
        
    },[isAuthenticated, history, redirect])

    useEffect(()=>{
        if(emptyFields.length>0){
            const timeoutId = setTimeout(()=>setEmptyFields([]),1000)
            return ()=>clearTimeout(timeoutId)
        }
    },[emptyFields])

    useEffect(()=>{
        dispatch(clearAuthError())
    },[dispatch])
    
    return (
        <HomeStyle>
            <FormControl onSubmit={submitHandler}>
                
                <Logo />

                <FormControlWrapper >
                    <Wrapper>
                        <Title>Welcome back</Title>
                        <Subtitle>Login to continue</Subtitle>
                    </Wrapper>

                    {(error||message)&&<Message value={`${error?'error':'message'}`}>
                        { error || message }
                    </Message>}

                    <Wrapper>
                        <InputWrapper value={emptyFields.includes('loginId')?'error':''}>
                            <InputLabel value={loginDetails.loginId}>Username</InputLabel>
                            <Input 
                                placeholder="Username" 
                                name="loginId"
                                invalid={emptyFields.includes('loginId')}
                                label={loginDetails.loginId} value={loginDetails.loginId} 
                                onChange={onChange}
                            />
                        </InputWrapper>
                        <InputWrapper value={emptyFields.includes('password')?'error':''}>
                            <InputLabel value={loginDetails.password}>Password</InputLabel>
                            <Input 
                                placeholder="Password" 
                                label={loginDetails.password} 
                                value={loginDetails.password}
                                invalid={emptyFields.includes('password')}
                                type={showPassword?'text':'password'}
                                name="password"
                                onChange={onChange}
                            />
                            <PassworVisibilityIcon showPassword={showPassword} setShowPassword={setShowPassword}/>
                        </InputWrapper>
                        <Label onClick={()=>history.push('/password/forgot')}>Forgot password</Label>
                        <Button type="submit" disabled={loading}> <Loading value={+loading} /> Login</Button>
                        <RedirectAccess onClick={()=>history.push('/register')}>Doesn’t have an account?
                            <div className="" style={{marginLeft: "5px", color:"green"}}>Register Now</div>
                        </RedirectAccess>
                    </Wrapper>
                </FormControlWrapper>
            </FormControl>

        </HomeStyle>
    )
}


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
    margin: 0;
`

export default Login