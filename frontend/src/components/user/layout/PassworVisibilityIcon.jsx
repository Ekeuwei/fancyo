import styled from "styled-components"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons"
import PropTypes from 'prop-types'

const PassworVisibilityIcon = ({showPassword, setShowPassword}) => {
  return (
      <EyeIcon 
        icon={showPassword?faEye:faEyeSlash} 
        onClick={()=>setShowPassword(!showPassword)}/>
  )
}
PassworVisibilityIcon.propTypes = {
    showPassword: PropTypes.bool,
    setShowPassword: PropTypes.func,
}

const EyeIcon = styled(FontAwesomeIcon)`
    position: absolute;
    right: 0;
    top: 50%;
    padding: 5px 10px;
    transform: translateY(-50%);
`
export default PassworVisibilityIcon