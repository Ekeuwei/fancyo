import { faEllipsisV } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import styled from "styled-components"

const AdminUserTemplate = () => {
  return (
    <Wrapper>
        <Details>
            <Name>Zezime Wuradah</Name>
            <AccountBal>Account Balance: $23,998.90</AccountBal>
            <Username>Username: Zezime</Username>
        </Details>
        <Actions icon={faEllipsisV}/>
    </Wrapper>
  )
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
    flex-direction: column;
`
const Name = styled.p`
    margin: 0;
`
const AccountBal = styled(Name)`
    
`
const Username = styled(Name)`

`
const Actions = styled(FontAwesomeIcon)`
    padding: 10px;
`
export default AdminUserTemplate