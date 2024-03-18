import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'
import PropTypes from 'prop-types'

const Legend = ({link, icon, title, value}) => {
    const history = useHistory()
    return (
      <Wrapper onClick={()=>history.push(`/admin/${link}`)}>
          <Icon icon={icon}/>
          <Value>{value}</Value>
          <Label>{title}</Label>
      </Wrapper>
    )
}

Legend.propTypes = {
    link: PropTypes.string.isRequired,
    icon: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
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