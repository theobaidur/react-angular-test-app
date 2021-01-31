import React from 'react';
import { PrimaryButton } from '../styled';
import ModalWindow from '../modalWindow';

interface ModalEditor_Props {
  isOpen: boolean;
  onClose: () => void;
  children?: any;
  t: any;
  title: string;
  allowApprove: boolean;
  onApprove: () => void;
  handleToggleHelp: (x: string) => void;
  id: string;
}

const ModalEditor: React.FC<ModalEditor_Props> = ({
  isOpen,
  onClose,
  title,
  children,
  id,
  onApprove,
  allowApprove,
  t,
  handleToggleHelp
}) => {
  return (
    <ModalWindow
      isOpen={isOpen}
      toggle={onClose}
      title={title}
      width={500}
      buttons={[
        <PrimaryButton outlined onClick={onClose} key="cancel">
          {t('cancel')}
        </PrimaryButton>,
        <PrimaryButton onClick={onApprove} disabled={!allowApprove} key='approve'>
          {t('approve')}
        </PrimaryButton>
      ]}
    >
      {children}
      {/* <HelpBar id={id} valid={false} onClick={() => handleToggleHelp(id)} visible={true} /> */}
    </ModalWindow>
  );
};

export default ModalEditor;
