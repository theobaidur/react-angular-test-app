import styled from 'styled-components';
import colors from '../../../../components/common/colors';
import { device } from '../../../../components/common/device';
import { assetColors } from '../../../../assets/themes/moneto/assets';

export const StyledApplicationWrapper = styled.div`
  display: block;
  margin: 20px 40px;
  width: 400px;

  @media ${device.tablet} {
    width: 100%;
    max-width: 350px;
    margin: 20px;
  }
`;

export const StyledApplication = styled.div`
  position: relative;
  display: flex;
  margin-top: 10px;
  flex-direction: column;
  background-color: ${colors.white0};
  border: 1px solid ${assetColors.silverGray};
  border-radius: 4px;
  align-items: center;
  padding: 20px 20px 10px;
  p {
    min-height: 48px;
    width: 100%;
    color: ${assetColors.spaceGray};
    strong {
      color: ${assetColors.vaderGray};
      font-weight: 700;
    }
  }
`;

export const IconsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  img {
    margin: 10px;
    max-width: 50%;
    margin: auto;
  }
`;
