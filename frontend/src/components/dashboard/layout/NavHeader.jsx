import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { faLongArrowLeft, faTimes } from '@fortawesome/free-solid-svg-icons'

const NavHeader = ({handleModalClose, title}) => {
    const handleBackdrop = ()=>{
        if(handleModalClose){
            handleModalClose()
        }else{
            window.history.back()
        }
    }
    return (
        <Header>
            <Backdrop onClick={handleBackdrop} icon={faLongArrowLeft} />
            <Title>{title}</Title>
            {handleModalClose&& <Backdrop onClick={handleModalClose}>
                <FontAwesomeIcon icon={faTimes}/>
            </Backdrop>}
        </Header>
    )
}
NavHeader.propTypes = {
    handleModalClose: PropTypes.func,
    title: PropTypes.string
}

const Header = styled.div`
    display: flex;
    position: sticky;
    top: -1px;
    z-index: 2;
    padding: 1px 5px;
    align-items: center;
    color: ${({theme})=>theme.colors.white};
    background-color: ${({theme})=>theme.colors.primary};
`
const Backdrop = styled(FontAwesomeIcon)`
    padding: 10px;
`
const Title = styled.h2`
    font-size: 18px;
    font-weight: 500;
    flex: 1;
`

export default NavHeader