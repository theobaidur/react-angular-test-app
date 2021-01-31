import React, { useState } from 'react';
import {
  Row,
  Col,
  PrimaryButton,
  Heading3,
  SmallGeneralText
} from '../../../components/common/styled';
import { KText, KForm } from '../../../components/KForm';
import Validator from '../../../utils/validator';
import notificationService from '../../../services/notificationService';
import accountProvider from '../../../providers/accountProvider';

interface changePasswordFormProps {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const ChangePasswordSection: React.FC<{ t: any }> = ({ t }) => {
  const [changePasswordForm, setChangePasswordForm] = useState<changePasswordFormProps>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [validator] = useState<Validator>(
    new Validator({
      messages: {
        password: t(`validators.passwordValidator`)
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

  const setChangePasswordFormValue = (name: string, value: any) => {
    setChangePasswordForm({ ...changePasswordForm, [name]: value });
  };
  const changePassword = () => {
    validator.messagesShown = true;
    validator.forceUpdate();
    if (validator.allValid() && Object.keys(validator.validationResults).length === 3) {
      accountProvider.changePassword(
        changePasswordForm.currentPassword,
        changePasswordForm.newPassword,
        (res: any) => {
          setTimeout(() => {
            setError('');
            setSuccess('');
          }, 5000);
          if (res && res.action === 'changePass' && !res.error) {
            setSuccess(t('notifications.pwChanged'));
            notificationService.showSuccessMessage(t('notifications.pwChanged'));
          } else {
            setError(t('notifications.pwInvalid'));
            notificationService.showErrorMessage(t('notifications.pwInvalid'));
          }
        },
        (err: any) => console.log(err)
      );
    } else {
      notificationService.showErrorMessage(t('notifications.correctMistakes'));
    }
  };

  return (
    <KForm onSubmit={changePassword}>
      <Heading3>{t(`changePasswordHeader`)}</Heading3>
      <Row>
        <Col layout={1}>
          <KText
            name={'currentPassword'}
            label={t(`currentPassword`)}
            validations="required"
            validator={validator}
            fieldValue={changePasswordForm.currentPassword}
            setFieldValue={setChangePasswordFormValue}
            type="password"
          />
        </Col>
      </Row>
      <Row>
        <Col layout={1}>
          <KText
            name={'newPassword'}
            label={t(`newPassword`)}
            validations="password"
            validator={validator}
            fieldValue={changePasswordForm.newPassword}
            setFieldValue={setChangePasswordFormValue}
            type="password"
          />
        </Col>
      </Row>
      <Row>
        <Col layout={1}>
          <KText
            name={'confirmPassword'}
            label={t(`confirmPassword`)}
            validations={`register_password_confirm:${changePasswordForm.newPassword}`}
            validator={validator}
            fieldValue={changePasswordForm.confirmPassword}
            setFieldValue={setChangePasswordFormValue}
            type="password"
          />
        </Col>
      </Row>
      <Row>
        <Col layout={1}>
          <PrimaryButton type="submit" fullWidth main center={'center'}>
            {t(`changePassword`)}
          </PrimaryButton>
        </Col>
      </Row>
      {(success || error) && (
        <Row>
          <Col>
            {error && (
              <SmallGeneralText noMargin color="red1">
                {error}
              </SmallGeneralText>
            )}
            {success && (
              <SmallGeneralText noMargin color="green1">
                {success}
              </SmallGeneralText>
            )}
          </Col>
        </Row>
      )}
    </KForm>
  );
};
