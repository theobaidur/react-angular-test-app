import styled from 'styled-components';
import { device } from '../../components/common/device';
import { theme as t } from '../../assets/theming.ts';

export const AnalyzerHolder = styled.div`
  width: 100%;
  padding: 20px 40px;
  background: ${t.analyzer.diagramBackground};
  border: 1px solid ${t.analyzer.diagramBorder};
`;

export const AnalzyzerCards = styled.div``;

export const DiagramBlock = styled.div``;

export const DiagramHolder = styled.div`
  & > div {
    height: 500px;
  }

  @media ${device.tablet}{ 
    & > div {
      height: 300px;
    }
  }

  @media ${device.mobileL}{ 
    & > div {
      height: 200px;
    }
  }
`;

export const DiagramNavi = styled.div`
  display: flex;
`;
