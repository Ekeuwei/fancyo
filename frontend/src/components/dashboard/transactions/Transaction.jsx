import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import styled from "styled-components"
import { formatAmount, setAlpha } from "../../../common/utils"
import { faArrowDown, faSackDollar } from "@fortawesome/free-solid-svg-icons"
import dateFormat from "dateformat"
import PropTypes from 'prop-types'

const Transaction = ({transaction}) => {
  return (
    <TransactionWrapper>
        <Icon icon={faSackDollar} />
        <Details>
            <Title>{transaction.title.split('.')[0]}</Title>
            <Date>{dateFormat(transaction.createdAt)}</Date>
        </Details>
        <Value>{formatAmount(transaction.amount)}</Value>
    </TransactionWrapper>
  )
}
Transaction.propTypes = {
    transaction: PropTypes.object.isRequired
}

const TransactionWrapper = styled.div`
    background: ${({theme})=> setAlpha(theme.colors.success, 0.06)};
    display: flex;
    align-items: center;
    column-gap: 5px;
    padding: 10px 5px;
    border-radius: 5px;
`
const Icon = styled(FontAwesomeIcon)`
    color: ${({theme})=> theme.colors.success};
    padding: 10px;
    border-radius: 10px;
`
const Details = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
`
const Title = styled.h2`
    font-size: 18px;
    margin: 0 0 2px;
`
const Date = styled.p`
    margin: 0;
    color: ${({theme})=> theme.colors.dark2};
    font-size: 12px;
`
const Value = styled.div``

export default Transaction