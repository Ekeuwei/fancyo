import styled from "styled-components"
import PropTypes from 'prop-types'

const ProgressBar = ({width, content}) => {
  return (
    <Progress width={width||0} content={content}/>
  )
}

const Progress = styled.div`
    height: 10px;
    display: ${({width})=>(parseInt(width)===0?'none':'block')};
    position: relative;
    width: 100%;
    border-radius: 10px;
    background-color: ${({theme})=>theme.colors.fainted};
    &::before{
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        width: ${({width})=>`${width}%`};
        content: '';
        border-radius: 10px;
        z-index: 1;
        background-color: ${({theme})=>theme.colors.accent};
    }
    &::after{
        position: absolute;
        left: ${({width})=>`${width/2}%`};
        top:50%;
        content: '${({content})=>content}';
        z-index: 1;
        font-size: 7px;
        transform: translate(-50%, -50%);
    }
`
ProgressBar.propTypes = {
    width:PropTypes.number,
    content: PropTypes.string
}
export default ProgressBar