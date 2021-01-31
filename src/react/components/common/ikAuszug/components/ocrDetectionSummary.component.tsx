import React, { useState } from 'react';
import { Alert, AlertTitle } from '@material-ui/lab';
import { useTranslation } from 'react-i18next';
import { CloseIcon, PrimaryButton, Heading4, GeneralText } from '../../styled';
import { AlertComponentWrapper, ButtonBar } from './ocrDetectionSummary.styled';
import ModalWindow from '../../modalWindow';

export interface DetectionSummary {
  status: 'SUCCESS' | 'UNKNOWN_TEMPLATE' | 'MISSING_PAGES' | 'BAD_IMAGE_QUALITY';
  findPercent: number;
  extractionPersent: number;
}

interface OcrDetectionSummaryProps {
  detectionSummary: DetectionSummary | undefined;
  onRestart: ((x: any) => void | undefined) | undefined;
  onReportTemplate: () => void;
}

export const OcrDetectionSummary: React.FC<OcrDetectionSummaryProps> = ({
  detectionSummary,
  onRestart,
  onReportTemplate
}) => {
  const { t } = useTranslation('ocrDetectionSummary');
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState<boolean>(false);
  const toggleDetailsDialog = () => {
    setIsDetailsDialogOpen((prev) => !prev);
  };

  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState<boolean>(false);
  const toggleLinkDialog = () => {
    setIsLinkDialogOpen((prev) => !prev);
  };

  return detectionSummary && detectionSummary.status && detectionSummary.status !== 'SUCCESS' && isOpen ? (
    <>
      <AlertComponentWrapper>
        <Alert severity="warning" variant="standard">
          <AlertTitle style={{ fontFamily: `"Roboto Condensed", sans-serif`, fontSize: '18px' }}>
            {t(`summary.${detectionSummary.status}.title`)}
          </AlertTitle>
          <br />
          <GeneralText color={'brown0'} noMargin>
            {t(`generalSummary`)}
          </GeneralText>
          <br />
          <GeneralText color={'brown0'} noMargin>
            {t(`summary.${detectionSummary.status}.message`)}
          </GeneralText>
          <br />
          <ButtonBar>
            <PrimaryButton
              height="48"
              style={{ margin: 0 }}
              onClick={detectionSummary.status === 'UNKNOWN_TEMPLATE' ? toggleDetailsDialog : onRestart}
            >
              {t(`summary.${detectionSummary.status}.button`)}
            </PrimaryButton>

            <Heading4 style={{ cursor: 'pointer' }} color="blue1" onClick={toggleLinkDialog}>
              {t(`summary.${detectionSummary.status}.link`)}
            </Heading4>
            <CloseIcon
              color={'brown0'}
              onClick={() => {
                setIsOpen(false);
              }}
            />
          </ButtonBar>
        </Alert>
      </AlertComponentWrapper>
      {isDetailsDialogOpen && (
        <ModalWindow
          isOpen={isDetailsDialogOpen}
          toggle={toggleDetailsDialog}
          title={t('detailsDialog.title')}
          onClose={toggleDetailsDialog}
          subTitle={t('detailsDialog.subTitle')}
          height={100}
          buttons={[
            <PrimaryButton key={0} outlined onClick={toggleDetailsDialog}>
              {t('detailsDialog.buttons.cancel')}
            </PrimaryButton>,
            <PrimaryButton
              key={1}
              onClick={() => {
                toggleDetailsDialog();
                onReportTemplate();
                setIsOpen(false);
              }}
            >
              {t('detailsDialog.buttons.ok')}
            </PrimaryButton>
          ]}
        >
          <GeneralText noMargin>{t('detailsDialog.text.0')}</GeneralText>
          <br />
          <GeneralText noMargin>{t('detailsDialog.text.1')}</GeneralText>
          <br />
          <GeneralText noMargin>{t('detailsDialog.text.2')}</GeneralText>
        </ModalWindow>
      )}
      {isLinkDialogOpen && (
        <ModalWindow
          isOpen={isLinkDialogOpen}
          toggle={toggleLinkDialog}
          title={t('linkDialog.title')}
          onClose={toggleLinkDialog}
          subTitle={t('linkDialog.subTitle')}
          height={100}
          buttons={[
            <PrimaryButton
              key={0}
              outlined
              onClick={() => {
                toggleLinkDialog();
                toggleDetailsDialog();
              }}
            >
              {t('linkDialog.buttons.report')}
            </PrimaryButton>,
            <PrimaryButton key={1} outlined onClick={onRestart}>
              {t('linkDialog.buttons.retry')}
            </PrimaryButton>,
            <PrimaryButton key={2} outlined onClick={toggleLinkDialog}>
              {t('linkDialog.buttons.close')}
            </PrimaryButton>
          ]}
        >
          <GeneralText noMargin>{t('linkDialog.header.0')}</GeneralText>
          <br />
          <GeneralText noMargin>{t('linkDialog.text.0')}</GeneralText>
          <br />
          <GeneralText noMargin>{t('linkDialog.header.1')}</GeneralText>
          <br />
          <GeneralText noMargin>{t('linkDialog.text.1')}</GeneralText>
          <br />
          <GeneralText noMargin>{t('linkDialog.header.2')}</GeneralText>
          <br />
          <GeneralText noMargin>{t('linkDialog.text.2')}</GeneralText>
          <br />
        </ModalWindow>
      )}
    </>
  ) : null;
};
