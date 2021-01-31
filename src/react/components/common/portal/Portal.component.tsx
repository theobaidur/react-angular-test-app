import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import StyledBackground from './portal.styled';

interface PortalProperties {
  isOpen: boolean;
  children: any;
  toggle: any;
  decreaseZIndex?: boolean;
  alignItems?: string | undefined;
  test?: string;
  justifyContent?: string | undefined;
  headerActive?: boolean;
}

const PortalComponent: React.FC<PortalProperties> = (props: PortalProperties) => {
  const [isLoaded, setLoaded] = useState<boolean>(false);
  const drawerRoot = document.getElementById('drawer');

  useEffect(() => {
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (props.isOpen) {
      document.body.classList.add('overflow-hidden');
    } else if (isLoaded) document.body.classList.remove('overflow-hidden');
  }, [props.isOpen, isLoaded]);

  useEffect(() => {
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, []);
  const children = React.Children.map(props.children, (child) => {
    return React.cloneElement(child, { isOpen: props.isOpen });
  });

  return ReactDOM.createPortal(
    <StyledBackground
      alignItems={props.alignItems}
      display={props.alignItems && props.justifyContent ? 'flex' : 'block'}
      justifyContent={props.justifyContent}
      className={props.isOpen ? 'isOpen react-portal' : 'react-portal'}
      onClick={props.toggle}
      headerActive={props.headerActive}
      decreaseZIndex={props.decreaseZIndex}
    >
      {children}
    </StyledBackground>,
    drawerRoot ? drawerRoot : document.body
  );
};

export default PortalComponent;
