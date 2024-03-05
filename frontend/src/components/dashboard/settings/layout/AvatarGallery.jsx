import { useEffect, useState } from 'react';
import styled from 'styled-components';
import ModalContainter from '../../modals/ModalContainter';
import { Avatar, AvatarOverlay } from '../../../../theme/ThemeStyle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { avatars } from '../../../../common/utils';
import { api } from '../../../../common/api';
import { useDispatch } from 'react-redux';

const AvatarGallery = () => {

    const dispatch = useDispatch()

    const user = JSON.parse(localStorage.getItem('user'))
    
    const getImageUrl = name => new URL(`/assets/avatars/${name}`, import.meta.url).href 
    
    const [galleryVisible, setGalleryVisible] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState(
        // user? getImageUrl(`${user.avatar.includes('.')?user.avatar: user.avatar+'.png'}`):
        // getImageUrl('avatar1.png'))
        user? `/assets/avatars/${user.avatar.includes('.')?user.avatar: user.avatar+'.png'}`:
        '/assets/avatars/avatar1.png')
  
    const handleAvatarClick = (index) => {
      setAvatarUrl(avatars[index]);
      setGalleryVisible(false);
    };
    
    const handleCurrentAvatarClick = () => {
      setGalleryVisible(!galleryVisible);
    };
    const handleClose = ()=> setGalleryVisible(false)


    useEffect(()=>{
        const avatar = `${avatarUrl.split('/').pop().split('.png')[0].split('-')[0]}.png`
        if(user.avatar !== avatar){
            dispatch(api.updateProfile({avatar}))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[avatarUrl, dispatch])

    // const avatars = Object.values(import.meta.glob('assets/avatars/*.{png,jpg,jpeg,PNG,JPEG}', { eager: true, as: 'url' }))
    
    return (
      <Container>
        <AvatarContainer onClick={handleCurrentAvatarClick}>
          <Avatar src={avatarUrl} alt={`Selected Avatar`} />
        </AvatarContainer>
        <ModalContainter isOpen={galleryVisible?'opened':'closes'} handleModalClose={handleClose}>
          {galleryVisible && (
              <>
                  <CloseButton onClick={handleClose}>
                      <Icon icon={faTimes} />
                  </CloseButton>
                  <Gallery>
                  {avatars.map((avatar, index) => (
                      <AvatarItem
                      key={index}
                      className={avatars[index] === avatarUrl ? 'selected' : ''}
                      onClick={() => handleAvatarClick(index)}
                      >
                      <img src={avatar} alt={`Avatar ${index + 1}`} />
                      </AvatarItem>
                  ))
                  }
                  </Gallery>
              </>
          )}
        </ModalContainter>
      </Container>
    );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const CloseButton = styled.div`
    display: flex;
    justify-content: end;
    margin: 5px 10px 0;
`
const Icon = styled(FontAwesomeIcon)`
    background: ${({theme})=> theme.colors.dark3};
    color: ${({theme})=> theme.colors.white};
    padding: 10px 15px;
    border-radius: 5px;
`
const AvatarContainer = styled(AvatarOverlay)`
    width: 120px;
    height: 120px;
    align-self: center;
    cursor: pointer;
`;


const Gallery = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
`;

const AvatarItem = styled.div`
  cursor: pointer;
  margin: 5px;
  border-radius: 10px;
  overflow: hidden;
  
  img {
      width: 75px; /* Adjust the size as needed */
      height: 75px; /* Adjust the size as needed */
  }

  &.selected {
    border: 2px solid ${({theme})=> theme.colors.accent}; /* Highlight the selected avatar */
  }
`;

export default AvatarGallery;
