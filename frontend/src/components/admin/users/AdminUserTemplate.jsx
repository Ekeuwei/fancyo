import { faEllipsisV } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import styled from "styled-components"
import PropTypes from 'prop-types'

const AdminUserTemplate = ({user, handleShowActions, idx, actionPosition}) => {
    const toggleAction = ()=> handleShowActions(idx)
    return (
        <Wrapper>
            <Details>
                <Name>{`${user.email}`}</Name>
                <AccountBal>Account Balance: $23,998.90</AccountBal>
                <Username>Role: {user.role}</Username>
            </Details>
            <Actions icon={faEllipsisV} onClick={toggleAction}/>
            {idx === actionPosition&& <ActionList>
                <Item>Delete</Item>
                <Item>Edit</Item>
                <Item>Add to cart</Item>
            </ActionList>}
        </Wrapper>
    )
}

AdminUserTemplate.propTypes = {
    user: PropTypes.object.isRequired,
    handleShowActions: PropTypes.func.isRequired,
    idx: PropTypes.string.isRequired,
    actionPosition: PropTypes.number.isRequired,
}

const Wrapper = styled.div`
    display: flex;
    position: relative;
    align-items: center;
    padding: 10px;
    background: ${({theme})=> theme.colors.bg};
    border-radius: 10px;
`
const Details = styled.div`
    display: flex;
    flex: 1;
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
const ActionList = styled.div`
    position: absolute;
    z-index: 1;
    background: #acacac;
    /* background: ${({theme})=>theme.colors.dark4}; */
    display: flex;
    right: 40px;
    top: -25%;
    padding: 5px;
    border-radius: 5px;
    transform: translateY(50%);
    flex-direction: column;
    row-gap: 5px;
    max-height: 200px;
    overflow: scroll;
`
const Item = styled.p`
    margin: 0;
    font-size: 14px;
    padding: 10px 0;
`
export default AdminUserTemplate