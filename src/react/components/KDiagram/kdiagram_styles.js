import styled from 'styled-components';
import { theme as t } from '../../assets/theming';

export const KDiagramHolder = styled.div`
    & .tick line,
    & .domain {
        stroke: ${t.analyzer.diagramYAxis}
    }
    & .tick text{
        fill: ${t.analyzer.diagramYAxis}
    }
`;