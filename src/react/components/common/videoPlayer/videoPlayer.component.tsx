import React from 'react';
import ReactPlayer from 'react-player';
import { StyledVideoWrapper } from './videoPlayer.styled';
import { Icon } from '../styled';
import PortalComponent from '../portal';

interface VideoPlayer_Props {
  isOpen: boolean;
  toggle: () => void;
  src: string;
}

const VideoPlayer: React.FC<VideoPlayer_Props> = ({ isOpen, toggle, src }) => (
  <PortalComponent alignItems="center" justifyContent="center" isOpen={isOpen} toggle={toggle}>
    {isOpen ? (
      <StyledVideoWrapper>
        <ReactPlayer playing={true} controls={true} url={src}></ReactPlayer>
        <Icon content="close" />
      </StyledVideoWrapper>
    ) : (
      <></>
    )}
  </PortalComponent>
);

export default VideoPlayer;
