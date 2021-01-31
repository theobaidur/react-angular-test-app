import React, { useState, useEffect } from 'react';
import {
  Page,
  Wrapper,
  Heading1,
  Heading3,
  Row,
  Col,
  GeneralText,
  Heading2,
  Heading4,
  Icon,
  IconLink
} from '../../../components/common/styled';
import { useTranslation, Trans } from 'react-i18next';
import { TextWrapper } from '../../partner/page/partner.styled';
import { Collapse } from '@material-ui/core';
import { SupportTitleContainer, Divider } from './support.styled';

/* eslint-disable jsx-a11y/anchor-has-content */

const SupportPage: React.FC<any> = ({ match, history }) => {
  const { t } = useTranslation('support');
  const [current, setCurrent] = useState<number | undefined>(undefined);
  const [subCurrent, setSubCurrent] = useState<number | undefined>(undefined);
  const [items] = useState<Array<any>>(t('items', { returnObjects: true }));

  useEffect(() => {
    if (history.location.pathname.indexOf('support/') === -1) {
      setCurrent(undefined);
      setSubCurrent(undefined);
    }
  }, [history.location]);

  const id = match && match.params && match.params.id;
  useEffect(() => {
    if (id) {
      items.forEach((item: { title: string; url: string }, index: number) => {
        if (
          item &&
          (item.title.toLowerCase() === id || (item.url && item.url.toLowerCase() === id))
        ) {
          setCurrent(index);
        }
      });
    }
  }, [items, id, setCurrent]);

  return (
    <Page color={'white'} paddingBottom={150}>
      <IconLink
        content="leftBig"
        className="support"
        to={`/`}
        onClick={(evt) => {
          evt.preventDefault();
          if (history.location.pathname.indexOf('support/') > -1) {
            history.push(t('routes:support'));
            setCurrent(undefined);
            setSubCurrent(undefined);
          } else {
            history.push('/');
          }
        }}
      >
        {t('back')}
      </IconLink>
      <Wrapper>
        <Row>
          <Col>
            <Heading1 size="36" bold style={{}} noMargin>
              {current || current === 0 ? items[current].title : t('title')}
            </Heading1>{' '}
          </Col>
        </Row>

        {(current || current === 0) && current < items.length ? (
          <Row>
            <Col>
              <QuestionsExpanded
                current={current}
                item={items[current]}
                subCurrent={subCurrent}
                setSubCurrent={setSubCurrent}
              />
            </Col>
          </Row>
        ) : (
          <Row>
            <Col>
              {items &&
                items.length > 0 &&
                items.map &&
                items.map((item: any, index: number) => (
                  <ListOfQuestions
                    title={item.title}
                    url={item.url}
                    key={index}
                    subItems={item.subItems}
                    history={history}
                    index={index}
                    t={t}
                    setCurrent={(x: number, y: number) => {
                      setCurrent(x);
                      setSubCurrent(y);
                    }}
                  />
                ))}
            </Col>
          </Row>
        )}
      </Wrapper>
    </Page>
  );
};

interface ListOfQuestions_Props {
  title: string;
  url: string;
  subItems: Array<any>;
  t: any;
  index: number;
  history: any;
  setCurrent: (x: number, y: number) => void;
}

const ListOfQuestions: React.FC<ListOfQuestions_Props> = ({ title, url, t, subItems, index, history, setCurrent }) => (
  <>
    <Heading2>{title}</Heading2>
    <TextWrapper>
      {subItems &&
        subItems.length > 0 &&
        subItems.map((item: any, ind: number) => (
          <Heading4
            key={ind}
            style={{ marginBottom: '10px', cursor: 'pointer' }}
            color="blue1"
            onClick={() => {
              setCurrent(index, ind);
              history.push(`${t('routes:support')}/${(url && url.toLowerCase()) || title.toLowerCase()}`);
            }}
          >
            {item.title}
          </Heading4>
        ))}
    </TextWrapper>
  </>
);

interface QuestionsExpanded_Props {
  item: any;
  current: number | undefined;
  subCurrent: number | undefined;
  setSubCurrent: (x: number) => void;
}

const QuestionsExpanded: React.FC<QuestionsExpanded_Props> = ({ item, current, subCurrent, setSubCurrent }) => {
  return (
    <>
      {item.subItems &&
        item.subItems.length > 0 &&
        item.subItems.map((x: any, index: number) => (
          <React.Fragment key={index}>
            <SupportTitleContainer onClick={() => setSubCurrent(subCurrent === index ? -1 : index)}>
              <Heading3 size={subCurrent === index ? '24' : '16'} color="blue1" noMargin>
                {x.title}
              </Heading3>

              <Icon size="56" content={subCurrent === index ? 'up' : 'down'} />
            </SupportTitleContainer>
            <Collapse in={subCurrent === index}>
              <TextWrapper>
                <GeneralText>
                  <Trans i18nKey={`support:items.${current}.subItems.${subCurrent}.description`}>
                    {[
                      <a
                        key={0}
                        href="https://www.mozilla.org/de/firefox/new/"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ marginRight: '20px', cursor: 'pointer' }}
                      ></a>,
                      <a
                        key={1}
                        href="https://www.google.com/intl/de/chrome/"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ marginRight: '20px', cursor: 'pointer' }}
                      ></a>,
                      <a
                        key={2}
                        href="https://inforegister.zas.admin.ch/InfoWeb/"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ marginLeft: '20px', cursor: 'pointer' }}
                      ></a>,
                      <a
                        key={3}
                        href="https://www.ahv-iv.ch/de/Merkbl%C3%A4tter-Formulare/Bestellung-Kontoauszug/Schweiz"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ marginLeft: '20px', cursor: 'pointer' }}
                      ></a>,
                      <a
                        key={4}
                        href="https://web.aeis.ch/"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ marginLeft: '20px', cursor: 'pointer' }}
                      ></a>
                    ]}
                  </Trans>
                </GeneralText>
              </TextWrapper>
            </Collapse>
            <Divider />
          </React.Fragment>
        ))}
    </>
  );
};

export default SupportPage;
