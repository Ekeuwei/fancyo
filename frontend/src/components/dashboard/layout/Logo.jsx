import styled from "styled-components"
import { appName } from "../../../App"
import { useHistory } from "react-router-dom/cjs/react-router-dom.min"

const Logo = () => {
  const image_url = "assets/cashpanthers.png"
  const history = useHistory()
  return (
    <IconWrapper onClick={()=> history.push('/')}>
        <img src={image_url} alt={appName} width="100px"/>
    </IconWrapper>
  )
}

const IconWrapper = styled.div`
    display: flex;
    justify-content: center;
`

export default Logo