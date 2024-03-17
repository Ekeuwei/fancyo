import styled from 'styled-components'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'

const Legend = () => {
    const history = useHistory()
    return (
      <Wrapper onClick={()=>history.push('/admin/users')}>
          <Icon icon={faUser}/>
          <Value>23,098</Value>
          <Label>All users</Label>
      </Wrapper>
    )
}

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    row-gap: 5px;
    flex: 1;
    max-width: 150px;
    align-items: center;
    justify-content: center;
    background: ${({theme})=> theme.colors.bg};
    padding: 10px;
    border-radius: 10px;
`
const Icon = styled(FontAwesomeIcon)`
    
`
const Value = styled.div`
    
`
const Label = styled.div`
    
`
export default Legend