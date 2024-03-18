import styled from "styled-components"
import NavHeader from "../../dashboard/layout/NavHeader"
import { setAlpha } from "../../../common/utils"
import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"
import { api } from "../../../common/api"
import { Loading } from "../../../theme/ThemeStyle"
import WithdrawalTemplate from "./WithdrawalTemplate"

const Withdrawals = () => {
    const dispatch = useDispatch()

    const {loading, withdrawals } = useSelector(state => state.user)

    useEffect(()=>{
        dispatch(api.getWithdrawals())
    },[])

    return (
        <div>
            <NavHeader title={'Tickets'} />
            <Wrapper>
                <Loading value={+loading}/>
                {withdrawals&&<Tickets>
                    {withdrawals.map((withdrawal, idx) => (<WithdrawalTemplate withdrawal={withdrawal} key={idx}/>))}
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

export default Withdrawals