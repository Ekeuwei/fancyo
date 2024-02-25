
import styled from 'styled-components';
import PropTypes from 'prop-types'
import { useState } from 'react';
import { Input, InputLabel, InputWrapper } from '../../../theme/ThemeStyle';


const InputWithSearch = ({ options, placeHolder, handleSelection }) => {
  const [inputValue, setInputValue] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [selectedValue, setSelectedValue] = useState({name:"", value:""});
  const [showOptions, setShowOptions] = useState(false);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
    setShowOptions(true);
  };

  const handleOptionClick = (option) => {
    handleSelection(option.name);
    setInputValue(option.name)
    setShowOptions(false);
  };

  const handleOnBlur = ()=>setTimeout(()=>setShowOptions(false), 1)

  return (
    <InputListOptionContainer>
        <InputWrapper>
            <InputLabel value={inputValue}>{placeHolder}</InputLabel>
            <Input
                type="text"
                value={inputValue}
                label={inputValue}
                onFocus={()=>setShowOptions(true)}
                onChange={handleInputChange}
                onBlur={handleOnBlur}
                placeholder={placeHolder}
            />
        </InputWrapper>
      {showOptions && (
        <OptionList>
          {options
            .filter((option) => option.name.toLowerCase().includes(inputValue.toLowerCase()))
            .map((option, index) => (
              <Option key={index} onClick={() => handleOptionClick(option)}>
                {option.name}
              </Option>
            ))}
        </OptionList>
      )}
    </InputListOptionContainer>
  );
};

InputWithSearch.propTypes = {
    options: PropTypes.array,
    selectedOption: PropTypes.object,
    placeHolder: PropTypes.string,
    handleSelection: PropTypes.func,
}

const InputListOptionContainer = styled.div`
  position: relative;
`;

const OptionList = styled.ul`
  position: absolute;
  list-style: none;
  padding: 10px 0;
  margin: 4px 0 0;
  width: 100%;
  z-index: 1;
  max-height: 120px;
  overflow-y: auto;
  border: 1px solid ${({theme})=>theme.colors.dark4};
  border-radius: 4px;
  background-color: ${({theme})=>theme.colors.bg};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Option = styled.li`
  padding: 8px;
  cursor: pointer;

  &:hover {
    background-color: #f0f0f0;
  }
`;
export default InputWithSearch;
