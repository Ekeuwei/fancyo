import { Button, Input, InputLabel, InputWrapper, Loading, NoticeMessage, Shake } from '../../../theme/ThemeStyle'
import styled from 'styled-components'
import { useEffect, useState } from 'react'
import NavHeader from '../layout/NavHeader'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { api } from '../../../common/api'
import InputWithSearch from './InputWithSearch'
import { clearUserErrors } from '../../../app/user/userSlice'
import UpdateNames from '../settings/layout/UpdateNames'

const AddAccount = ({handleModalClose}) => {
    const dispatch = useDispatch()
    const [accountNumber, setAccountNumber] = useState("")

    const [selectedOption, setSelectedOption] = useState({name:""});

    const [showError, setShowError] = useState('')

    const handleSelection = (e) => {
        // const option = banks.find(bank => bank.name === e.target.value)||{name:""}
        const option = banks.find(bank => bank.name === e)||{name:""}
        setSelectedOption(option);
    }
    const { bankAccountDetails, error, loading, message, banks } = useSelector(state => state.user)

    useEffect(()=>{
        if(selectedOption!=='' && accountNumber.length === 10){
            dispatch(api.verifyAccountNumber({
                account_number:accountNumber, 
                account_bank: selectedOption.code
            }))
        }
    },[accountNumber, selectedOption, dispatch])

    useEffect(()=>{
        dispatch(api.getBanks())
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    useEffect(()=>{
        if(message){
            handleModalClose()
            clearUserErrors()
        }
    },[dispatch, message, handleModalClose])

    const handleSubmit = (e)=>{

        e.preventDefault()

        const accountDetails = {
            name: `${selectedOption.name} - ${accountNumber}`,
            bankCode: selectedOption.code,
            bankName: selectedOption.name,
            accountNumber,
            accountName: bankAccountDetails?.account_name,
        }

        const allFieldsPolulated = Object.keys(accountDetails).every(key=> accountDetails[key] !== undefined)
        
        if(allFieldsPolulated){
            dispatch(api.addAccountDetails(accountDetails))
        }else{
            setShowError('animate')
            
        }

    }

    useEffect(()=>{
        if(showError==='animate'){
            const timeoutId = setTimeout(()=>setShowError(''),500)
            return ()=> clearTimeout(timeoutId)
        }
    },[showError])
    
    return (
        <>
            <NavHeader title={"Add Bank Account"} handleModalClose={handleModalClose} />

            <Shake value={showError}>
                <NoticeMessage value={error?'error':''}>
                    {error||message}
                    <UpdateNames accountUpdateError={error}/>
                </NoticeMessage>
            </Shake>

            <Wrapper onSubmit={handleSubmit}>
                <InputWithSearch 
                    options={banks} 
                    placeHolder={'Bank Name'}
                    selectedOption={selectedOption}
                    handleSelection={handleSelection}/>
                <InputWrapper>
                    <InputLabel value={accountNumber}>Account Number</InputLabel>
                    <AccountNumber 
                        autoComplete="off" 
                        maxLength={10} 
                        name="accountNumber" 
                        placeholder='Account Number' 
                        onChange={(e)=>setAccountNumber(e.target.value)} 
                        value={accountNumber} 
                        label={accountNumber} />
                    <AccountName>{bankAccountDetails?.account_name || error}</AccountName>
                </InputWrapper>
                <Button type='submit' disabled={loading}><Loading value={loading}/> Add Account</Button>
            </Wrapper>
        </>
    )
}

AddAccount.propTypes = {
    handleModalClose: PropTypes.func,
    handleModalOpen: PropTypes.func
}

const Wrapper = styled.form`
    padding: 10px;
`
const AccountNumber = styled(Input)`
    letter-spacing: ${({value}) =>value.length>0? '1.5px':''} ;
`
const AccountName = styled.p`
    text-transform: uppercase;
    margin-top: 8px;
    font-size: 14px;
`

export default AddAccount