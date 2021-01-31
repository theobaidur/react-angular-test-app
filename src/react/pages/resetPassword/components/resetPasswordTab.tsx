import React, { useState } from 'react';
import { Row, Col, PrimaryButton, SmallGeneralText, Heading2 } from '../../../components/common/styled';
import { KForm, KText } from '../../../components/KForm';
import Validator from '../../../utils/validator';
import colors from '../../../components/common/colors';
import notificationService from '../../../services/notificationService';
import authProvider from '../../../providers/authProvider';

interface ResetPasswordTab_Props {
  t: any;
}

const ResetPasswordTab: React.FC<ResetPasswordTab_Props> = ({ t }) => {
  const [isDisabled, setDisabled] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [formValidator] = useState<Validator>(
    new Validator({
      messages: {
        required: t(`validators.newEmailValidatorRequired`),
        email: t(`validators.emailValidator`)
      }
    })
  );

  const sendEmail = () => {
    formValidator.messagesShown = true;
    formValidator.forceUpdate();
    if (formValidator.allValid() && Object.keys(formValidator.validationResults).length === 1) {
      setDisabled(true);
      authProvider.resetPassword(
        email,
        () => {
          setSuccess(true);
        },
        (err: string) => {
          setDisabled(false);
          notificationService.showErrorMessage(t(`notifications.${err}`));
        }
      );
    } else {
      notificationService.showErrorMessage(t('notifications.correctMistakes'));
    }
  };

  return success ? (
    <Row>
      <Col layout={1}>
        <Heading2 color="white0">{t('checkEmailTitle')}</Heading2>
        <SmallGeneralText color="white0">{t('checkEmailFirstSection', { email: email })}</SmallGeneralText>
        <SmallGeneralText color="grey1">{t('checkEmailSecondSection')}</SmallGeneralText>
        <SmallGeneralText color="grey1">{t('checkEmailThirdSection')}</SmallGeneralText>
        <SmallGeneralText color="white0">{t('checkEmailFourthSection')}</SmallGeneralText>
      </Col>
    </Row>
  ) : (
    <KForm onSubmit={sendEmail}>
      <Row>
        <Col layout={1}>
          <Heading2 color="white1">{t('resetPasswordLabel')}</Heading2>
        </Col>
        <Col layout={1}>
          <KText
            name={'login'}
            label={t(`emailLabel`)}
            validations="required|email"
            validator={formValidator}
            fieldValue={email}
            setFieldValue={(x, y) => {
              setEmail(y);
            }}
            textColor={colors.white1}
            expectAutofill
          />
        </Col>
      </Row>
      <Row>
        <Col layout={1}>
          <PrimaryButton type="submit" disabled={isDisabled} fullWidth main center={'center'}>
            {t(`resetButton`)}
          </PrimaryButton>
        </Col>
      </Row>
    </KForm>
  );
};

export default ResetPasswordTab;
