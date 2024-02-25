import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRef } from 'react'
import styled from 'styled-components';
import { InputLabel, InputWrapper, Shake } from '../../../theme/ThemeStyle';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import PropTypes from 'prop-types'

const CustomDatePicker = ({dateTime, setDateTime, placeholder, invalid}) => {
    

    const datePickerRef = useRef(null);
    const openDatePicker = () => {
        if (datePickerRef.current) {
            datePickerRef.current.setOpen(true);
        }
    };

  return (
    <InputWrapper>
        <InputLabel value={dateTime?.toLocaleString()}>End Time</InputLabel>
        <Shake value={invalid?'animate':''}>
            <StyledDatePicker
                selected={dateTime}
                value={dateTime}
                onChange={date => setDateTime(date)}
                label={dateTime?.toLocaleString()}
                placeholderText={placeholder}
                showTimeSelect
                invalid={invalid}
                ref={datePickerRef}
                dateFormat="MMMM d, yyyy h:mm aa"
            />
        </Shake>
        <CalendarIcon icon={faCalendar} onClick={openDatePicker} />
    </InputWrapper>
  )
}
CustomDatePicker.propTypes = {
    dateTime: PropTypes.string,
    placeholder: PropTypes.string,
    invalid: PropTypes.string,
    setDateTime: PropTypes.func,
}

const StyledDatePicker = styled(DatePicker)`
  display: flex;
  position: relative;
  outline: solid ${({theme, invalid})=>invalid?theme.colors.lost:theme.colors.dark3};
  background-color: ${({theme})=>theme.colors.bg};
  color: ${({theme})=>theme.colors.text};
  width: 100%;
  padding: ${({label, value})=>(value?.toLocaleString().length>0 && label!==undefined? "20px 10px 8px":"14px 10px")};
  align-items: center;
  letter-spacing: ${({type, value}) => (type==="password"&&value.length>0?"5px":"")};
  border: none;
  border-radius: 8px;
  cursor: pointer;
  &:focus{
    outline: none;
    background: transparent;
  }
  &:focus-within{
    background-color: ${({theme})=>theme.colors.bg};
    outline: 0;
    box-shadow: ${({invalid})=>`0 0 0 0.25rem ${invalid?'rgba(253, 13, 13, 0.25)':'rgba(13, 110, 253, .25)'}`}; //0 0 0 0.25rem rgba(13, 110, 253, .25);
    transition: border-color .15s ease-in-out, box-shadow .15s ease-in-out;
  }
`;

const CalendarIcon = styled(FontAwesomeIcon)`
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  cursor: pointer;
`;

export default CustomDatePicker