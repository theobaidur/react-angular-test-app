import React, { useState } from 'react';
import Validator from '../../../utils/validator';
import { Row, Col, PrimaryButton, Heading3, SmallGeneralText, StyledLink } from '../../../components/common/styled';
import { KText, KForm } from '../../../components/KForm';
import colors from '../../../components/common/colors';
import authService from '../../../services/authService';
import notificationService from '../../../services/notificationService';
import { Account } from '../../../redux/types';

interface CodeFormProps {
  code: string;
}

export const ApproveLoginCodeTab: React.FC<{
  t: any;

  disabled: boolean;
  setDisabled: (x: boolean) => void;
  session: string;
  callback: (x: Account) => void;
  error: (x: string) => void;
}> = ({ t, session, callback, error, disabled, setDisabled }) => {
  const [loginForm, setLoginForm] = useState<CodeFormProps>({
    code: ''
  });

  const setLoginFieldValue = (name: string, value: any) => {
    setLoginForm({ ...loginForm, [name]: value });
  };
  const [approveLoginCodeValidator] = useState<Validator>(
    new Validator({
      messages: {
        required: t(`validators.newEmailValidatorRequired`)
      }
    })
  );
  const confirmCode = () => {
    approveLoginCodeValidator.messagesShown = true;
    approveLoginCodeValidator.forceUpdate();
    if (approveLoginCodeValidator.allValid() && Object.keys(approveLoginCodeValidator.validationResults).length === 1) {
      setDisabled(true);
      authService.secondFactor(session, loginForm.code, callback, error);
    } else {
      notificationService.showErrorMessage(t('notifications.correctMistakes'));
    }
  };
  return (
    <KForm onSubmit={confirmCode}>
      <Row>
        <Col layout={1}>
          <Heading3 color="white1">{t('confirmCodeTitle')}</Heading3>
          <SmallGeneralText noMargin color="white1">
            {t('confirmCodeHelpTitle')}
          </SmallGeneralText>
        </Col>
      </Row>
      <Row>
        <Col layout={1}>
          <KText
            name={'code'}
            label={t('confirmCodeLabel')}
            validations="required"
            validator={approveLoginCodeValidator}
            autoFocus
            fieldValue={loginForm.code}
            setFieldValue={setLoginFieldValue}
            textColor={colors.white1}
            expectAutofill
          />
        </Col>
      </Row>
      <Row>
        <Col layout={1}>
          <PrimaryButton
            type="submit"
            disabled={disabled || !loginForm.code || (loginForm.code && loginForm.code.length < 6)}
            main
            fullWidth
            center={'center'}
          >
            {t(`loginButton`)}
          </PrimaryButton>
        </Col>
      </Row>
      <Row>
        <Col layout={1}>
          <SmallGeneralText noMargin color="grey1">
            {t('confirmCodeHelp')}:
          </SmallGeneralText>
        </Col>
        <Col layout={1} center style={{ justifyContent: 'start' }}>
          <StyledLink fontSize="12" color="blue1" to={t('routes:support') + '/login'} style={{ paddingLeft: '0' }}>
            {t('confirmCodeEmail')}
          </StyledLink>
          {/* <StyledLink fontSize="12" color="blue1" to="/">
            {t('confirmCodeText')}
          </StyledLink>
          <StyledLink fontSize="12" color="blue1" to="/">
            {t('confirmCodeSms')}
          </StyledLink> */}
        </Col>
      </Row>
    </KForm>
  );
};
