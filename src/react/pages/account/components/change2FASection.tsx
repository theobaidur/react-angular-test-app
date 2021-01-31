import React, { useState } from 'react';
import {
  Row,
  Col,
  PrimaryButton,
  Heading3,
  SmallGeneralText
} from '../../../components/common/styled';
import { KForm } from '../../../components/KForm';
import { KText, KSelect } from '../../../components/KForm';
import notificationService from '../../../services/notificationService';
import Validator from '../../../utils/validator';
import { useStore, useDispatch } from 'react-redux';
import accountProvider from '../../../providers/accountProvider';
import AppConstants from '../../../constants/appConstants';
import { changeAccount } from '../../../redux/actions';

interface change2FAFormProps {
  twofa: number[];
  phone: string;
  currentPassword: string;
}

export const Change2FASection: React.FC<{ t: any }> = ({ t }) => {
  const state = useStore().getState();
  const dispatch = useDispatch();
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [change2FAForm, setChange2FAForm] = useState<change2FAFormProps>({
    twofa: [],
    phone: state.account.phone,
    currentPassword: ''
  });

  const setChange2FAFormValue = (name: string, value: any) => {
    setChange2FAForm({ ...change2FAForm, [name]: value });
  };

  const [validator] = useState<Validator>(
    new Validator({
      messages: {
        password: t(`validators.passwordValidator`)
      }
    })
  );

  const change2faAndPhone = () => {
    validator.messagesShown = true;
    validator.forceUpdate();
    if (
      validator.allValid() &&
      (Object.keys(validator.validationResults).length === 3 ||
        (change2FAForm.twofa[0] !== 3 && Object.keys(validator.validationResults).length === 2))
    ) {
      accountProvider.change2faAndPhone(
        change2FAForm.twofa[0] - 1,
        change2FAForm.currentPassword,
        change2FAForm.phone,
        (res: any) => {
          setTimeout(() => {
            setError('');
            setSuccess('');
          }, 5000);

          if (res && !res.error) {
            setSuccess(t('notifications.phoneAnd2faChanged'));
            notificationService.showSuccessMessage(t('notifications.phoneAnd2faChanged'));
            dispatch(changeAccount({ ...state.account, phone: change2FAForm.phone }));
          } else {
            if (res && res.error) {
              switch (res.error) {
                case 'InputError':
                  notificationService.showErrorMessage(t('notifications.phoneAnd2faInputError'));
                  setError(t('notifications.phoneAnd2faInputError'));
                  break;
                case 'InvalidFactors':
                  notificationService.showErrorMessage(t('notifications.phoneAnd2faInvalidFactors'));
                  setError(t('notifications.phoneAnd2faInvalidFactors'));
                  break;
                case 'PasswordRejected':
                  notificationService.showErrorMessage(t('notifications.phoneAnd2faPasswordRejected'));
                  setError(t('notifications.phoneAnd2faPasswordRejected'));
                  break;
                default:
                  notificationService.showErrorMessage(t('notifications.phoneAnd2faChangeError'));
                  setError(t('notifications.phoneAnd2faChangeError'));
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
  };

  return (
    <KForm onSubmit={change2faAndPhone}>
      <Heading3>{t(`change2faAndPhoneHeader`)}</Heading3>
      <Row>
        <Col layout={1}>
          <KText
            name={'currentPassword'}
            label={t(`currentPassword`)}
            validations="required"
            validator={validator}
            fieldValue={change2FAForm.currentPassword}
            setFieldValue={setChange2FAFormValue}
            type="password"
          />
        </Col>
      </Row>
      <Row>
        <Col layout={1}>
          <KSelect
            name="twofa"
            label={t(`twofa`)}
            validations="required"
            validator={validator}
            itemsName={[0, 1, 2].map((e) => t(`twofaTypes.${e}`))}
            itemsValue={[1, 2, 3]}
            setFieldValue={setChange2FAFormValue}
            fieldValue={change2FAForm.twofa}
          />
        </Col>
      </Row>
      <Row>
        <Col layout={1}>
          <KText
            name={'phone'}
            label={t(`phone`)}
            validations={change2FAForm.twofa && change2FAForm.twofa[0] === 3 ? 'required' : ''}
            validator={change2FAForm.twofa && change2FAForm.twofa[0] === 3 ? validator : undefined}
            fieldValue={change2FAForm.phone}
            setFieldValue={setChange2FAFormValue}
            mask={(value: string) =>
              value.startsWith('+') ? AppConstants.PHONE_LONG_FORMAT_MASK : AppConstants.PHONE_SHORT_FORMAT_MASK
            }
          />
        </Col>
      </Row>
      <Row>
        <Col layout={1}>
          <PrimaryButton type="submit" fullWidth main center={'center'}>
            {t(`change2faType`)}
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
