import styled from "styled-components"
import PropTypes from 'prop-types'

const SettingsSubHeading = ({title}) => {
  return (
    <SubHeader>{title}</SubHeader>
  )
}

SettingsSubHeading.propTypes = {
    title: PropTypes.string
}

const SubHeader = styled.div`
    background-color: ${({theme})=>theme.colors.dark3};
    color: ${({theme})=>theme.colors.white};
    padding: 15px;
`

export default SettingsSubHeading