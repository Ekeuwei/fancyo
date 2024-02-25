import PropTypes from 'prop-types'
import { InputLabel, InputWrapper, Select } from "../../../theme/ThemeStyle";

const SelectOption = ({options, placeHolder, selectedOption, handleSelection}) => {

  return (
    <InputWrapper>
      <InputLabel htmlFor="selectOption" value={selectedOption.name}>Bank Account</InputLabel>
      <Select id="selectOption" value={selectedOption.name} onChange={handleSelection} label={selectedOption.name} >
        
        <option value={{name:""}}>{placeHolder}</option>

        {options&&options.map((option, index)=>(
            <option key={index} value={option.name}> {option.name} </option>
        ))}

      </Select>
    </InputWrapper>
  );
};

SelectOption.propTypes = {
    options: PropTypes.array,
    placeHolder: PropTypes.string,
    selectedOption: PropTypes.object,
    handleSelection: PropTypes.func,
}

export default SelectOption;
