import React, { useState, useEffect } from 'react';
import PortalComponent from '../../../../components/common/portal';
import DrawerComponent from '../../../../components/common/drawer';
import { Heading1 } from '../../../../components/common/styled';
import {
  NewsContainer,
  IconAction,
  NewsHeader,
  NewsWrapper,
  NewsWrapperHeader,
  CardNewsWrapper,
  StyledNewCard,
  StyledNewCardHeader,
  StyledDate,
  StyledLabel,
  StyledCardContent,
  StyledCardFooter,
  StyledCardText,
  StyledCardSubTitle,
  StyledCardTitle,
  StyledReadedCard,
  StyledReadedCardLabel,
  StyledReadedCardContent,
  StyledReadedDate,
  StyledReadedText,
  StyledReadedTitle,
  StyledReadedCollapseIcon
} from './news.styled';
import { Collapse } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import PicUpdate from '../../../../assets/images/update.jpg';
import PicWelcome from '../../../../assets/images/welcome.jpg';

interface NewsProps {
  isOpen: boolean;
  toggle: () => void;
}
export const News: React.FC<NewsProps> = ({ isOpen, toggle }) => {
  const { t } = useTranslation('news');
  const [isNewOpened, setNewOpened] = useState<boolean>(true);
  // const [isReadedOpened, setReadedOpened] = useState<boolean>(false);
  const [newNews, setNewNews] = useState<Array<any>>(newNews1);
  const [readedNews, setReadedNews] = useState<Array<any>>(readedNews1);
  console.log( readedNews );

  const buttonClick = (x: number) => {
    setReadedNews((news: Array<any>) => [newNews[x]].concat(news));
    setNewNews((news: Array<any>) => {
      news.splice(x, 1);
      return news;
    });
  };

  return (
    <PortalComponent isOpen={isOpen} toggle={toggle}>
      <DrawerComponent position="left" minWidth="50%" maxWidth="60%">
        <NewsContainer>
          <NewsHeader>
            <Heading1 noMargin>{t('title')}</Heading1>
            <IconAction style={{ marginLeft: 'auto' }} content="gear" />
            <IconAction content="close" onClick={toggle} />
          </NewsHeader>
          <NewsWrapper>
            <NewsWrapperHeader isOpen={isNewOpened} onClick={() => setNewOpened((res) => !res)}>
              {t('new')} ({newNews.length})
            </NewsWrapperHeader>
            <Collapse in={isNewOpened}>
              <CardNewsWrapper>
                {newNews &&
                  newNews.length > 0 &&
                  newNews.map((item: any, index: number) => (
                    <NewCard t={t} key={index} onButtonClick={() => buttonClick(index)} {...item}></NewCard>
                  ))}
              </CardNewsWrapper>
            </Collapse>
          </NewsWrapper>
          {/* <NewsWrapper>
            <NewsWrapperHeader isOpen={isReadedOpened} onClick={() => setReadedOpened((res) => !res)}>
              {t('readed')} ({readedNews.length})
            </NewsWrapperHeader>
            <Collapse in={isReadedOpened}>
              <CardNewsWrapper>
                {readedNews &&
                  readedNews.length > 0 &&
                  readedNews.map((item: any, index: number) => <ReadedCard t={t} key={index} {...item}></ReadedCard>)}
              </CardNewsWrapper>
            </Collapse>
                </NewsWrapper>*/}
        </NewsContainer>
      </DrawerComponent>
    </PortalComponent>
  );
};

const labelTypes = {
  type1: 'type1',
  type2: 'type2',
  type3: 'type3'
};

const News1: React.FC<{}> = () => {
  return (
    <>
      {
        'Moneto wird ständig verbessert und erweitert. Dazu gehören regelmässige Aktualisierungen, um auf fachliche bzw. gesetzliche Neuerungen zu reagieren, die Integration neuer Funktionen und Applikationen sowie die Umsetzung der Vorschläge von Dir und der moneto-Community.'
      }
      <br />
      <br />
      {'In diesem Bereich wirst Du über die Aktualisierungen (Updates) informiert.'}
      <br />
      <br />
      {
        'Hast Du ein Anliegen, Feedback oder Kritik zu moneto? Der moneto-Support (support@moneto.ch) nimmt Feedback jeder Art gerne entgegen und räumt diesem höchste Priorität ein.'
      }
    </>
  );
};

const News2: React.FC<{}> = () => {
  return (
    <>
      {
        '- Neu! Die Erfassung von Vermögen ist nun möglich. Das Vermögen kann in den Auswertungen eingesetzt werden um Lücken zu füllen. Für mehr Informationen klicken Sie auf die Informationsbalken'
      }
      <br />
      <br />
      {'- Anpassungen in den Account-Einstellungen'}
      <br />
      <br />
      {'- Verbesserungen der Geschwindigkeit und Sicherheit'}
      <br />
      <br />
      {'- Optimierungen des Dokument-Scans (OCR)'}
      <br />
      <br />
      {'- Neue Designelemente verfügbar'}
      <br />
      <br />
      {'- Anpassungen in der Darstellung'}
    </>
  );
};

const News3: React.FC<{}> = () => {
  return (
    <>
      {
        '- Neu! Die Erfassung von Lebensversicherungen ist nun möglich. Die Kapitalleistungen aus Lebensversicherungen können in den Auswertungen eingesetzt werden um Lücken zu füllen.'
      }
      <br />
      <br />
      {'- Erweiterung der Hilfetexte'}
      <br />
      <br />
      {'- Optimierungen des Dokument-Scans (OCR)'}
      <br />
      <br />
      {'- Neue Erfassungselemente verfügbar'}
      <br />
      <br />
      {'- Anpassungen in der Diagramm-Darstellung'}
      <br />
      <br />
      {'- Diverse Bugfixes'}
    </>
  );
};

const newNews1: any[] = [
  {
    title: 'Update 06.03.2020',
    date: '06 MAR 2020',
    img: PicUpdate,
    label: labelTypes.type3,
    text: <News3 />
  },
  {
    title: 'Update 04.02.2020',
    date: '04 FEB 2020',
    img: PicUpdate,
    label: labelTypes.type3,
    text: <News2 />
  },
  {
    title: 'Herzlich Willkommen auf moneto.ch',
    date: '06 JAN 2020',
    img: PicWelcome,
    label: labelTypes.type1,
    text: <News1 />
  }
];

const readedNews1: any[] = [];

interface ReadedCardProps {
  title: string;
  date: string;
  t: any;
  text: string;
  label: string;
}

export const ReadedCard: React.FC<ReadedCardProps> = ({ title, date, text, label, t }) => {
  const [isOpen, setOpen] = useState<boolean>(false);
  const [color, setColor] = useState<string>('');
  useEffect(() => {
    if (label === labelTypes.type1) {
      setColor('red1');
    } else if (label === labelTypes.type2) {
      setColor('green1');
    } else if (label === labelTypes.type3) {
      setColor('blue2');
    }
  }, [label]);
  return (
    <StyledReadedCard>
      <StyledReadedCardLabel color={color}>{t(label)}</StyledReadedCardLabel>
      <StyledReadedCardContent onClick={() => setOpen((open: boolean) => !open)}>
        <StyledReadedDate>{date}</StyledReadedDate>
        <StyledReadedTitle isOpen={isOpen} color={color}>
          {title}
        </StyledReadedTitle>
        <StyledReadedText isOpen={isOpen} color={color}>
          {text}
        </StyledReadedText>
        <StyledReadedCollapseIcon isOpen={isOpen} />
      </StyledReadedCardContent>
    </StyledReadedCard>
  );
};

interface NewCardProps extends ReadedCardProps {
  img: string;
  onButtonClick: () => void;
}
export const NewCard: React.FC<NewCardProps> = ({ title, date, text, label, img, t, onButtonClick }) => {
  let color: string = 'blue1';
  if (label === labelTypes.type1) {
    color = 'red1';
  } else if (label === labelTypes.type2) {
    color = 'green1';
  } else if (label === labelTypes.type3) {
    color = 'blue2';
  }

  let dateArray: Array<string> = date.split(' ');
  return (
    <StyledNewCard color={color}>
      <StyledNewCardHeader>
        <img src={img} alt={title} />
        <StyledDate color={color}>
          <span className="number">{dateArray[0] || ''}</span>
          <span className="month">{dateArray[1] || ''}</span>
        </StyledDate>
        <StyledLabel color={color}>{t(label)}</StyledLabel>
      </StyledNewCardHeader>
      <StyledCardContent>
        <StyledCardTitle color={color}> {title}</StyledCardTitle>
        <StyledCardSubTitle color={color}> {date}</StyledCardSubTitle>
        <StyledCardText>{text}</StyledCardText>
      </StyledCardContent>
      <StyledCardFooter>
        {/*<PrimaryButton height="40" background={color} style={{ margin: 0 }} minWidth="120" onClick={onButtonClick}>
          {t('buttonText')}
  </PrimaryButton> */}
      </StyledCardFooter>
    </StyledNewCard>
  );
};
