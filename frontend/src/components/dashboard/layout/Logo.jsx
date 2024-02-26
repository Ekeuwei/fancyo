import styled from "styled-components"
import { appName } from "../../../App"

const Logo = () => {
  return (
    <IconWrapper>
        <img src="assets/fancyO.png" alt={appName} width="100px"/>
    </IconWrapper>
  )
}

const IconWrapper = styled.div`
    display: flex;
    justify-content: center;
`

export default Logo