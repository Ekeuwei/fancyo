import styled from "styled-components"
import { BodyWrapper } from "../../../theme/ThemeStyle"
import NavHeader from "../../dashboard/layout/NavHeader"
import AdminUserTemplate from "./AdminUserTemplate"
import { setAlpha } from "../../../common/utils"

const AllUsers = () => {
  return (
    <div>
        <NavHeader title={'All Users'} />
        <Wrapper>
            <Users>
                {[1,2,3,4,5].map((user, idx) => (<AdminUserTemplate user={user} key={idx}/>))}
            </Users>
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