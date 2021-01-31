import React from 'react';


import { EmptyCard_Props } from '../../module.interfaces';
import { WhiteBox, Row, Col, GeneralText, RectangleIcon, Heading3, Heading5 } from '../../../components/common/styled';

import theme from '../../../assets/theming';
import showNum from '../../../utils/showNum';


const CardRecommend: React.FC<EmptyCard_Props> = (props: EmptyCard_Props) => {
    const {t, data, mode} = props;

    const gateHole = data && data.hole.total < 1;
    const title = gateHole ? t(`facts.checkTitle`) : mode === 1 ? t(`facts.saveTitle`) : t(`facts.insureTitle`);   
    const text = gateHole ? t(`facts.checkText`,  { need: data && showNum(data.need.month) }) 
    : mode === 1 ? t(`facts.saveText`,{ month: data && showNum(data.hole.saveMonth), need: data && showNum(data.need.month) }) 
    : t(`facts.insureText`, { need: data && showNum(data.need.month) } );   

    return( 
        <WhiteBox>
            <Row>
                <Col layout={1}>
                <Heading3>{ t(`facts.title`) }</Heading3>
                <Row>
                <div style={{marginRight:'20px'}}>
                    <RectangleIcon 
                        content={'money6'}
                        color={theme.analyzer.diagramLabel}
                        backgroundColor={gateHole ? theme.analyzer.diagramCheck : theme.analyzer.diagramNeed}
                        />
                </div>
                <div style={{flex:'1'}}>
                    <Heading5>{title}</Heading5>
                    <GeneralText noMargin>
                        {text}
                    </GeneralText>
                </div>
                </Row>
                </Col>
            </Row>
        </WhiteBox>
    );
}


export default CardRecommend;