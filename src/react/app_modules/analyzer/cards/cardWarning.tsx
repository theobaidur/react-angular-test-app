import React from 'react';

import { EmptyCard_Props } from '../../module.interfaces';
import { WhiteBox, Row, Col, GeneralText, Heading3} from '../../../components/common/styled';
import theme from '../../../assets/theming';


const CardWarning: React.FC<EmptyCard_Props> = (props: EmptyCard_Props) => {
    const {t} = props;
    return( 
        <WhiteBox>
            <Heading3 color={theme.analyzer.diagramNeed}>{ t(`warning.title`) }</Heading3>
            <Row>
                <Col layout={1}>
                    <GeneralText noMargin>
                        { t(`warning.message`) }
                    </GeneralText>
                </Col>
            </Row>
        </WhiteBox>
    );
}

export default CardWarning;