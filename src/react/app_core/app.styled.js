import styled from 'styled-components';
import { gradientMixin, PrimaryButton } from '../components/common/styled';
import colors from '../components/common/colors';
import { theme as t } from '../assets/theming';
import icons from '../components/common/icons';
import { device } from '../components/common/device';

export const AvatarPerson = styled.div.attrs(({ img, active, partner, useAsMenu }) => ({
  active: active,
  partner: partner,
  useAsMenu: useAsMenu
}))`
  min-width: 28%;
  height: 160px;
  text-align: center;
  margin: 0 auto;

  div {
    width: 160px;
    height: 160px;
    border-radius: 50%;
    margin: 0 auto;
    position: relative;
    ${props=>props.useAsMenu ? 'cursor:pointer' : ''}
    opacity: ${(props) => (props.useAsMenu && !props.active ? '0.3' : '1')};
    &::before {
      content: '';
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 15px 15px 0 15px;
      border-color: ${(props) => (props.active && props.useAsMenu ? t.button.primary : 'transparent')} transparent
        transparent transparent;
      position: absolute;
      top: calc(100% - 3px);
      left: 50%;
      transform: translate(-50%, 0);
    }
  }

  img {
    width: 160px;
    height: 160px;
    border-radius: 50%;
    border: ${(props) => (props.active && props.useAsMenu ? '5px solid ' + t.button.primary : 'none')};
  }

  @media ${device.tablet} {
    & div {
      width: 120px;
      height: 120px;
    }
    & img {
      width: 120px;
      height: 120px;
    }
  }
`;

export const AvatarConnection = styled.div.attrs(({ mode }) => ({
  mode: mode
}))`
  @media ${device.tablet} {
    order: 2;
    width: 100%;
  }
`;

export const StyledWizard = styled.div`
  width: 100%;
`;

export const WizardToolbar = styled.div`
  display: flex;
  justify-content: center;
  padding: 15px;
`;

export const ButtonRedirect = styled.span.attrs(({ active, position }) => ({
  position: position,
  active: active
}))`
  font-size: 18px;
  color: ${colors.blue1};
  font-weight:700;
  text-transform: uppercase;
  &:hover {
    opacity: 0.5;
  }
  display: ${(props) => (props.active ? 'flex' : 'none')};
  cursor: pointer;
  align-items: center;
  user-select: none;
  position: relative;
  &::before, &::after {
    font-size: 60px;
    font-family: Leinero;
    width: auto;
    height: auto;
    font-weight: 600;
  }
  &::${(props) => (props.position === 'left' ? 'before' : 'after')} {
    content: '${(props) => icons[props.position]}';
    padding-${(props) => (props.position === 'left' ? 'right' : 'left')}: 14px;
  }
 @media ${device.tablet} {
   justify-content: center;
 }
`;

export const ButtonsContainer = styled.div`
  width: 1000px;
  margin: 0 auto;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
  padding: 0 20px;
  ${PrimaryButton} {
    margin: 20px auto;
  }
  @media ${device.laptop} {
    width: 100%;
  }
  @media ${device.tablet} {
    width: 100%;
    flex-direction: row;
    min-width: auto;
    max-width: auto;
    ${PrimaryButton} {
      min-width: 40%;
      flex: 0.4;
      flex-grow: 1;
      margin: 0px 5px 0px 5px;
    }
    position: sticky;
    bottom: 0px;
    margin-bottom: 0px;
    background-color: #ffffff;
    padding-top: 5px;
    padding-bottom: 5px;
  }
`;
export const WizardControl = styled.div.attrs(({ state, active }) => ({
  state: state,
  active: active
}))`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  cursor: pointer;
  margin: 10px;
  ${(props) => (props.active ? gradientMixin : 'background:' + colors.grey2)};
  ${(props) =>
    props.state === 2
      ? `
    text-align: center;
    background-color: ${colors.green0}
    &::before{
      content: '${icons.check}';
      color: ${colors.white0};
      font-style: normal;
      font-size: 30px;
      line-height: 21px;
      font-family: "Leinero", serif;
    }`
      : ''}
`;

export const WizardHeading = styled.h1`
  font-size: 28px;
  font-weight: 400;
  text-align: center;
`;


export const AppConsultantContact = styled.div`
    position: absolute;
    top: 20px; 
    right: 20px;
    line-height: 80px;

    @media ${device.tablet} {
      display:none;
    }
`;