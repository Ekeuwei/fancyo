import styled from "styled-components"
import NavHeader from "../../dashboard/layout/NavHeader"
import AdminUserTemplate from "./AdminUserTemplate"
import { setAlpha } from "../../../common/utils"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { api } from "../../../common/api"
import { Loading } from "../../../theme/ThemeStyle"

const AllUsers = () => {
    const dispatch = useDispatch()
    const { loading, users } = useSelector(state => state.user)
    const [actionPosition, setViewPosition] = useState('')
    const handleShowActions = (idx)=> setViewPosition(prevPosition => idx===prevPosition?'':idx)
    
    useEffect(()=>{
        dispatch(api.getUsers())
    },[])
    
    return (
        <div>
            <NavHeader title={'All Users'} />
            <Wrapper>
                <Loading value={+loading}/>
                {users&&<Users>
                    {users.map((user, idx) => (
                    <AdminUserTemplate 
                        actionPosition={actionPosition} 
                        handleShowActions={handleShowActions}
                        user={user} 
                        idx={idx}
                        key={idx}/>))}
                </Users>}
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

const Users = styled.div`
    display: flex;
    flex-direction: column;
    row-gap: 5px;
    margin: 10px 0;
`
export default AllUsers