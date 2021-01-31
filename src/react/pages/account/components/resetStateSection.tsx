import React from 'react';
import { Row, Col, PrimaryButton, Heading3, GeneralText } from '../../../components/common/styled';
import { KForm } from '../../../components/KForm';
import notificationService from '../../../services/notificationService';
import authService from '../../../services/authService';
import { Dossier } from '../../../redux/initialState';
import { useStore, useDispatch } from 'react-redux';
import { setLogin, clearKey, updateSyncTimestamp } from '../../../redux/actions';
import dossierProvider from '../../../providers/dossierProvider';

export const ResetStateSection: React.FC<{ t: any }> = ({ t }) => {
  const store = useStore();
  const dispatch = useDispatch();

  const resetState = () => {
    if (!window.confirm(t('stateChangeConfirmation'))) return;

    authService.syncInProgress = true;
    dossierProvider.updateDossierInfo(
      { sync: store.getState().sync } as Dossier,
      (timestamp: number) => {
        console.log('cleanup -> updateStateTimestamp ' + timestamp);
        dispatch(updateSyncTimestamp(timestamp));
        notificationService.showSuccessMessage(t('notifications.stateResetSucceeded'));

        // Prevents dossier updates from other functions.
        authService.syncInProgress = true;
        authService.logout(() => {
          dispatch(setLogin(false));
          dispatch(clearKey(0));
          dispatch(clearKey(1));
          dispatch(clearKey(2));
        });
      },
      (err: any) => {
        authService.syncInProgress = false;
        notificationService.showSuccessMessage(t('notifications.stateResetFailed'));
      }
    );
  };

  return (
    <KForm onSubmit={resetState}>
      <Heading3>{t(`resetStateHeader`)}</Heading3>
      <Row>
        <Col layout={1}>
          <GeneralText noMargin>{t('resetStateText')}</GeneralText>
        </Col>
      </Row>
      <Row>
        <Col layout={1}>
          <PrimaryButton type="submit" fullWidth main center={'center'}>
            {t(`resetState`)}
          </PrimaryButton>
        </Col>
      </Row>
    </KForm>
  );
};
