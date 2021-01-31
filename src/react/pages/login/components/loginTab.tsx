import React, { useState, useEffect, useRef, useCallback } from 'react';
import Validator from '../../../utils/validator';
import { Row, Col, PrimaryButton, StyledLink, GeneralText } from '../../../components/common/styled';
import { KText } from '../../../components/KForm';
import colors from '../../../components/common/colors';
import authService, { LoginResponse } from '../../../services/authService';
import notificationService from '../../../services/notificationService';
import queryString from 'query-string';
import { KForm } from '../../../components/KForm/';
import { Account } from '../../../redux/types';

interface loginFormProps {
  login: string;
  password: string;
}

export const LoginTab: React.FC<{
  t: any;
  location: any;
  disabled: boolean;
  setDisabled: (x: boolean) => void;
  loginCallback: (x: Account | LoginResponse) => void;
  error: (x: string) => void;
}> = ({ t, location, loginCallback, error, disabled, setDisabled }) => {
  const [loginForm, setLoginForm] = useState<loginFormProps>({
    login: '',
    password: ''
  });

  const setLoginFieldValue = useCallback( (name: string, value: any) => {
    setLoginForm({ ...loginForm, [name]: value });
  }, [loginForm]
  );

  const loginFormValidator = useRef<Validator>(
    new Validator({
      messages: {
        required: t(`validators.newEmailValidatorRequired`),
        email: t(`validators.emailValidator`),
        password: t(`validators.passwordValidator`)
      }
    })
  );

  useEffect(() => {
    const params: any = queryString.parse(location.search);
    if (params.user) {
      setLoginFieldValue('login', params.user);
      loginFormValidator.current.messagesShown = true;
    }
  }, [location.search, setLoginFieldValue]);

  const login = useCallback( () => {
    loginFormValidator.current.messagesShown = true;
    loginFormValidator.current.forceUpdate();
    if (loginFormValidator.current.allValid() && Object.keys(loginFormValidator.current.validationResults).length === 2) {
      setDisabled(true);
      authService.tryToLogin(loginForm.login, loginForm.password, loginCallback, error);
    } else {
      notificationService.showErrorMessage(t('notifications.correctMistakes'));
    }
  }, [loginCallback, error, loginForm, t, setDisabled]);

  return (
    <KForm onSubmit={login}>
      <Row>
        <Col layout={1}>
          <KText
            name={'login'}
            label={t(`loginTextPlaceholder`)}
            validations="required"
            validator={loginFormValidator.current}
            fieldValue={loginForm.login}
            setFieldValue={setLoginFieldValue}
            textColor={colors.white1}
            expectAutofill
          />
        </Col>
      </Row>
      <Row>
        <Col layout={1}>
          <KText
            name={'password'}
            label={t(`passwordTextPlaceholder`)}
            validations="required"
            validator={loginFormValidator.current}
            fieldValue={loginForm.password}
            setFieldValue={setLoginFieldValue}
            textColor={colors.white1}
            type="password"
            expectAutofill
          />
        </Col>
      </Row>
      <Row>
        <Col layout={1}>
          <PrimaryButton type="submit" disabled={disabled} fullWidth main center={'center'}>
            {t(`loginButton`)}
          </PrimaryButton>
        </Col>
      </Row>
      <Row>
        <Col>
          <GeneralText style={{ marginBottom: '10px' }} color="grey1">
            Hilfe:
          </GeneralText>
          <StyledLink style={{ padding: 0 }} color="blue1" to={t('routes:reset-password')}>
            Passwort vergessen
          </StyledLink>
        </Col>
      </Row>
    </KForm>
  );
};
