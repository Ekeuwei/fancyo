import styled from "styled-components"
import { appName } from "../../../App"
import { useHistory } from "react-router-dom/cjs/react-router-dom.min"

// eslint-disable-next-line react/prop-types
const Logo = ({logoUrl}) => {
  const history = useHistory()
  return (
    <IconWrapper onClick={()=> history.push('/')}>
        <img src={logoUrl} alt={appName} width="100px"/>
    </IconWrapper>
  )
}

const IconWrapper = styled.div`
    display: flex;
    justify-content: center;
`

export default Logo