import React, { useState, useEffect } from 'react';
import { useStore } from 'react-redux';
import {
  Row,
  Col,
  Page,
  Section,
  PrimaryButton,
  Separator,
  Icon,
  GeneralText
} from '../../../components/common/styled';
import { useTranslation } from 'react-i18next';
import { TabsComponent, TabsContainer, TabContent } from '../../../components/common/tabs';
import { KText, KCheck, KRadio, KDatePicker, KTimePicker } from '../../../components/KForm';
import colors from '../../../components/common/colors';
import Validator from '../../../utils/validator';
import { Link } from 'react-router-dom';
import { TosLabel } from '../components/tosLabel/tosLabel.styled';
import PlzSelect from '../components/pzlSelect';
import { debounce } from 'throttle-debounce';
import { useDispatch } from 'react-redux';
import { pushContactAttempt, changeSpecialist } from '../../../redux/actions';
import { Tab } from '@material-ui/core';
import notificationService from '../../../services/notificationService';
import consultantProvider from '../../../providers/consultantProvider';

interface ContactFormProps {
  plz: string;
  ort: string;
  contactMethod: any;
  phone: string;
  calltimedate: string;
  calltimehour: string;
  calltimeoption: any;
  accepted: any;
}

interface Postcode {
  country: string;
  pc: number;
  place: string;
  ac1: string;
  ac2: string;
  ac3: string;
}

const ConsultantContactPage: React.FC<{ history: any }> = ({ history }) => {
  const { t } = useTranslation('consultantContact');
  const dispatch = useDispatch();
  const state = useStore().getState();
  const defaultTab = 'contactTab';

  const [activeTab, setActiveTab] = useState(defaultTab);
  const [isValid, setIsValid] = useState<boolean | string>();
  const [searchResults, setSearchResults] = useState([]);

  const [contactFormValidator] = useState<Validator>(
    new Validator({
      messages: {
        required: t(`validators.required`)
      }
    })
  );

  const [isOptInRequired, setIsOptInRequired] = useState<boolean>(false);
  useEffect(() => {
    consultantProvider.getOptInState(
      (res: any) => {
        setIsOptInRequired(res.OptInState);
      },
      (err: any) => {
        console.log(err);
      }
    );
  }, []);

  useEffect(() => {
    if (isOptInRequired) setActiveTab('optInTab');
  }, [isOptInRequired]);

  const checkValidation = (newValue: any) => {
    let isValidCustom =
      contactForm.plz &&
      contactForm.ort &&
      contactForm.contactMethod &&
      (contactForm.contactMethod[0] === 2 ||
        (contactForm.contactMethod[0] === 1 &&
          contactForm.phone &&
          contactForm.calltimeoption &&
          (contactForm.calltimeoption[0] === 1 ||
            (contactForm.calltimeoption[0] === 2 && contactForm.calltimehour && contactForm.calltimedate))));

    setIsValid(isValidCustom);
  };

  contactFormValidator.onValidationResult = checkValidation;

  const [contactForm, setContactForm] = useState<ContactFormProps>({
    plz: '',
    ort: '',
    contactMethod: '',
    phone: '',
    calltimedate: '',
    calltimehour: '',
    calltimeoption: '',
    accepted: ''
  });

  const setContactFieldValue = (name: string, value: any) => {
    if (name === 'phone' && value && value.length) {
      value = value.trim();
      if (value.startsWith('0')) {
        value = `${'+41'}${value.substring(1)}`;
      }
    }

    setContactForm({ ...contactForm, [name]: value });
    contactFormValidator.purgeFields();
    contactFormValidator.forceUpdate();
  };

  const setPlzFieldValue = (name: string, value: any) => {
    console.log('setPlzFieldValue ' + name + ' ' + JSON.stringify(value));
    if ((name === 'ort' || name === 'plz') && value.pc && value.place) {
      setContactForm({ ...contactForm, plz: value.pc, ort: value.place });
    } else {
      setContactForm({ ...contactForm, [name]: value });
    }

    contactFormValidator.purgeFields();
    contactFormValidator.forceUpdate();
  };

  const updateSearchResults = (text: string) => {
    if (!text) return;
    console.log('updateSearchResults ' + text);
    consultantProvider.getLocations(
      text,
      (res: any) => (res ? setSearchResults(res) : setSearchResults([])),
      (err: string) => console.log(err)
    );
  };
  const [updateSearchResultsDebounced] = useState(() => debounce(250, updateSearchResults));

  function getFormData(object: any) {
    const formData = new FormData();
    Object.keys(object).forEach((key) => formData.append(key, object[key]));
    return formData;
  }

  const submitForm = () => {
    contactFormValidator.messagesShown = true;
    contactFormValidator.forceUpdate();
    if (contactFormValidator.allValid() && Object.keys(contactFormValidator.validationResults).length > 0) {
      dispatch(
        pushContactAttempt({
          ...contactForm,
          timestamp: new Date().getTime(),
          app: ''
        })
      );

      consultantProvider.requestSpecialist(
        getFormData({
          ...contactForm,
          contactMethod: contactForm.contactMethod[0],
          calltimeoption: contactForm.calltimeoption ? contactForm.calltimeoption[0] : 0
        }),
        (res: any) => {
          if (res.error) {
            if (res.error === 'RequestAlreadyPresent') {
              notificationService.showErrorMessage(t('RequestAlreadyPresent'));
            } else {
              notificationService.showErrorMessage(t('SpecialistNotContacted'));
            }
          } else {
            setActiveTab('successTab');
            notificationService.showSuccessMessage(t('SpecialistContacted'));
            dispatch(changeSpecialist({ state: 0 } as any));
          }
        },
        (err) => {
          console.log(err);
          notificationService.showErrorMessage(t('SpecialistNotContacted'));
        }
      );
    }
  };

  const onOptInClick = () => {
    consultantProvider.optInSpecialist(
      (res: any) => {
        setActiveTab('successTab');
        notificationService.showSuccessMessage(t('SpecialistContacted'));
      },
      (err: any) => {
        console.log(err);
        notificationService.showErrorMessage(t('SpecialistNotContacted'));
      }
    );
  };

  return (
    <Page style={{ minHeight: 'calc(100vh - 60px)' }}>
      <Section background="white3" minHeight={'15vh'}>
        <Row noMargin>
          <Col layout={1} force align="right">
            <Link to="/">
              <Icon
                style={{ padding: 0, margin: 0, cursor: 'pointer', float: 'right' }}
                size="55"
                content="close"
                cursor="pointer"
              />
            </Link>
          </Col>
        </Row>
      </Section>
      <Section background="white3" style={{ textAlign: 'center' }}>
        <Row noMargin style={{ maxWidth: '500px', display: 'inline-block' }}>
          <Col layout={1 / 2} align="center">
            <Row>
              <Col layout={1}>
                <TabsComponent
                  color={'black0'}
                  defaultTab={defaultTab}
                  onChanged={(val) => {
                    setActiveTab(val);
                  }}
                >
                  {[<Tab value={activeTab} label={t(`contactTabHeader`)} key={0}></Tab>]}
                </TabsComponent>
              </Col>
            </Row>
          </Col>
          <Col layout={1 / 4} />
        </Row>
        <Separator />
        <Row noMargin style={{ maxWidth: '500px', display: 'inline-block' }}>
          <Col layout={1 / 4} />
          <Col layout={1 / 2} align="center">
            <TabsContainer activeTabId={activeTab}>
              {[
                <TabContent id="optInTab" key={2}>
                  <Row>
                    <Col center style={{ textAlign: 'center' }}>
                      <GeneralText>{t(`OptInText`)}</GeneralText>
                    </Col>
                    <Col center>
                      <PrimaryButton main style={{ marginLeft: 0 }} onClick={onOptInClick}>
                        {t(`OptInButtonText`)}
                      </PrimaryButton>
                    </Col>
                  </Row>
                </TabContent>,
                <TabContent id="successTab" key={1}>
                  <Row>
                    <Col center style={{ textAlign: 'center' }}>
                      <GeneralText>{t(`SuccessText`)}</GeneralText>
                    </Col>
                    <Col center>
                      <PrimaryButton main style={{ marginLeft: 0 }} onClick={() => history.push('/')}>
                        {t(`BackButtonText`)}
                      </PrimaryButton>
                    </Col>
                  </Row>
                </TabContent>,
                <TabContent id="contactTab" key={0}>
                  <Row style={{ marginBottom: '0px' }}>
                    <Col layout={1}>
                      <GeneralText>
                        {t(`plzQuestion`)}
                        {/*<Icon
                          style={{
                            padding: 0,
                            marginLeft: '10px',
                            cursor: 'pointer',
                            height: '30px',
                            position: 'absolute',
                            display: 'inline-block'
                          }}
                          size="55"
                          content="infoCircle"
                          cursor="pointer"
                          onClick={() => {
                            alert('clicked info');
                          }}
                        />*/}
                      </GeneralText>
                    </Col>
                  </Row>
                  <Row noMargin>
                    <Col layout={7 / 20} style={{ paddingRight: '0px' }}>
                      <PlzSelect
                        name={'plz'}
                        label={t(`plzLabel`)}
                        items={searchResults.map((p: Postcode) => {
                          return {
                            label: `${p.pc} - ${p.place}`,
                            value: `${p.pc}`,
                            place: `${p.place}`,
                            pc: `${p.pc}`
                          };
                        })}
                        validations="required|numeric"
                        validator={contactFormValidator}
                        fieldValue={contactForm.plz ? `${contactForm.plz}` : ''}
                        setFieldValue={setPlzFieldValue}
                        onInputChange={updateSearchResultsDebounced}
                        minListWidth={'200%'}
                      />
                    </Col>
                    <Col layout={2 / 20}></Col>
                    <Col layout={11 / 20} style={{ paddingLeft: '0px' }}>
                      <PlzSelect
                        name={'ort'}
                        label={t(`ortLabel`)}
                        items={searchResults.map((p: Postcode) => {
                          return {
                            label: `${p.place} - ${p.pc}`,
                            value: `${p.place}`,
                            place: `${p.place}`,
                            pc: `${p.pc}`
                          };
                        })}
                        validations="required"
                        validator={contactFormValidator}
                        fieldValue={contactForm.ort ? `${contactForm.ort}` : ''}
                        setFieldValue={setPlzFieldValue}
                        onInputChange={contactForm.ort.length > 2 ? updateSearchResultsDebounced : () => {}}
                        minListWidth={'100%'}
                      />
                    </Col>
                  </Row>

                  <Row style={{ marginBottom: '0px' }}>
                    <Col layout={1}>
                      <GeneralText>{t('contactMethodQuestion')}</GeneralText>
                    </Col>
                  </Row>
                  <Row noMargin>
                    <Col layout={1}>
                      <KRadio
                        name={'contactMethod'}
                        label={t('contactMethodLabel')}
                        noLabel
                        itemsName={[0, 1].map((e) => {
                          return t(`contactMethods.${e}`);
                        })}
                        itemsValue={[1, 2]}
                        fieldValue={contactForm.contactMethod}
                        setFieldValue={setContactFieldValue}
                        validator={contactFormValidator}
                        validations="required|between:1,2"
                      />
                    </Col>
                  </Row>

                  {contactForm.contactMethod && contactForm.contactMethod[0] === 1 ? (
                    <>
                      <Row style={{ marginBottom: '0px' }}>
                        <Col layout={1}>
                          <GeneralText>{t('phoneQuestion')}</GeneralText>
                        </Col>
                      </Row>
                      <Row noMargin>
                        <Col layout={1}>
                          <KText
                            name={'phone'}
                            label={t('phoneLabel')}
                            validations="required"
                            validator={contactFormValidator}
                            fieldValue={contactForm.phone}
                            setFieldValue={setContactFieldValue}
                            mask={[
                              /\d|\+/,
                              /\d/,
                              /\d/,
                              ' ',
                              /\d/,
                              /\d/,
                              ' ',
                              /\d/,
                              /\d/,
                              /\d/,
                              ' ',
                              /\d/,
                              /\d/,
                              ' ',
                              /\d/,
                              /\d/,
                              /\d/,
                              /\d/,
                              /\d/
                            ]}
                          />
                        </Col>
                      </Row>

                      <Row style={{ marginBottom: '0px' }}>
                        <Col layout={1}>
                          <GeneralText>{t('callTimeQuestion')}</GeneralText>
                        </Col>
                      </Row>
                      <Row noMargin>
                        <Col layout={1}>
                          <KRadio
                            name={'calltimeoption'}
                            label={t('calltimeOptionLabel')}
                            noLabel
                            itemsName={[0, 1].map((e) => {
                              return t(`calltimeoptions.${e}`);
                            })}
                            itemsValue={[1, 2]}
                            fieldValue={contactForm.calltimeoption}
                            setFieldValue={setContactFieldValue}
                            validator={contactFormValidator}
                            validations="required"
                          />
                        </Col>
                      </Row>

                      {contactForm.calltimeoption && contactForm.calltimeoption[0] === 2 ? (
                        <>
                          <Row noMargin>
                            <Col layout={1 / 2}>
                              <KDatePicker
                                name={'calltimedate'}
                                label={t('calltimedateLabel')}
                                validator={contactFormValidator}
                                fieldValue={contactForm.calltimedate}
                                setFieldValue={setContactFieldValue}
                                validations={`required`}
                              />
                            </Col>
                            <Col layout={1 / 2}>
                              <KTimePicker
                                name={'calltimehour'}
                                label={t(`calltimehourLabel`)}
                                fieldValue={contactForm.calltimehour}
                                setFieldValue={setContactFieldValue}
                                validator={contactFormValidator}
                                validations="required"
                              />
                            </Col>
                          </Row>
                        </>
                      ) : null}
                    </>
                  ) : contactForm.contactMethod && contactForm.contactMethod[0] === 2 ? (
                    <>
                      <Row>
                        <Col layout={1}>
                          <GeneralText style={{ marginBottom: '0px' }}>{t('emailQuestion')}</GeneralText>
                          <div style={{ color: colors.grey1 }}>
                            {state && state.account && state.account.mail ? state.account.mail : ''}
                          </div>
                        </Col>
                      </Row>
                    </>
                  ) : null}

                  {isValid ? (
                    <>
                      <Row>
                        <Col layout={1} style={{ display: 'flex', justifyContent: 'row', alignItems: 'center' }}>
                          <KCheck
                            name="accepted"
                            itemsName={[
                              <TosLabel>
                                {t(`textToS0`)}
                                <Link
                                  to={t('routes:privacy-policy')}
                                  target="_blank"
                                  style={{ cursor: 'pointer', color: '#1babea' }}
                                >
                                  {' '}
                                  {t(`textToSPrivacy`)}
                                </Link>
                                <Link to={t('routes:terms-of-use')} target="_blank" style={{ color: '#1babea' }}>
                                  {t(`textToSFirstLink`)}{' '}
                                </Link>
                                {t(`textToS1`)}
                                <Link
                                  to={t('routes:terms-and-conditions')}
                                  target="_blank"
                                  style={{ color: '#1babea' }}
                                >
                                  {t(`textToSSecondLink`)}{' '}
                                </Link>
                                {t(`textToS2`)}
                              </TosLabel>
                            ]}
                            itemsValue={[1]}
                            fieldValue={contactForm.accepted}
                            setFieldValue={setContactFieldValue}
                            darkMode
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col layout={1}>
                          <PrimaryButton
                            fullWidth
                            center={'center'}
                            disabled={
                              (contactForm.accepted && contactForm.accepted.indexOf(1) === -1) || !contactForm.accepted
                            }
                            onClick={submitForm}
                          >
                            {t(`contactButton`)}
                          </PrimaryButton>
                        </Col>
                      </Row>
                    </>
                  ) : null}
                </TabContent>
              ]}
            </TabsContainer>
          </Col>
        </Row>
      </Section>
    </Page>
  );
};
export default ConsultantContactPage;
