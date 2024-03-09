import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import styled from "styled-components"
import { formatAmount, setAlpha } from "../../../common/utils"
import { faArrowCircleDown, faArrowCircleUp, faMinus, faPlus } from "@fortawesome/free-solid-svg-icons"
import dateFormat from "dateformat"
import PropTypes from 'prop-types'
import TransactionDetails from "./TransactionDetails"

const Transaction = ({transaction}) => {
    const [isDetailsOpen, setDetailsOpen] = useState('closed')
    const handleDetailsOpen = ()=> setDetailsOpen('opened')
    // const handleDetailsClose = ()=>setDetailsOpen('closed')
    const handleDetailsClose = ()=> setTimeout(()=>setDetailsOpen('closed'),0)

    return (
        <TransactionWrapper color={transaction.type==='credit'?'success':'error'} onClick={handleDetailsOpen}>
            <Icon 
                color={transaction.type==='credit'?'success':'error'} 
                icon={transaction.type==='credit'?faArrowCircleDown:faArrowCircleUp}
                size="lg" />
            <Details>
                <Title>{transaction.title.split('.')[0]}</Title>
                <Date>{dateFormat(transaction.createdAt, 'ddd, dS mmm, yyyy')}</Date>
            </Details>
            <Value color={transaction.type==='credit'?'success':'error'}>
                <FontAwesomeIcon size="xs" icon={transaction.type==='credit'?faPlus:faMinus} style={{marginRight: '2px'}}/>
                {formatAmount(transaction.amount)}
            </Value>
            <TransactionDetails 
                transaction={transaction} 
                isDetailsOpen={isDetailsOpen}
                handleDetailsClose={handleDetailsClose}/>
        </TransactionWrapper>
    )
}

Transaction.propTypes = {
    transaction: PropTypes.object.isRequired
}

const TransactionWrapper = styled.div`
    background: ${({theme, color})=> setAlpha(theme.colors[color], 0.05)};
    display: flex;
    align-items: center;
    cursor: pointer;
    column-gap: 5px;
    padding: 10px 5px;
    border-radius: 5px;
`
const Icon = styled(FontAwesomeIcon)`
    color: ${({theme, color})=> theme.colors[color]};
    padding: 10px;
    border-radius: 50%;
    transform: rotate(45deg);
`
const Details = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
`
const Title = styled.h2`
    font-size: 16px;
    margin: 0 0 2px;
`
const Date = styled.p`
    margin: 0;
    color: ${({theme})=> theme.colors.dark2};
    font-size: 12px;
`
const Value = styled.h2`
    color: ${({theme, color})=> theme.colors[color]};
    margin: 0;
    font-size: 16px;
`

export default Transaction