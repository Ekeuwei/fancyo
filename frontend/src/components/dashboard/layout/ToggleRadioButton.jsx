import styled from 'styled-components';
import PropTypes from 'prop-types'

const ToggleRadioButton = ({isChecked, handleToggle}) => {
  
  return (
    <ToggleContainer>
      <ToggleInput
        type="radio"
        onClick={handleToggle}
      />
      <ToggleLabel value={isChecked?"checked":""} >
        <ToggleHandle value={isChecked?"checked":""} />
      </ToggleLabel>
    </ToggleContainer>
  );
};

ToggleRadioButton.propTypes = {
    isChecked: PropTypes.bool,
    handleToggle: PropTypes.func
}

const ToggleContainer = styled.label`
  display: inline-block;
  /* cursor: pointer; */
`;

const ToggleInput = styled.input`
  display: none;
`;

const ToggleLabel = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  height: 20px;
  width: 40px;
  background-color: ${({value, theme})=>value==="checked"?theme.colors.accent:"#ccc"} ;
  border-radius: 15px;
  padding: 3px;
`;

const ToggleHandle = styled.div`
  height: 15px;
  width: 15px;
  background-color: ${({value})=>value==="checked"?'white':'white'};
  border-radius: 50%;
  position: absolute;
  transition: transform 0.3s;
  transform: ${({value})=>value==='checked'?'translateX(20px)':'translateX(0px)'};
`;

export default ToggleRadioButton;
