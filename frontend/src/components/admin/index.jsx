import styled from "styled-components"
import { BodyWrapper } from "../../theme/ThemeStyle"
import Legend from "./Legend"


const AdminDashboard = () => {
  return (
    <BodyWrapper>
        <Legends>
            {[1,2,3].map((legend, idx,) =>(
                <Legend key={idx} />
            ))}
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
    column-gap: 10px;
    background: ${({theme})=> theme.colors.dark3};
`
export default AdminDashboard