import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Button } from '../../../theme/ThemeStyle';
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const FloatingButton = ({title, isOpen, handleButtonClick}) => {
  const [isScrolledDown, setIsScrolledDown] = useState(false);

  
  useEffect(() => {
    let scrollTimer;

    const handleScroll = () => {
      setIsScrolledDown(true);

      clearTimeout(scrollTimer);

      scrollTimer = setTimeout(() => {
        setIsScrolledDown(false);
      }, 1000);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // eslint-disable-next-line no-unused-vars
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <FloatButton visible={+!(isScrolledDown||isOpen==='opened')} onClick={handleButtonClick}> <FontAwesomeIcon icon={faPlus} /> {title}  </FloatButton>
  );
};

FloatingButton.propTypes = {
    title: PropTypes.string,
    isOpen: PropTypes.string,
    handleButtonClick: PropTypes.func,
}

const FloatButton = styled(Button)`
    position: fixed;
    bottom: 20px;
    right: 0;
    margin: 0 20px;
    width: fit-content;
    border-radius: 20px;
    background-color: ${({theme})=> theme.colors.white};
    color: ${({theme})=> theme.colors.accent};
    border: 1.5px solid;
    transition: opacity 0.3s ease-in-out;
    opacity: ${({ visible }) => (visible ? 1 : 0)};
`;

export default FloatingButton;
