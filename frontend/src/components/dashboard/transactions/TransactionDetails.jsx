import styled from "styled-components"
import { formatAmount, setAlpha } from "../../../common/utils"
import NavHeader from "../layout/NavHeader"
import PropTypes from 'prop-types'
import ModalContainter from "../modals/ModalContainter"
import dateFormat from "dateformat"

const TransactionDetails = ({transaction, isDetailsOpen, handleDetailsClose}) => {
  return (
    <ModalContainter isOpen={isDetailsOpen} handleModalClose={handleDetailsClose}>
        <Wrapper>
            <NavHeader title={'Transaction Details'} handleModalClose={handleDetailsClose}/>
            <ValueWrapper>
                <Type color={transaction.type==='credit'?'success':'error'}>{transaction.type}</Type>
                <Value>{formatAmount(transaction.amount)}</Value>
                <Label>{dateFormat(transaction.createdAt)}</Label>
            </ValueWrapper>
            <OtherDetails>
                <FieldWrapper>
                    <Label>Description</Label>
                    <Title>{transaction.title}</Title>
                </FieldWrapper>
                <FieldWrapper>
                    <Label>Transaction Referece</Label>
                    <Title>{transaction.reference}</Title>
                </FieldWrapper>
            </OtherDetails>
        </Wrapper>
    </ModalContainter>
  )
}

TransactionDetails.propTypes = {
    transaction: PropTypes.object.isRequired,
    isDetailsOpen: PropTypes.string.isRequired,
    handleDetailsClose: PropTypes.func.isRequired,
}

const Wrapper = styled.div`
    background: ${({theme})=>theme.colors.dark4};
    display: flex;
    flex-direction: column;
`

const ValueWrapper = styled(Wrapper)`
    padding: 20px;
    margin: 10px 10px 0;
    border-radius: 10px;
    background: ${({theme})=>theme.colors.white};
    `
const FieldWrapper = styled(Wrapper)`
    padding:10px 0;
    background: white;
    border-bottom: 1px solid ${({theme})=>theme.colors.dark3};
    row-gap: 5px;
    &:last-child{
        border-bottom: none;
    }
`
const OtherDetails = styled.div`
    background: ${({theme})=>theme.colors.white};
    margin: 10px;
    padding: 0 10px;
    border-radius: 10px;
    row-gap: 10px;
`
const Type = styled.label`
    padding: 1px 8px;
    width: max-content;
    font-size: 12px;
    border-radius: 7px;
    color: ${({theme})=> theme.colors.white};
    background: ${({theme, color})=> setAlpha(theme.colors[color],0.8)};
`
const Value = styled.h2`
    margin: 0;
`
const Label = styled.p`
    margin: 0;
    font-size: 12px;
    color: ${({theme})=> theme.colors.dark2};
    
    `
const Title = styled(Label)`
    color: ${({theme})=> theme.colors.text};
    font-size: 14px;
`

export default TransactionDetails