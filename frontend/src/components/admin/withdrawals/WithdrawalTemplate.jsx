import { faCopy, faEllipsisV } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import styled from "styled-components"
import PropTypes from 'prop-types'
import { formatAmount } from "../../../common/utils"

const WithdrawalTemplate = ({withdrawal}) => {
  return (
    <Wrapper>
        <Details>
            <Name>{withdrawal.accountName}</Name>
            <AccountBal>Amount: {formatAmount(withdrawal.amount)} <FontAwesomeIcon icon={faCopy}/></AccountBal>
            <Username>Bank : {withdrawal.bankName} </Username>
            <Username>Bank : {withdrawal.accountNumber} <FontAwesomeIcon icon={faCopy}/></Username>
            <Username>Status: {withdrawal.status} </Username>
        </Details>
        <Actions icon={faEllipsisV}/>
    </Wrapper>
  )
}

WithdrawalTemplate.propTypes = {
    withdrawal: PropTypes.object.isRequired,
}

const Wrapper = styled.div`
    display: flex;
    align-items: center;
    padding: 10px;
    background: ${({theme})=> theme.colors.bg};
    border-radius: 10px;
`
const Details = styled.div`
    display: flex;
    flex: 1;
    row-gap: 5px;
    flex-direction: column;
`
const Name = styled.p`
    font-size: 18px;
    margin: 0;
`
const AccountBal = styled(Name)`
    font-size: 14px;
    color: ${({theme})=>theme.colors.dark2};
`
const Username = styled(AccountBal)`

`
const Actions = styled(FontAwesomeIcon)`
    padding: 10px;
`
export default WithdrawalTemplate