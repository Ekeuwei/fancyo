import styled from "styled-components"
import { BodyWrapper } from "../../theme/ThemeStyle"
import Legend from "./Legend"
import { faDownload, faMoneyBill, faTicket, faUser } from "@fortawesome/free-solid-svg-icons"
import BillBoard from "./BillBoard"


const AdminDashboard = () => {
  return (
    <BodyWrapper>
        <BillBoard />
        <Legends>
            <Legend link="users" icon={faUser} title="Users" value="23,098"/>
            <Legend link="tickets" icon={faTicket} title="Tickets" value="23,098"/>
            <Legend link="withdrawals" icon={faMoneyBill} title="Withdrawals" value="98"/>
            <Legend link="deposits" icon={faDownload} title="Deposits" value="23,098"/>
        </Legends>
    </BodyWrapper>
  )
}

const Legends = styled.div`
    display: flex;
    padding: 10px;
    border-radius: 5px;
    justify-content: center;
    flex-wrap: wrap;
    row-gap: 10px;
    column-gap: 10px;
    background: ${({theme})=> theme.colors.dark3};
`
export default AdminDashboard