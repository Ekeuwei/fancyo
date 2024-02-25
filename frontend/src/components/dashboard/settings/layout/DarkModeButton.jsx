import styled from 'styled-components'
import ToggleRadioButton from '../../layout/ToggleRadioButton'
import { useTheme } from '../../../../theme/ThemeProvider';
import PropTypes from 'prop-types'
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { api } from '../../../../common/api';

const DarkModeButton = ({darkMode}) => {
    const dispatch = useDispatch()

    const { toggleDarkMode, isDarkMode } = useTheme(darkMode)

    const handleToggle = ()=>{
        const newMode = !isDarkMode
        dispatch(api.updateProfile({preferences:{darkMode: newMode}}))
        toggleDarkMode()
    }

    useEffect(()=>{
    },[dispatch, isDarkMode])
    
    return (
        <Option>
            <Text>{isDarkMode?"Dark Mode":"Light Mode"}</Text>
            <ToggleRadioButton isChecked={isDarkMode} handleToggle={handleToggle}/>
        </Option>
    )
}

DarkModeButton.propTypes = {
    darkMode: PropTypes.bool
}

const Option = styled.div`
    display: flex;
    align-items: center;
    padding: 0 5px;
    justify-content: space-between;
`
const Text = styled.p`
    margin: 0;
    padding: 15px 0;
`

export default DarkModeButton