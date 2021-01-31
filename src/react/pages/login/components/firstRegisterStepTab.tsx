import React, { useState } from 'react';
import Validator from '../../../utils/validator';
import { Row, Col, PrimaryButton, Heading2, SmallGeneralText } from '../../../components/common/styled';
import { KCheck, KText, KForm } from '../../../components/KForm';
import { TosLabel } from './tosLabel/tosLabel.styled';
import { Link } from 'react-router-dom';
import colors from '../../../components/common/colors';
import notificationService from '../../../services/notificationService';
import authProvider from '../../../providers/authProvider';
import { Trans } from 'react-i18next';

interface firstRegisterStepProps {
  email: string;
  accepted: Array<number>;
}

export const FirstRegisterStepTab: React.FC<{
  t: any;
  disabled: boolean;
  setDisabled: (x: boolean) => void;
  referrerCode: string | undefined;
  promotionCode: string | undefined;
  error: (x: string) => void;
}> = ({ t, referrerCode, promotionCode, error, disabled, setDisabled }) => {
  const [firstRegisterFormValidator] = useState<Validator>(
    new Validator({
      messages: {
        email: t(`validators.newEmailValidator`),
        required: t(`validators.newEmailValidatorRequired`)
      },
      validators: {
        register_accept: {
          message: t(`validators.acceptTosValidator`),
          rule: (val: any, params: Array<any>) => params.indexOf(val.toString()) > -1,
          required: true
        }
      }
    })
  );
  const [success, setSuccess] = useState<boolean>(false);
  const setFirstRegisterFieldValue = (name: string, value: any) => {
    setFirstRegisterForm((registerForm) => ({
      ...registerForm,
      [name]: value
    }));
  };
  const [firstRegisterForm, setFirstRegisterForm] = useState<firstRegisterStepProps>({
    email: '',
    accepted: []
  });
  const [optout, setOptout] = useState<any[]>([1]);

  const tryToRegister = () => {
    firstRegisterFormValidator.messagesShown = true;
    firstRegisterFormValidator.forceUpdate();
    if (
      firstRegisterFormValidator.allValid() &&
      Object.keys(firstRegisterFormValidator.validationResults).length === 2
    ) {
      setDisabled(true);
      const referralIdentifier = window.sessionStorage.getItem('referralIdentifier');
      window.sessionStorage.removeItem('referralIdentifier');
      authProvider.sendEmailForRegistration(
        firstRegisterForm.email,
        referrerCode ? referrerCode : referralIdentifier ? referralIdentifier : undefined,
        !(optout && optout[0] === 1),
        promotionCode,
        (res: any) => {
          if (res && res.createAccount === 'ok') setSuccess(true);
        },
        error
      );
    } else {
      notificationService.showErrorMessage(t('notifications.correctMistakes'));
    }
  };
  return success ? (
    <Row>
      <Col layout={1}>
        <Heading2 color="white0">{t('checkEmailTitle')}</Heading2>
        <SmallGeneralText color="white0">
          {t('checkEmailFirstSection', { email: firstRegisterForm.email })}
        </SmallGeneralText>
        <SmallGeneralText color="grey1">{t('checkEmailSecondSection')}</SmallGeneralText>
        <SmallGeneralText color="grey1">{t('checkEmailThirdSection')}</SmallGeneralText>
        <SmallGeneralText color="white0">{t('checkEmailFourthSection')}</SmallGeneralText>
      </Col>
    </Row>
  ) : (
    <KForm onSubmit={tryToRegister}>
      <Row>
        <Col layout={1}>
          <KText
            name={'email'}
            label={t(`newEmailTextPlaceholder`)}
            validations="required|email"
            validator={firstRegisterFormValidator}
            fieldValue={firstRegisterForm.email}
            setFieldValue={setFirstRegisterFieldValue}
            textColor={colors.white1}
            type="email"
            expectAutofill
          />
        </Col>
      </Row>

      <Row>
        <Col
          layout={1}
          style={{
            display: 'flex',
            justifyContent: 'row',
            alignItems: 'center'
          }}
        >
          {referrerCode && (
            <KCheck
              name="optin"
              itemsName={[<TosLabel><Trans>{t(`optinCheckbox`)}</Trans></TosLabel>]}
              itemsValue={[1]}
              fieldValue={optout}
              setFieldValue={(name: string, value: any) => {
                setOptout(value);
              }}
              darkMode
            />
          )}
          <KCheck
            name="accepted"
            itemsName={[
              <TosLabel>
                {t(`textToS0`)}
                <Link to={t('routes:privacy-policy')} target="_blank" style={{ cursor: 'pointer', color: '#1babea' }}>
                  {t(`textToSPrivacy`)}
                </Link>
                <Link to={t('routes:terms-of-use')} target="_blank" style={{ cursor: 'pointer', color: '#1babea' }}>
                  {t(`textToSFirstLink`)}
                </Link>
                {t(`textToS1`)}
                <Link
                  to={t('routes:terms-and-conditions')}
                  target="_blank"
                  style={{ cursor: 'pointer', color: '#1babea' }}
                >
                  {t(`textToSSecondLink`)}
                </Link>
                {t(`textToS2`)}
              </TosLabel>
            ]}
            itemsValue={[1]}
            fieldValue={firstRegisterForm.accepted}
            setFieldValue={setFirstRegisterFieldValue}
            darkMode
            validator={firstRegisterFormValidator}
            validations="register_accept:1"
          />
        </Col>
      </Row>
      <Row>
        <Col layout={1}>
          <PrimaryButton type="submit" disabled={disabled} main fullWidth center={'center'}>
            {t(`registerButton`)}
          </PrimaryButton>
        </Col>
      </Row>
    </KForm>
  );
};
