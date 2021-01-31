import React from 'react';

import { EmptyCard_Props } from '../../module.interfaces';
import { WhiteBox, Row, Col, GeneralText, Heading3, Heading5 } from '../../../components/common/styled';
import { Dossier } from '../../../redux/initialState';

const CardSuggestion: React.FC<EmptyCard_Props & { openNeedsEditor: () => void; history: any; state: Dossier; }> = 
(
  props: EmptyCard_Props & { openNeedsEditor: () => void; history: any, state: Dossier; }
) => {
  const { t, openNeedsEditor, mode, state } = props;
  return (
    <WhiteBox>
      <Row>
        <Col layout={1}>
        <Heading3>{t(`suggestions.title`)}</Heading3>
          <Heading5 hoverColor="blue2" onClick={openNeedsEditor} color={'blue1'}>
            {t(`suggestions.goalsTitle`) + ' >'}
          </Heading5>
          <GeneralText noMargin>{t(`suggestions.goalsText${mode || ''}`)}</GeneralText>
        </Col>
      </Row>

      <Row>
        <Col layout={1}>
          { state.specialist && (state.specialist.state === 0 || state.specialist.state === 1) ?
          ( 
            <>
            <Heading5>
              {t(`suggestions.consultantToContact`,{name:state.specialist.full_name}) + ' >'}
            </Heading5>
            <GeneralText noMargin>
              {t(`suggestions.consultantPhone`) + state.specialist.phone }
              <br />
              {t(`suggestions.consultantMail`) + ' ' }
                <a href={'mailto:'+state.specialist.mail}>{state.specialist.mail}</a>
              </GeneralText>
            </>
          ):(
          <>
          <Heading5
            color={'blue1'}
            hoverColor="blue2"
            onClick={() => props.history.push(t('routes:consultant-contact'))}
          >
            {t(`suggestions.consultTitle`) + ' >'}
          </Heading5>
          <GeneralText noMargin>{t(`suggestions.consultText${mode || ''}`)}</GeneralText>
          </>
          ) }
        </Col>
      </Row>
    </WhiteBox>
  );
};

export default CardSuggestion;
