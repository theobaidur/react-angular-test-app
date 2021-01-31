import React, { useState } from 'react';
import {
  Row,
  Col,
  PrimaryButton,
  Heading3,
  GeneralText,
  SmallGeneralText
} from '../../../components/common/styled';
import { KForm } from '../../../components/KForm';
import { KText } from '../../../components/KForm';
import notificationService from '../../../services/notificationService';
import Validator from '../../../utils/validator';
import { useStore, useDispatch } from 'react-redux';
import { changeAccount } from '../../../redux/actions';
import accountProvider from '../../../providers/accountProvider';

interface changeEmailFormProps {
  email: string;
  currentPassword: string;
  confirmationCode: string;
}

export const ChangeEmailSection: React.FC<{ t: any }> = ({ t }) => {
  const state = useStore().getState();
  const dispatch = useDispatch();
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const [changeEmailForm, setChangeEmailForm] = useState<changeEmailFormProps>({
    email: state.account.mail,
    currentPassword: '',
    confirmationCode: ''
  });

  const [isCodeSent, setIsCodeSent] = useState(false);

  const [validator] = useState<Validator>(
    new Validator({
      messages: {
        password: t(`validators.passwordValidator`),
        email: t(`validators.newEmailValidator`),
        required: t(`validators.newEmailValidatorRequired`)
      }
    })
  );

  const setChangeEmailFormValue = (name: string, value: any) => {
    setChangeEmailForm({ ...changeEmailForm, [name]: value });
  };

  const changeEmail = () => {
    if (!isCodeSent) {
      validator.messagesShown = true;
      validator.forceUpdate();
      if (validator.allValid() && Object.keys(validator.validationResults).length === 2) {
        accountProvider.changeEmail(
          changeEmailForm.currentPassword,
          changeEmailForm.email,
          '',
          (res: any) => {
            setTimeout(() => {
              setError('');
              setSuccess('');
            }, 5000);
            if (res && res.action === 'changeMail' && !res.error) {
              notificationService.showSuccessMessage(t('notifications.emailChanged'));
              setSuccess(t('notifications.emailChanged'));
              dispatch(changeAccount({ ...state.account, mail: changeEmailForm.email }));
              setChangeEmailForm({ ...changeEmailForm, confirmationCode: '' });
              setIsCodeSent(false);
            } else {
              if (res && res.error) {
                switch (res.error) {
                  case 'InputError':
                    notificationService.showErrorMessage(t('notifications.emailInputError'));
                    setError(t('notifications.emailInputError'));
                    break;
                  case 'EmailVerificationRequired':
                    notificationService.showInfoMessage(t('notifications.emailVerificationRequired'));
                    setError(t('notifications.emailVerificationRequired'));
                    setIsCodeSent(true);
                    break;
                  case 'PasswordRejected':
                    notificationService.showErrorMessage(t('notifications.emailPasswordRejected'));
                    setError(t('notifications.emailPasswordRejected'));
                    break;
                  case 'WrongCode':
                    notificationService.showErrorMessage(t('notifications.emailWrongCode'));
                    setError(t('notifications.emailWrongCode'));
                    break;
                  case 'MailAlreadyExists':
                    notificationService.showErrorMessage(t('notifications.emailMailAlreadyExists'));
                    setError(t('notifications.emailMailAlreadyExists'));
                    break;
                  default:
                    notificationService.showErrorMessage(t('notifications.emailError'));
                    setError(t('notifications.emailError'));
                    break;
                }
              }
            }
          },
          (err: any) => console.log(err)
        );
      } else {
        notificationService.showErrorMessage(t('notifications.correctMistakes'));
      }
    } else {
      accountProvider.changeEmail(
        changeEmailForm.currentPassword,
        '',
        changeEmailForm.confirmationCode,
        (res: any) => {
          setTimeout(() => {
            setError('');
            setSuccess('');
          }, 5000);
          if (res && res.action === 'changeMail' && !res.error) {
            setSuccess(t('notifications.emailChanged'));
            notificationService.showSuccessMessage(t('notifications.emailChanged'));
            dispatch(changeAccount({ ...state.account, mail: changeEmailForm.email }));
            setChangeEmailForm({ ...changeEmailForm, confirmationCode: '' });
            setIsCodeSent(false);
          } else {
            if (res && res.error) {
              switch (res.error) {
                case 'InputError':
                  notificationService.showErrorMessage(t('notifications.emailInputError'));
                  setError(t('notifications.emailInputError'));
                  break;
                case 'EmailVerificationRequired':
                  notificationService.showInfoMessage(t('notifications.emailVerificationRequired'));
                  setIsCodeSent(true);
                  setError(t('notifications.emailVerificationRequired'));
                  break;
                case 'PasswordRejected':
                  notificationService.showErrorMessage(t('notifications.emailPasswordRejected'));
                  setError(t('notifications.emailPasswordRejected'));
                  break;
                case 'WrongCode':
                  notificationService.showErrorMessage(t('notifications.emailWrongCode'));
                  setError(t('notifications.emailWrongCode'));
                  break;
                case 'MailAlreadyExists':
                  notificationService.showErrorMessage(t('notifications.emailMailAlreadyExists'));
                  setError(t('notifications.emailMailAlreadyExists'));
                  break;
                default:
                  notificationService.showErrorMessage(t('notifications.emailError'));
                  setError(t('notifications.emailError'));
                  break;
              }
            }
          }
        },
        (err: any) => console.log(err)
      );
    }
  };

  return (
    <KForm onSubmit={changeEmail}>
      <Heading3>{t(`changeEmailHeader`)}</Heading3>
      {isCodeSent ? (
        <>
          <Row>
            <Col layout={1}>
              <GeneralText noMargin>{t(`emailConfirmationText`, { email: changeEmailForm.email })}</GeneralText>
            </Col>
          </Row>
          <Row>
            <Col layout={1}>
              <KText
                name={'confirmationCode'}
                label={t(`confirmationCode`)}
                fieldValue={changeEmailForm.confirmationCode}
                setFieldValue={setChangeEmailFormValue}
              />
            </Col>
          </Row>
        </>
      ) : (
        <>
          <Row>
            <Col layout={1}>
              <KText
                name={'currentPassword'}
                label={t(`currentPassword`)}
                validations="required"
                validator={validator}
                fieldValue={changeEmailForm.currentPassword}
                setFieldValue={setChangeEmailFormValue}
                type="password"
              />
            </Col>
          </Row>
          <Row>
            <Col layout={1}>
              <KText
                name={'email'}
                label={t(`email`)}
                validations="required|email"
                validator={validator}
                fieldValue={changeEmailForm.email}
                setFieldValue={setChangeEmailFormValue}
                type="email"
              />
            </Col>
          </Row>
        </>
      )}
      <Row>
        <Col layout={1}>
          <PrimaryButton type="submit" fullWidth main center={'center'}>
            {t(`changeEmail`)}
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
