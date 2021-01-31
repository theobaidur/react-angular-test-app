import React, { useEffect, useState } from 'react';
import {
  Heading1,
  GeneralText,
  MoreTextButton,
  PrimaryButton,
  StyledDrawerOverflowFooter,
  StyledDrawerOverflowContent,
  CloseIcon,
  Icon
} from '../styled';
import { useTranslation, Trans } from 'react-i18next';
import { Collapse } from '@material-ui/core';
import { Header, DrawerGeneralText } from './drawerContent.styled';
import { useStore } from 'react-redux';

interface DrawerContent_Props {
  currentId: string | undefined;
  activeModule: string;
  onClose?: () => void;
  history?: any;
}

const DrawerContent: React.FC<DrawerContent_Props> = ({ currentId, activeModule, history, onClose }) => {
  const { t } = useTranslation('');
  const [isVisible, setVisible] = useState<boolean>(false);

  const state = useStore().getState();

  useEffect(() => {
    setVisible(false);
  }, [currentId]);

  const dropdownItems: Array<any> = t(`module_${activeModule}:${currentId}.helpDropdownItems`, {
    returnObjects: true
  });
  const text = t(`module_${activeModule}:${currentId}.helpText`);

  return typeof currentId === 'string' ? (
    <>
      <StyledDrawerOverflowContent>
        <div style={{ padding: '15px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Heading1>{t(`module_${activeModule}:${currentId}.helpTitle`)}</Heading1>
            <CloseIcon onClick={onClose} color="blue1" />
          </div>
          {dropdownItems && dropdownItems.length > 0 && dropdownItems.map ? (
            dropdownItems.map((item: any, index: number) => <DropdownItem key={index} {...item} />)
          ) : (
            <GeneralText>
              <Trans>{isVisible ? text : text.substr(0, 200 + text.substr(200).indexOf(' '))}</Trans>
              {!isVisible && text.length > 200 && (
                <MoreTextButton onClick={() => setVisible(true)}> {t('global:moreText')}</MoreTextButton>
              )}
            </GeneralText>
          )}
        </div>
        {/*Not available now, we will use it in the future */}
        {/* <hr />
        <div style={{ padding: '15px' }}>
          <Heading1>{t(`module_${activeModule}:${currentId}.videoHelp`)}</Heading1>
          <VideoButton transparent format="circle" firstText="Hilfe about personaliche angabene" />
        </div> */}
      </StyledDrawerOverflowContent>
      {history &&
       ( !state.specialist || (state.specialist && !state.specialist.state) ) &&
      (
        <StyledDrawerOverflowFooter>
          <PrimaryButton
            style={{ margin: 0 }}
            main
            height="48"
            onClick={() => history.push(t('routes:consultant-contact'))}
          >
            {t('global:consultPage')}
          </PrimaryButton>
        </StyledDrawerOverflowFooter>
      )}
    </>
  ) : (
    <></>
  );
};

const DropdownItem: React.FC<{ title: string; text: string, links?: {url:string, text:string}[] }> = ({ title, text, links }) => {
  const [isOpen, setOpen] = useState<boolean>(false);

  const linkComp : any[] = links && links.map ? links.map((a:any)=>(
    <a target='_blank' rel='noopener noreferrer' href={a.url}>{a.text}</a>)
  ) : [];

  return (
    <>
      <Header onClick={() => setOpen((open: boolean) => !open)}>
        <GeneralText color="blue1" noMargin>
          {title}
        </GeneralText>
        <Icon size="24" content={isOpen ? 'upBig' : 'downBig'} />
      </Header>
      <Collapse in={isOpen}>
        <DrawerGeneralText noMargin>
          <Trans
            components={linkComp}>
            {text}
          </Trans>
        </DrawerGeneralText>
      </Collapse>
    </>
  );
};
export default DrawerContent;
