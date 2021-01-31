import React from 'react';
import PortalComponent from '../portal';
import {
  ModalContainer,
  ModalContainerHeader,
  ModalContainerContent,
  ModalContainerFooter
} from './modalWindow.styled';
import { GeneralText, Heading3, Icon } from '../styled';

interface ModalWindow_Props {
  isOpen: boolean;
  toggle?: () => void;
  onClose?: () => void;
  width?: number;
  height?: number;
  title: string;
  subTitle?: string;
  children: any;
  buttons?: Array<any>;
  buttonsPosition?: string;
  color?:string;
}

export const ModalWindow: React.FC<ModalWindow_Props> = ({
  isOpen,
  toggle,
  title,
  subTitle,
  onClose,
  width,
  height,
  children,
  buttons,
  buttonsPosition = 'space-evenly',
  color,
  ...props
}) => {
  return (
    <PortalComponent isOpen={isOpen} toggle={toggle} alignItems="baseline" justifyContent="center">
      <ModalContainer
        onClick={(evt) => evt.stopPropagation()}
        width={width ? String(width) : undefined}
        height={height ? String(height) : undefined}
      >
        <ModalContainerHeader color={color}>
          <div>
            <Heading3 noMargin color="white0">
              {title}
            </Heading3>
            {subTitle && (
              <GeneralText noMargin color="white0">
                {subTitle}
              </GeneralText>
            )}
          </div>
          <Icon color="white0" onClick={() => (onClose ? onClose() : toggle ? toggle() : undefined)} content="close" />
        </ModalContainerHeader>
        <ModalContainerContent>{children}</ModalContainerContent>
        {buttons && <ModalContainerFooter buttonsPosition={buttonsPosition}>{buttons}</ModalContainerFooter>}
      </ModalContainer>
    </PortalComponent>
  );
};
