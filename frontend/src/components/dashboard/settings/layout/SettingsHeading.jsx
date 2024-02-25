import styled from "styled-components"
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTimes } from "@fortawesome/free-solid-svg-icons"

const SettingsHeading = ({title, handleClose}) => {
  return (
    <Wrapper>
      <Header>{title}</Header>
      {handleClose&&<CloseButton onClick={handleClose}><FontAwesomeIcon icon={faTimes}/></CloseButton>}
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 15px 10px;
  background-color: ${({theme})=>theme.colors.dark2};
`
SettingsHeading.propTypes = {
    title: PropTypes.string,
    handleClose: PropTypes.func,
}

const Header = styled.div`
    flex: 1;
    color: ${({theme})=>theme.colors.white};
`
const CloseButton = styled.div`
  padding: 5px 10px;
  border-radius: 5px;
  color: ${({theme})=>theme.colors.dark2};
  background-color: ${({theme})=>theme.colors.bg};
`

export default SettingsHeading