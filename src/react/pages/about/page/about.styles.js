import styled from 'styled-components';
import icons from '../../../components/common/icons';
import colors from '../../../components/common/colors';
import { GeneralText, PrimaryButton } from '../../../components/common/styled';
import { device } from '../../../components/common/device';

export const SectionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 420px;
  align-items: center;
  justify-content: flex-end;
  padding-bottom: 60px;
`;

export const IconTitleInfoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-wrap: wrap;
  ${GeneralText} {
    text-align: center;
  }
`;

export const IconTitleInfoStyled = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px 20px 60px;
  width: 320px;
  flex-wrap: wrap;
`;

export const Icon = styled.i.attrs(({ content }) => ({ content: content ? icons[content] : icons.starFilled }))`
  &:before {
    font-family: leinero;
    font-size: 80px;
    color: ${colors.blue1};
    content '${(props) => props.content}';
  }
`;

export const AboutImg = styled.img`
  width: 100%;
  height: 220px;
  object-fit: cover;
  box-shadow: 1px 1px 7px rgba(0, 0, 0, 0.5);
`;

export const AboutTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  height: 100%;
`;

export const ButtonsCotnainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media ${device.tablet} {
    flex-direction: column;
  }
`;

export const ButtonContainerWithText = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  height: 100%;

  ${GeneralText} {
    margin: 0;
    margin-top: 20px;
  }
  ${PrimaryButton} {
    margin: 0;
    margin-top: 15px;
  }
  @media ${device.tablet} {
    align-items: center;
    &:not(:last-child) {
      margin-bottom: 50px;
    }
  }
`;
