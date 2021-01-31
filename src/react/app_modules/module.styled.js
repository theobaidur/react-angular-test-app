import styled from 'styled-components';
import { device } from '../components/common/device';
import { theme as t } from '../assets/theming';

export const StyledModuleCol = styled.div.attrs(({ partner, isExtended }) => ({
  partner: partner,
  margin: !partner || isExtended ? 'margin: 0 auto;' : 'margin-right:4%',
  isExtended: isExtended
}))`
  width: ${(props) => (props.isExtended ? '100' : '48')}%;

  &.self {
    ${(props) => props.margin}
  }

  @media ${device.tablet} {
    width: 100%;
    margin: 0;
    &.self {
      margin-right: 0;
    }
  }
`;

export const ModuleHolder = styled.div`
  width: 100%;
  display: flex;
  flex: 1;
`;

export const ViewHolder = styled.div.attrs(({ partner, width }) => ({
  partner: partner,
  width: partner ? '100%' : width ? `${width}%` : '48%',
  margin: !partner ? 'margin: 0 auto 20px;' : 'margin: 0 0 20px'
}))`
    width: ${(props) => props.width};
    border: 2px solid ${t.analyzer.diagramBorder};
    ${(props) => props.margin}

    @media ${device.tablet}{
        width:100%;
        margin:0 0 10px;
    }
`;

export const ViewHeading = styled.h3.attrs(({ size, lined, type }) => ({
  size: size,
  lined: lined,
  type: type,
  color: type === 1 ? t.analyzer.diagramPillarFirst : t.analyzer.diagramPillarSecond
}))`
  font-size: ${(props) => (props.size ? props.size : '18')}px;
  margin: 0 auto;
  text-align: center;
  color: ${(props) => props.color};
  font-weight: 400;
`;
