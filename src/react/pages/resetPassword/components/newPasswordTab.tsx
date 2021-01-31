import React, { useState } from 'react';
import { Row, Col, PrimaryButton, Heading2, GeneralText } from '../../../components/common/styled';
import { KForm, KText } from '../../../components/KForm';
import Validator from '../../../utils/validator';
import colors from '../../../components/common/colors';
import notificationService from '../../../services/notificationService';
import PasswordMeterComponent from '../../login/components/passwordMeter';
import authService, { LoginResponse } from '../../../services/authService';
import { connect, useStore } from 'react-redux';
import { Dossier } from '../../../redux/initialState';
import {
  setLogin,
  changeMyPerson,
  changeMyPartner,
  changeMyPartnerState,
  changeMyConnection,
  setApplications,
  changeAccount,
  updateSyncTimestamp
} from '../../../redux/actions';
import Tooltip from '../../../components/common/tooltip';
import authProvider from '../../../providers/authProvider';
import dossierProvider from '../../../providers/dossierProvider';

interface NewPasswordTab_Props {
  t: any;
  history: any;
  code: string;
  unlocker: string;
  setLogin: (isLoggedIn: boolean) => void;
  changeMyPerson: (x: any) => void;
  changeMyPartner: (x: any) => void;
  changeMyPartnerState: () => void;
  changeMyConnection: (x: any) => void;
  setApplications: (x: any) => void;
  changeMyAccount: (x: any) => void;
  updateSyncTimestamp: (x: number) => void;
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    setLogin: (isLoggedIn: boolean) => dispatch(setLogin(isLoggedIn)),
    changeMyPerson: (x: any) => dispatch(changeMyPerson(x)),
    changeMyPartner: (x: any) => dispatch(changeMyPartner(x)),
    changeMyPartnerState: () => dispatch(changeMyPartnerState()),
    changeMyConnection: (x: any) => dispatch(changeMyConnection(x)),
    setApplications: (x: any) => dispatch(setApplications(x)),
    changeMyAccount: (x: any) => dispatch(changeAccount(x)),
    updateSyncTimestamp: (x: number) => dispatch(updateSyncTimestamp(x))
  };
};

const NewPasswordTab: React.FC<NewPasswordTab_Props> = ({
  history,
  t,
  code,
  unlocker,
  setLogin,
  changeMyAccount,
  updateSyncTimestamp,
  changeMyPartner,
  changeMyPerson,
  changeMyPartnerState,
  changeMyConnection,
  setApplications
}) => {
  const [isDisabled, setDisabled] = useState<boolean>(false);

  const [secondRegisterForm, setSecondRegisterForm] = useState<{
    newPassword: string;
    newPasswordConfirmation: string;
  }>({
    newPassword: '',
    newPasswordConfirmation: ''
  });
  const store = useStore();

  const setSecondRegisterFieldValue = (name: string, value: any) => {
    setSecondRegisterForm((registerForm) => ({ ...registerForm, [name]: value }));
  };

  const [newPasswordValidator] = useState<Validator>(
    new Validator({
      messages: {
        required: t(`validators.newEmailValidatorRequired`),
        password: t(`validators.newPasswordValidator`)
      },
      validators: {
        register_password_confirm: {
          message: t(`validators.newPasswordConfirmationValidator`),
          rule: (val: any, params: Array<any>) => params.indexOf(val.toString()) > -1,
          required: true
        }
      }
    })
  );

  const setDossierAndAccount = (x: Account) => {
    dossierProvider.getDossierInfo((res: Dossier, own_dossier: boolean) => {
      changeMyAccount({ ...x, ownDossier: own_dossier });
      if (res) {
        if (res.myPerson) {
          changeMyPerson(res.myPerson);
        }
        if (res.myPartner) {
          changeMyPartner(res.myPartner);
          if (res.myPartner.active && res.myPerson.hasPartner.indexOf(1) > -1) changeMyPartnerState();
        }
        if (res.myConnection) {
          changeMyConnection(res.myConnection);
        }
      }
      setLogin(true);
      setApplications(store.getState());
      if (history.location.pathname.indexOf('/scan') < 0) {
        updateSyncTimestamp(res.sync.timestamp);
      }
      setDisabled(false);
      history.push('/');
    }, error);
  };

  const loginCallback = (x: Account | LoginResponse) => {
    setDisabled(false);
    if (x as Account) {
      if ((x as LoginResponse).mode === 'pro') {
        authService.redirectToProMode();
      }
      setDossierAndAccount(x as Account);
    }
  };

  const error = (err: string) => {
    if (err === 'DossierNotFoundPro' || err === 'ProDossier') authService.redirectToProMode();

    notificationService.showErrorMessage(t(`notifications.${err}`));
    setDisabled(false);
  };

  const setNewPassword = () => {
    newPasswordValidator.messagesShown = true;
    newPasswordValidator.forceUpdate();
    if (newPasswordValidator.allValid() && Object.keys(newPasswordValidator.validationResults).length === 2) {
      setDisabled(true);
      authProvider.setNewPassword(
        unlocker,
        code,
        secondRegisterForm.newPassword,
        (res: string) => {
          authService.tryToLogin(
            res,
            secondRegisterForm.newPassword,
            (t: any) => {
              if (t.factors === 2) {
                authService.secondFactor(t.sid, unlocker, loginCallback as any, error);
              } else {
                loginCallback(t);
              }
            },
            error,
            'login_after_registration'
          );
        },
        error
      );
    } else {
      notificationService.showErrorMessage(t('notifications.correctMistakes'));
    }
  };
  return (
    <KForm onSubmit={setNewPassword}>
      <Row>
        <Col layout={1}>
          <Heading2 color="white1">{t('newPasswordLabel')}</Heading2>
        </Col>
        <Col layout={1} style={{ position: 'relative' }}>
          <KText
            name={'newPassword'}
            label={t(`newPasswordTextPlaceholder`)}
            validations="password"
            validator={newPasswordValidator}
            fieldValue={secondRegisterForm.newPassword}
            setFieldValue={setSecondRegisterFieldValue}
            textColor={colors.white1}
            type="password"
            expectAutofill
          />
          <PasswordMeterComponent
            password={secondRegisterForm.newPassword}
            levels={[
              {
                color: '#f74f34',
                label: t(`passwordStrengthLow`)
              },
              {
                color: '#fcbb51',
                label: t(`passwordStrengthMedium`)
              },
              {
                color: '#1bdba0',
                label: t(`passwordStrengthHigh`)
              }
            ]}
            tips={
              <>
                <GeneralText color={'white1'} noMargin>
                  {t(`passwordStrengthTips`)}
                </GeneralText>
              </>
            }
          ></PasswordMeterComponent>
        </Col>
      </Row>
      <Col align={'right'}>
        <Tooltip
          title={
            <>
              <GeneralText color={'white1'} noMargin>
                {t(`passwordStrengthTips`)}
              </GeneralText>
            </>
          }
          placement="top"
          clickToOpen
        >
          <div
            style={{
              color: '#1babea',
              textDecoration: 'none',
              position: 'relative',
              top: '-10px',
              display: 'inline',
              cursor: 'pointer'
            }}
          >
            {t(`passwordTipsButton`)}
          </div>
        </Tooltip>
      </Col>
      <Row>
        <Col layout={1}>
          <KText
            name={'newPasswordConfirmation'}
            label={t(`newPasswordConfirmationTextPlaceholder`)}
            validations={`register_password_confirm:${secondRegisterForm.newPassword}`}
            validator={newPasswordValidator}
            fieldValue={secondRegisterForm.newPasswordConfirmation}
            setFieldValue={setSecondRegisterFieldValue}
            textColor={colors.white1}
            type="password"
            expectAutofill
          />
        </Col>
      </Row>
      <Row>
        <Col layout={1}>
          <PrimaryButton type="submit" disabled={isDisabled} fullWidth main center={'center'}>
            {t(`loginButton`)}
          </PrimaryButton>
        </Col>
      </Row>
    </KForm>
  );
};

export default connect(undefined, mapDispatchToProps)(NewPasswordTab);
