import styled from "styled-components"
import NavHeader from "../../dashboard/layout/NavHeader"
import { setAlpha } from "../../../common/utils"
import TicketTemplate from "./TicketTemplate"
import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"
import { api } from "../../../common/api"
import { Loading } from "../../../theme/ThemeStyle"

const AdminTicket = () => {
    const dispatch = useDispatch()

    const {loading, tickets } = useSelector(state => state.ticket)

    useEffect(()=>{
        dispatch(api.getAllTickets())
    },[])

    return (
        <div>
            <NavHeader title={'Tickets'} />
            <Wrapper>
                <Loading value={+loading}/>
                {tickets&&<Tickets>
                    {tickets.map((ticket, idx) => (<TicketTemplate ticket={ticket} key={idx}/>))}
                </Tickets>}
            </Wrapper>
        </div>
    )
}

const Wrapper = styled.div`
    display: flex;
    padding: 0 10px 10px;
    flex-direction: column;
    background-color: ${({theme})=> setAlpha(theme.colors.primary, 0.2)};
`

const Tickets = styled.div`
    display: flex;
    flex-direction: column;
    row-gap: 5px;
    margin: 10px 0;
`

export default AdminTicket