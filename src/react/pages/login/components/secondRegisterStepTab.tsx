import { Row, Col, PrimaryButton, GeneralText } from '../../../components/common/styled';
import { KText, KForm } from '../../../components/KForm';
import React, { useState } from 'react';
import Validator from '../../../utils/validator';
import PasswordMeterComponent from './passwordMeter';
import colors from '../../../components/common/colors';
import authService from '../../../services/authService';
import notificationService from '../../../services/notificationService';
import Tooltip from '../../../components/common/tooltip';
import authProvider from '../../../providers/authProvider';
import AppConstants from '../../../constants/appConstants';

interface secondRegisterStepProps {
  newPassword: string;
  newPasswordConfirmation: string;
  mobile: string;
}

export const SecondRegisterStepTab: React.FC<{
  t: any;
  code: string;
  unlocker: string;
  loginCallback: (x: any) => void;
  disabled: boolean;
  setDisabled: (x: boolean) => void;
  error: (x: string) => void;
}> = ({ t, code, unlocker, loginCallback, error, disabled, setDisabled }) => {
  const [secondRegisterStepValidator] = useState<Validator>(
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

  const [secondRegisterForm, setSecondRegisterForm] = useState<secondRegisterStepProps>({
    newPassword: '',
    newPasswordConfirmation: '',
    mobile: ''
  });

  const setSecondRegisterFieldValue = (name: string, value: any) => {
    setSecondRegisterForm((registerForm) => ({ ...registerForm, [name]: value }));
  };

  const finishRegistration = () => {
    secondRegisterStepValidator.messagesShown = true;
    secondRegisterStepValidator.forceUpdate();
    if (
      secondRegisterStepValidator.allValid() &&
      Object.keys(secondRegisterStepValidator.validationResults).length >= 3
    ) {
      setDisabled(true);
      authProvider.finishRegistration(
        secondRegisterForm.newPassword,
        secondRegisterForm.mobile,
        code,
        unlocker,
        (res: any) => {
          if (res && res.activateAccount === 'ok') {
            authService.tryToLogin(
              res.username,
              secondRegisterForm.newPassword,
              (t: any) => {
                if (t.factors === 2) authService.secondFactor(t.sid, unlocker, loginCallback, error);
                else loginCallback(t);
              },
              error,
              'login_after_registration'
            );
            notificationService.showSuccessMessage(t('notifications.registrationSuccess'));
          }
        },
        error
      );
    } else {
      notificationService.showErrorMessage(t('notifications.correctMistakes'));
    }
  };

  return (
    <KForm onSubmit={finishRegistration}>
      <Row>
        <Col layout={1} style={{ position: 'relative' }}>
          <KText
            name={'newPassword'}
            label={t(`newPasswordTextPlaceholder`)}
            validations="password"
            validator={secondRegisterStepValidator}
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
            validator={secondRegisterStepValidator}
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
          <KText
            name={'mobile'}
            label={t(`mobile`)}
            validations="required"
            validator={secondRegisterStepValidator}
            fieldValue={secondRegisterForm.mobile}
            setFieldValue={setSecondRegisterFieldValue}
            textColor={colors.white1}
            mask={(value: string) =>
              value.startsWith('+') ? AppConstants.PHONE_LONG_FORMAT_MASK : AppConstants.PHONE_SHORT_FORMAT_MASK
            }
            expectAutofill
          />
        </Col>
      </Row>
      <Row>
        <Col layout={1}>
          <PrimaryButton main type="submit" disabled={disabled} fullWidth center={'center'}>
            {t(`confirmButton`)}
          </PrimaryButton>
        </Col>
      </Row>
    </KForm>
  );
};
