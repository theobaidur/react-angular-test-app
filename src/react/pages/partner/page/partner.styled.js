import styled from 'styled-components';
import { Heading3 } from '../../../components/common/styled';
import colors from '../../../components/common/colors';
import { device } from '../../../components/common/device';

export const OverviewSectionStyled = styled.div`
  margin-top: 40px;
`;

export const SectionHeader = styled(Heading3)`
  font-size: 20px;
`;

export const TextWrapper = styled.div`
  padding-left: 40px;
  .styled-link {
    color: ${colors.blue1};
    display: block;
    margin-bottom: 10px;
    cursor: pointer;
    font-size: 14px;
    &:hover {
      opacity: 0.6;
    }
  }
  @media ${device.laptop} {
    padding-left: 10px;
  }
`;

export const ImagesContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  img {
    margin-left: 40px;
  }
  @media ${device.laptop} {
    flex-direction: column;
    img {
      margin: 20px 0;
    }
  }
`;
