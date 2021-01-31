import React, { useEffect, useState } from 'react';
import { PrimaryButton } from '../../common/styled';
import { useTranslation } from 'react-i18next';
import QRCode from 'qrcode.react';
import Styled from './styled';
import { config } from '../../../config';
import { KText } from '../../KForm';
import ModalWindow from '../modalWindow';

interface IStartFotoScan {
  dossier?: any;
  open?: boolean;
  onClose?: any;
  onContinue?: any;
  onMail?: (to: string, docTitle: string, link: string) => void;
  onInit?: any;
  nr?: number;
}

const useInitQRCode = (onInit: Function) => {
  const [key, setKey] = useState();
  const scanLink = `${config.scanUrl}/${key}`;
  useEffect(() => {
    onInit(setKey);
  }, [onInit]);
  return {
    key,
    link: scanLink
  };
};

export const StartFotoScan: React.FC<IStartFotoScan> = ({ open = false, onClose, onInit, onContinue, onMail }) => {
  const { key, link } = useInitQRCode(onInit);
  const { t } = useTranslation('scan');
  const [email, setEmail] = useState('');
  const dialogActions = () => {
    return [
      <PrimaryButton height="48" outlined style={{ marginRight: '20px' }} onClick={() => onClose(key)}>
        {t('common.stop')}
      </PrimaryButton>,
      <PrimaryButton height="48" onClick={() => window.open(link)}>
        {t('common.withoutASmartphone')}
      </PrimaryButton>
    ];
  };

  function sendMail() {
    onMail && onMail(email, 'Vorsorgeausweis', link);
  }

  return (
    <ModalWindow
      isOpen={open}
      toggle={() => onClose(key)}
      title={t('header.photoWithSmartphone')}
      subTitle={t('dialog.description') + (onMail ? t('dialog.descriptionEmailSuffix') : '') + '?'}
      buttons={dialogActions()}
      buttonsPosition="flex-end"
    >
      <Styled.ColumnsContainer>
        <Styled.Column>
          <Styled.ColumnHeader>
            <Styled.QRIcon />
            {t('dialog.qrCode')}
          </Styled.ColumnHeader>
          <Styled.InstructionItem>
            <Styled.InstructionItemStep>
              <span>1</span>
            </Styled.InstructionItemStep>
            <Styled.InstructionText>{t('dialog.scanQRCodeBelow')}</Styled.InstructionText>
          </Styled.InstructionItem>
          <Styled.InstructionItem>
            <Styled.InstructionItemStep>
              <span>2</span>
            </Styled.InstructionItemStep>
            <Styled.InstructionText>{t('dialog.youWillBeRedirected')}</Styled.InstructionText>
          </Styled.InstructionItem>
          <Styled.InstructionItem>
            <Styled.InstructionItemStep>
              <span onClick={() => onContinue(key)}>3</span>
            </Styled.InstructionItemStep>
            <Styled.InstructionText>{t('dialog.takeAPhotoOfThePKBadge')}</Styled.InstructionText>
          </Styled.InstructionItem>
          <Styled.QRCodeItem>
            <QRCode value={link} />
          </Styled.QRCodeItem>
        </Styled.Column>
        {onMail && (
          <Styled.Column>
            <Styled.ColumnHeader>
              <Styled.EmailIcon />
              {t('dialog.email')}
            </Styled.ColumnHeader>
            <Styled.InstructionItem>
              <Styled.InstructionItemStep>
                <span>1</span>
              </Styled.InstructionItemStep>
              <Styled.InstructionText>{t('dialog.emailStep1')}</Styled.InstructionText>
            </Styled.InstructionItem>
            <Styled.InstructionItem>
              <Styled.InstructionItemStep>
                <span>2</span>
              </Styled.InstructionItemStep>
              <Styled.InstructionText>{t('dialog.emailStep2')}</Styled.InstructionText>
            </Styled.InstructionItem>
            <Styled.InstructionItem>
              <Styled.InstructionItemStep>
                <span onClick={() => onContinue(key)}>3</span>
              </Styled.InstructionItemStep>
              <Styled.InstructionText>{t('dialog.emailStep3')}</Styled.InstructionText>
            </Styled.InstructionItem>
            <KText
              name="Email"
              label="Ihre E-Mail-Adresse"
              fieldValue={email}
              setFieldValue={(name: string, value: any) => setEmail(value)}
            />
            <Styled.EmailButton enabled={!!email} onClick={sendMail}>
              E-Mail anfordern
            </Styled.EmailButton>
          </Styled.Column>
        )}
        <Styled.Column>
          <Styled.ColumnHeader>
            <Styled.ManualIcon />
            {t('dialog.manual')}
          </Styled.ColumnHeader>
          <Styled.InstructionItem>
            <Styled.InstructionItemStep>
              <span>1</span>
            </Styled.InstructionItemStep>
            <Styled.InstructionText>{t('dialog.manualStep1')}</Styled.InstructionText>
          </Styled.InstructionItem>
          <Styled.InstructionItem>
            <Styled.InstructionItemStep>
              <span>2</span>
            </Styled.InstructionItemStep>
            <Styled.InstructionText>{t('dialog.manualStep2')}</Styled.InstructionText>
          </Styled.InstructionItem>
          <Styled.InstructionItem>
            <Styled.InstructionItemStep>
              <span onClick={() => onContinue(key)}>3</span>
            </Styled.InstructionItemStep>
            <Styled.InstructionText>{t('dialog.manualStep3')}</Styled.InstructionText>
          </Styled.InstructionItem>
          <Styled.InstructionText>{t('dialog.manualUrlLabel')}:</Styled.InstructionText>
          <Styled.UrlBox>{link}</Styled.UrlBox>
        </Styled.Column>
      </Styled.ColumnsContainer>
    </ModalWindow>
  );
};
