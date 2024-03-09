import styled from 'styled-components'
import { Input } from '../../theme/ThemeStyle'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faArrowAltCircleRight } from '@fortawesome/free-solid-svg-icons'

const SearchDeals = () => {
  return (
    <Wrapper>
        <Label> <FontAwesomeIcon icon={faSearch}/> </Label>
        <SearchInput placeholder='Search by ROI, ID or Punter' />
        <Label type='submit'> <FontAwesomeIcon icon={faArrowAltCircleRight} size='xl'/> </Label>
    </Wrapper>
  )
}
const Wrapper = styled.form`
    display: flex;
    align-items: center;
    border-radius: 10px;
    background-color: ${({theme})=>theme.colors.bg};
    outline: solid ${({theme})=>theme.colors.dark3};
    &:focus{
        outline: none;
        background: transparent;
    }
    &:focus-within{
        background: ${({theme})=>theme.colors.bg};
        outline: 0;
        box-shadow:0 0 0 0.25rem rgba(13, 110, 253, .25);
        transition: border-color .15s ease-in-out, box-shadow .15s ease-in-out;
    }
`
const SearchInput = styled(Input)`
    outline: none;
    padding-left: 0;
    padding-right: 0;
    background-color: transparent;
    &:focus-within{
        background-color: transparent;
        box-shadow: none;
        transition: none;
    }
`
const Label = styled.button`
    padding: 10px;
    border: none;
    background-color: transparent;
    color: ${({theme})=>theme.colors.dark2}
`
export default SearchDeals