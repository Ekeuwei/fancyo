import { Fragment, useEffect, useState } from 'react';
import styled from 'styled-components'
import { Input } from '../../../theme/ThemeStyle';
import { useDispatch } from 'react-redux';
import { api } from '../../../common/api';
import PropTypes from 'prop-types'
import { calculateTimeLeft } from '../../../common/utils';

const TokenInput = ({loginId, token, tokenExpires, setToken})=>{
    const dispatch = useDispatch()

    const handleChange = (index, value) => {
        const newToken = [...token];
        newToken[index] = value;

        if (value !== '' && index < token.length-1) {
            document.getElementById(`box-${index + 1}`).focus();
        }

        setToken(newToken);
    };

    useEffect(()=>{
        const allInputEntered = token.every(input => input!=='')
        if(allInputEntered){
            dispatch(api.validateToken(loginId, token.join('')))
        }
    },[dispatch, loginId, token])

    const handleTokenRequest = ()=> dispatch(api.requestToken(loginId))

    const handleKeyDown = (index, e) => {
        const newToken = [...token];
        newToken[index] = ''
        setToken(newToken)

        if (e.key === 'Backspace' && index > 0) {
            document.getElementById(`box-${index - 1}`).focus();
        }
        if (e.key === 'Delete' && index < token.length-1) {
            document.getElementById(`box-${index + 1}`).focus();
        }
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(tokenExpires));
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft(tokenExpires));
        }, 1000);

        return () => clearInterval(timer);
    }, [tokenExpires]);

    return (
        <Fragment>
            <CodeConfirmation>Enter the code to proceed</CodeConfirmation>
            <TokenWrapper >
                {token.map((value, index) => (
                    <TokenValueInput
                        key={index}
                        id={`box-${index}`}
                        type="text"
                        maxLength="1"
                        autoComplete='off'
                        value={value}
                        onChange={(e) => handleChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                    />
                ))}
            </TokenWrapper>
            <Text onClick={handleTokenRequest}>OTP expires in {timeLeft}</Text>
            <InvalidCode error={+false}>Invalide code</InvalidCode>
        </Fragment>
    );

}

TokenInput.propTypes ={
    loginId: PropTypes.string.isRequired,
    token: PropTypes.array.isRequired,
    tokenExpires: PropTypes.string.isRequired,
    setToken: PropTypes.func.isRequired,
}

const TokenWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 10px 0;
`
const Text = styled.p`
    color: red;
    margin: 0 auto;
    text-align: right;
`
const TokenValueInput = styled(Input)`
    width: 40px;
    height: 40px;
    margin: 0 3px;
    text-align: center;
    font-size: 18px;
`
const CodeConfirmation = styled.div`
    margin-top: 5px;
    font-size: 14px;
    font-weight: 600;
    display: flex;
    justify-content: center;
`

const InvalidCode = styled(CodeConfirmation)`
    color: red;
    display: ${(props) => (props.error?"flex":"none")};
`

export default TokenInput