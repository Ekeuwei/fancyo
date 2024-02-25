import styled, { keyframes } from 'styled-components'
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { Shake } from '../../../theme/ThemeStyle'

const ModalContainter = ({children, isOpen, handleModalClose}) => {
    const [display, setDisplay] = useState("none")
    const [shake, setShake] = useState('')

    useEffect(()=>{
        if(isOpen==="closed"){
            document.body.style.overflow = 'visible';
            setTimeout(()=>setDisplay("none"), 450)
        }
        if(isOpen==="opened"){
            document.body.style.overflow = 'hidden';
            setDisplay("block")
        }
    }, [isOpen])

    const closeModal = ()=>{
      if(handleModalClose === null){
        setShake('animate')
        setTimeout(()=> setShake(''), 500)
      }else{
        handleModalClose()
      }
    }
  return (
    <>
        <ModalOverflow value={isOpen} onClick={closeModal} />
          <ModalWrapper value={isOpen} display={display}>
        <Shake value={shake}>
              {children}
        </Shake>
          </ModalWrapper>
    </>
  )
}
ModalContainter.propTypes = {
    children: PropTypes.object,
    isOpen: PropTypes.string,
    handleModalClose: PropTypes.func
}
const ModalOverflow = styled.div`
    background-color: ${({theme})=>theme.colors.dark4};
    display: ${({value})=>value==="opened"?'block':'none'};
    padding: 20px;
    position: fixed;
    z-index: 1;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
`
const ModalWrapper = styled.div`
    display: ${({display})=>display};
    top: 50%;
    left: 50%;
    border-radius: 5px;
    overflow: hidden;
    background-color: ${({theme})=>theme.colors.bg};
    transform: translate(-50%, -50%);
    position: fixed;
    width: calc(100% - 20px);
    z-index: 2;
    max-height: 80vh; 
    overflow-y: auto; 
    box-shadow: 0 -2px 10px ${({theme})=>theme.colors.dark4};
    animation: ${({ value }) => (value==="opened" ? slideIn : slideOut)} 0.5s ease;
    transform-origin: bottom;
`
const slideIn = keyframes`
  0% {
    transform: translate(-50%, 100%);
  }
  100% {
    transform: translate(-50%, -50%);
  }
`;

const slideOut = keyframes`
  0% {
    transform: translate(-50%, 0%);
  }
  100% {
    transform: translate(-50%, 200%);
  }
`;
export default ModalContainter