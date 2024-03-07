import { faFilter } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import styled from "styled-components"

const FilterTransactions = () => {
  return (
    <Wrapper>
        <Title>Filter Transactions</Title>
        <Icon icon={faFilter}/>
    </Wrapper>
  )
}

const Wrapper = styled.div`
    display: flex;
    align-items: center;
    border-bottom: solid 1px ${({theme})=>theme.colors.dark4};
    padding: 10px;
    margin-bottom: 5px;
`
const Title = styled.h2`
    font-size: 18px;
    flex: 1;
    margin: 0px;
`
const Icon = styled(FontAwesomeIcon)`
    padding: 10px;
`
export default FilterTransactions