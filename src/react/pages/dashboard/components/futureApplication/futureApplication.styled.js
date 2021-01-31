import styled from 'styled-components';
import colors from '../../../../components/common/colors';
import { device } from '../../../../components/common/device';
import icons from '../../../../components/common/icons';
import { Heading3 } from '../../../../components/common/styled';
import { assetColors } from '../../../../assets/themes/moneto/assets';

export const FutureApplicationContainer = styled.div`
  display: flex;
  margin: 20px 40px;
  width: 400px;
  background-color: ${colors.white0};
  border: 1px solid ${assetColors.silverGray};
  border-radius: 4px;
  padding: 15px;
  align-items: center;

  @media ${device.tablet} {
    width: 100%;
    max-width: 350px;
    margin: 20px 0;
    flex-direction: column;
  }
`;

export const Icon = styled.i.attrs(({ content, background, color }) => ({
  content: content ? icons[content] : icons.eBike,
  background: background,
  color: color
}))`
  min-width: 110px;
  max-width: 110px;
  min-height: 110px;
  max-height: 110px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(props) => props.background};
  &:before {
    font-family: leinero;
    content: '${(props) => props.content}';
    color: ${(props) => props.color};
    width: auto;
    height: auto;
    font-size: 72px;
  }
`;

export const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 15px;
  height: 100%;
  ${Heading3} {
    font-size: 20px;
    margin-top: 5px;
    margin-bottom: 10px;
  }
  @media ${device.tablet} {
    margin-left: 0;
  }
`;
