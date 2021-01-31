import React from 'react';
import { StyledDrawer } from '../styled';

interface DrawerProperties {
  position: string;
  children: any;
  minWidth?: string;
  maxWidth?: string;
  isOpen?: boolean | undefined;
}

const DrawerComponent: React.FC<DrawerProperties> = (props: DrawerProperties) => {
  const handleClick = (event: any) => event.stopPropagation();

  return (
    <StyledDrawer
      position={props.position}
      onClick={handleClick}
      isOpen={props.isOpen}
      minWidth={props.minWidth}
      maxWidth={props.maxWidth}
    >
      {props.children}
    </StyledDrawer>
  );
};

export default DrawerComponent;
