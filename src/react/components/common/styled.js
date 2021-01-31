import styled, { css } from 'styled-components';
import React from 'react';
import { Link } from 'react-router-dom';
import colors from './colors';
import icons from './icons';
import { device } from './device';
import { theme as t } from '../../assets/theming';
import Button from '@material-ui/core/Button';

export const gradientMixin = css`
  background-image: linear-gradient(to top right, ${colors.green1}, ${colors.blue1});
`;

export const textOverflowMixin = (x) => css`
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: ${x};
  text-overflow: ellipsis;
  /* autoprefixer: off */
  -webkit-box-orient: vertical;
`;

export const Page = styled.div.attrs(({ color, paddingBottom }) => ({
  background: color,
  paddingBottom: paddingBottom
}))`
  width: 100%;
  min-height: calc(100vh - 60px);
  padding-bottom: ${(props) => props.paddingBottom}px;
  position: relative;
  display: flex;
  flex-direction: column;
  background: ${(props) => props.background || t.module.background};
  overflow: hidden;

  &.contentPage strong {
    font-weight: 700;
    margin: 30px 0 0;
    display: block;
  }
`;

export const Wrapper = styled.div.attrs(({ width, formOffset }) => ({
  width: width ? width : 1000,
  formOffset: formOffset
}))`
  max-width: ${(props) => props.width}px;
  width: 100%;
  margin: 0 auto;
  padding: 0 20px;

  @media ${device.laptop} {
    width: 100%;
  }

  @media ${device.tablet} {
    padding: ${(props) => (props.formOffset ? '0 20px' : '0 20px')};
  }
`;

export const Row = styled.div.attrs(({ noMargin }) => ({
  noMargin: noMargin
}))`
  width: 100%;
  margin: ${(props) => (props.noMargin ? '0' : '20px auto')};
  flex: 0;
  flex-wrap: wrap;
  display: flex;
`;

export const Col = styled.div.attrs(({ layout, layoutS, align, center, force }) => ({
  layout: layout,
  layoutS: layoutS,
  center: center,
  align: align,
  force: force,
  width: layout ? 100 * layout : 100,
  widthS: layoutS ? 100 * layoutS : 100
}))`
  min-width: ${(props) => props.width}%;
  flex: 1 0;
  flex-wrap: wrap;
  padding: 0 20px;
  display: ${(props) => (props.center ? 'flex' : 'block')};
  align-items: ${(props) => (props.center ? 'center' : 'unset')}
  justify-content: ${(props) => (props.center ? 'center' : 'unset')}
  text-align: ${(props) => (props.align ? props.align : 'left')}

  &.disabled {
    pointer-events: none;
    opacity: 0.5;
  }
  &.padding-left {
    padding-left: 0;
  }
  
  &.padding-right {
    padding-right: 0;
  }
  @media ${device.tablet} {
    flex: ${(props) => (props.force ? '1 0' : '1 1 auto')};
    min-width: ${(props) => props.widthS}%;
    padding: 0 10px;
    &.no-padding, &.padding-right, &.padding-left {
      padding: 0;
    }
  }
`;

export const PrimaryButton = styled(
  ({
    main,
    disabled,
    height,
    center,
    minWidth,
    visibility,
    outlined,
    fullWidth,
    background,
    border,
    color,
    isDesktopOnly,
    ...rest
  }) => <Button {...rest} />
).attrs(
  ({
    main,
    disabled,
    height,
    center,
    minWidth,
    visibility,
    outlined,
    fullWidth,
    background,
    border,
    color,
    isDesktopOnly
  }) => ({
    main: main,
    center: center,
    disabled: disabled,
    visibility: visibility,
    height: height ? `${height}px` : '60px',
    outlined: outlined,
    minWidth: minWidth ? `${minWidth}px` : '200px',
    background: background ? 'background:' + colors[background] : main ? gradientMixin : 'background:' + colors.blue1,
    border: outlined ? 'border: 2px solid' + colors.blue1 : 'border:0',
    color: outlined ? colors.blue1 : 'white',
    fullWidth: fullWidth,
    isDesktopOnly: isDesktopOnly
  })
)`
&&{
  transition: opacity 1s;
  min-width: ${(props) => props.minWidth};
  height: ${(props) => props.height};
  font-size: 16px;
  font-family: 'Roboto Condensed', sans-serif;
  margin: ${(props) => (props.center ? '20px auto' : '20px 20px 20px 0')}
  text-align: center;
  ${(props) => props.border}
  ${(props) => (props.outlined ? 'background:none; font-weight:700;' : props.background)}
  ${(props) => (props.disabled ? 'pointer-events: none; opacity: 0.4;' : '')}
  ${(props) => (props.fullWidth ? 'width:100%' : '')}
  visibility: ${(props) => props.visibility};
  color: ${(props) => props.color};
  text-transform: uppercase;
  border-radius: 30px;
  padding: 0 35px;
  outline: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  .MuiButton-label{
    ${(props) => (props.outlined ? 'font-weight:700;' : '')}
  }
  &:hover {
    opacity: 0.8;
    ${(props) => (props.outlined ? 'background:none; font-weight:700;' : props.background)}
  }
  &:disabled {
    ${(props) => (props.outlined ? 'background:none; font-weight:700;' : props.background)}
    color: ${(props) => props.color};
  }
  @media ${device.tablet} {
    ${(props) => (props.isDesktopOnly ? 'display:none;' : '')}
  }
}
`;

export const Bolded = styled.h3.attrs(({ color }) => ({
  color: color ? colors[color] : colors.black1
}))`
  font-size: 16px;
  font-weight: bold;
  text-transform: uppercase;
  margin: 10px 0;
  color: ${(props) => props.color};
`;

export const Heading1 = styled.h1.attrs(({ color, size, align, light, bold, noMargin }) => ({
  color: color ? colors[color] : colors.black1,
  size: size ? size : 24,
  light: light,
  align: align,
  noMargin: noMargin,
  bold: bold,
  weight: light ? 300 : bold ? 700 : 400
}))`
  margin: ${(props) => (props.noMargin ? '0' : '20px 0')};
  font-size: ${(props) => props.size}px;
  font-weight: ${(props) => props.weight};
  color: ${(props) => props.color};
  text-align: ${(props) => (props.align ? props.align : 'inherit')};
  font-family: ${t.fonts.heading1};
  @media ${device.tablet} {
    font-size: 24px;
  }
`;

export const Heading2 = styled.h2.attrs(({ color, noMargin }) => ({
  color: color ? colors[color] : colors.black1,
  noMargin: noMargin
}))`
  margin: ${(props) => (props.noMargin ? '0' : '20px 0')};
  font-size: 24px;
  font-weight: 400;
  color: ${(props) => props.color};
`;

export const Heading3 = styled.h3.attrs(({ color, light, bold, noMargin, size }) => ({
  color: !color ? colors.black1 : colors[color] ? colors[color] : color,
  noMargin: noMargin,
  light: light,
  size: size ? `${size}px` : '24px',
  bold: bold,
  weight: light ? 300 : bold ? 700 : 400
}))`
  margin: ${(props) => (props.noMargin ? '0' : '20px 0')};
  font-size: ${(props) => props.size};
  font-weight: ${(props) => props.weight};
  color: ${(props) => props.color};
  font-family: ${t.fonts.heading3};
  transition: all 0.25s;
  @media ${device.tablet} {
    font-size: 18px;
  }
`;

export const Heading4 = styled.h3.attrs(({ color }) => ({
  color: color ? colors[color] : colors.black1
}))`
  margin: 0;
  font-size: 16px;
  font-weight: 400;
  color: ${(props) => props.color};
`;

export const Heading5 = styled.h3.attrs(({ color, hoverColor }) => ({
  color: color ? colors[color] : colors.black1,
  hoverColor: hoverColor ? colors[hoverColor] : color
}))`
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: ${(props) => props.color};

  &:hover {
    color: ${(props) => props.hoverColor};
    cursor: ${(props) => (props.hoverColor !== props.color ? 'pointer' : 'default')};
  }
`;

export const Section = styled.div.attrs(({ background, img, minHeight, minHeightTablet }) => ({
  background: background ? colors[background] : colors.white0,
  img: img ? `url(${img}) 50% 0` : '',
  minHeight: minHeight ? minHeight : '400px',
  minHeightTablet: minHeightTablet ? minHeightTablet : '250px'
}))`
  position: relative;
  padding: 40px 0;
  background: ${(props) => props.background + ' ' + props.img}
  background-size: cover;
  background-position: bottom;
  min-height: ${(props) => props.minHeight};

  &.hero{
    padding:40px 0;
  }

  @media ${device.laptop} {
    min-height: 200px;
  }

  @media ${device.laptopL} {
    min-height: 150px;
    ${Heading1} {
      font-size: 36px;
    }
  }

  @media ${device.tablet}{
    min-height: ${(props) => props.minHeightTablet};
    padding: 5px 10px;
    ${Heading1} {
      font-size: 24px;
    }
    &.hero{
      padding:20px 0;
      min-height: 300px;
    }
  }

`;

export const CardHeading = styled.h3.attrs(({ color }) => ({
  color: color ? colors[color] : colors.black1
}))`
  margin: 0 0 20px;
  font-size: 20px;
  font-weight: 400;
  color: ${(props) => props.color};
`;

export const CardQuestion = styled.h4.attrs(({ color }) => ({
  color: color ? colors[color] : colors.black1
}))`
  margin: 10px 0;
  font-size: 16px;
  font-weight: 400;
  color: ${(props) => props.color};
`;

export const GeneralText = styled.p.attrs(({ color, fontSize, noMargin, fontWeight, noInnerMargin }) => ({
  color: color ? colors[color] : colors.black1,
  fontSize: fontSize ? fontSize : 16,
  fontWeight: fontWeight ? fontWeight : 400,
  noMargin: noMargin,
  noInnerMargin: noInnerMargin
}))`
  margin: ${(props) => (props.noMargin ? '0' : '20px 0')};
  font-size: ${(props) => props.fontSize}px;
  line-height: 1.2em;
  font-weight: ${(props) => props.fontWeight};
  color: ${(props) => props.color};

  & strong {
    color: black;
  }
  & p {
    margin: ${(props) => (props.noInnerMargin ? '0' : '20px 0')};
  }
  & a {
    color: ${colors.blue1};
    text-decoration: underline;
  }
`;

export const MoreTextButton = styled.span`
  color: ${colors.blue1};
  cursor: pointer;
  &:hover {
    color: ${colors.blue2};
  }
`;
export const SmallGeneralText = styled.p.attrs(({ color, noMargin }) => ({
  color: color ? colors[color] : colors.black1,
  noMargin: noMargin
}))`
  margin: ${(props) => (props.noMargin ? '0' : '0 0 20px')};
  font-size: 14px;
  line-height: 1rem;
  font-weight: 400;
  color: ${(props) => props.color};

  & strong {
    color: black;
  }
`;

export const Message = styled.div.attrs(({ type }) => ({
  type: type,
  color: type === 'warning' ? colors.red1 : colors.blue1,
  bg: type === 'warning' ? colors.red0 : colors.gray3
}))`
  display: inline-block;
  margin: 20px auto;
  padding: 5px 20px;
  color: ${(props) => props.color};
  background: ${(props) => props.bg};
`;

export const Icon = styled.span.attrs(({ content, center, size, color, cursor }) => ({
  content: content,
  center: center,
  size: size ? size : 40,
  icon: icons[content],
  color: color ? colors[color] : colors.blue1,
  cursor: cursor
}))`
    display: flex;
    align-items: center;
    cursor: pointer;
    justify-content: center;
    color: ${colors.grey1};
    margin-right: 10px;
    padding: 10px;
    line-height: ${(props) => props.size}px !important;

    &::before{
      content: '${(props) => props.icon}';
      color: ${(props) => props.color};
      font-style: normal;
      font-size: ${(props) => props.size}px;
      font-family: "Leinero", serif;
      ${(props) => (props.cursor ? 'cursor:' + props.cursor + ';' : '')}
      text-align: center;
      width:  ${(props) => props.size}px;
      height:  ${(props) => props.size}px;
    }
`;

export const RectangleIcon = styled.span.attrs(({ content, center, size, color, backgroundColor, backgroundSize }) => ({
  content: content,
  center: center,
  size: size ? size : 40,
  icon: icons[content],
  color: color ? color : colors.blue1,
  backgroundColor: backgroundColor ? backgroundColor : colors.blue1,
  backgroundSize: backgroundSize ? backgroundSize : '80px'
}))`
    display: flex;
    align-items: center;
    cursor: pointer;
    justify-content: center;
    padding: 10px;
    background-color: ${(props) => props.backgroundColor};
    height: ${(props) => props.backgroundSize};
    width: ${(props) => props.backgroundSize};
    &::before{
      content: '${(props) => props.icon}';
      color: ${(props) => props.color};
      font-style: normal;
      font-size: ${(props) => props.size}px;
      font-family: "Leinero", serif;
      width: ${(props) => props.size}px;
      height: ${(props) => props.size}px;
    }
`;

export const MainComponent = styled.main`
  section .wrapper {
    grid-column: 2/4;
    display: flex;
    align-self: center;
  }

  section h3.title {
    text-transform: capitalize;
    font: bold 32px 'Open Sans', sans-serif;
    margin-bottom: 30px;
    text-align: center;
  }

  @media ${device.laptopL} {
    section {
      grid-template-columns: 1fr 1fr 1fr 1fr;
    }
  }
  @media ${device.laptop} {
    section {
      grid-template-columns: 15% 1fr 1fr 15%;
    }
  }
  @media ${device.tablet} {
    grid-template-columns: 0 1fr 1fr 0;
    grid-template-rows: auto;
    grid-column: 1;
    section {
      grid-template-columns: 10% 1fr 1fr 10%;
      padding: 1rem 0;
      align-content: flex-start;
    }
    section .wrapper {
      flex-direction: column;
      grid-column: 2 / span 2;
    }
  }
  @media ${device.mobileS} {
    section {
      grid-template-columns: 5% 1fr 1fr 5%;
      align-content: flex-start;
    }
  }
`;

const BaseHeaderButton = styled(({ disabled, position, ...rest }) => <Button {...rest} />).attrs(
  ({ disabled, position }) => ({
    disabled: disabled,
    position: position ? position : 'relative'
  })
)`
&&{
  position: ${(props) => props.position};
  font-size: 14px;
  padding: 8px 35px;
  border-radius: 5rem;
  margin-right: 0.5em;
  cursor: pointer;
  text-transform: uppercase;
  outline: none;

  min-width: unset;
  box-sizing: unset;
  font-family: unset;
  line-height: unset;
  letter-spacing: unset;

  ${(props) => (props.disabled ? 'opacity: 0.5; pointer-events: none;' : '')}
  @media ${device.tablet} {
    padding: 5px 16px;
    margin: 0;
  }
  @media ${device.mobileL} {
    width: 100%;
  }
  @media ${device.mobileS} {
    padding: 5px 8px;
  }}
`;

export const HeaderButtonPrimary = styled(BaseHeaderButton)`
  && {
    background-color: ${colors.grey0};
    color: ${colors.white1};
    border: 1px solid ${colors.white1};
  }
`;

export const HeaderButtonSecondary = styled(BaseHeaderButton)`
  && {
    background-color: ${colors.white1};
    color: ${colors.grey0};
    border: 1px solid ${colors.white1};
    &:hover {
      opacity: 0.9;
      background-color: ${colors.white1};
    }
  }
`;

const BaseButton = styled.button.attrs(({ disabled, position }) => ({
  disabled: disabled,
  position: position ? position : 'relative'
}))`
  position: ${(props) => props.position};
  font-size: 14px;
  padding: 8px 35px;
  border-radius: 5rem;
  margin-right: 0.5em;
  cursor: pointer;
  text-transform: uppercase;
  outline: none;

  ${(props) => (props.disabled ? 'opacity: 0.5; pointer-events: none;' : '')}
  @media ${device.tablet} {
    padding: 5px 16px;
    margin: 0;
  }
  @media ${device.mobileL} {
    width: 100%;
  }
  @media ${device.mobileS} {
    padding: 5px 8px;
  }
`;

export const LangButton = styled.a`
  font: inherit;
  margin-right: 0.5em;
  cursor: pointer;
  color: ${colors.grey1};
  text-transform: uppercase;
  &.active {
    color: ${colors.white1};
    text-decoration: underline;
  }
`;

export const VideoButtonStyled = styled(BaseButton)`
  color: ${colors.white1};
  background-color: rgba(255, 255, 255, 0.3);
  text-transform: initial;
  padding-left: 0.7rem;
  display: flex;
  align-items: center;
  margin: 25px 0;
  padding: 8px 35px 8px 16px;
  border: 0;
  &.transparent {
    color: ${colors.blue1};
    background: transparent;
    border: 0;
  }
  &.square {
    border-radius: 0;
    position: absolute;
    right: 5px;
    background: none;
    span {
      color: ${colors.black0};
    }
  }
  .play_circle {
    min-width: 40px;
    min-height: 40px;
    width: 40px;
    height: 40px;
    ${gradientMixin};
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: -5px;
    .play_triangle {
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 8px 0 8px 16px;
      border-color: transparent transparent transparent ${colors.white0};
      border-radius: 10%;
    }
  }
  .text {
    display: flex;
    font-size: 16px;
    flex-direction: column;
    align-items: baseline;
    padding-left: 16px;
    .question {
      color: inherit;
    }
  }
  @media ${device.tablet} {
    padding: 5px 10px;
    margin: 1rem auto;
  }
`;

export const StyledLink = styled(Link).attrs(({ color, fontSize }) => ({
  color: color ? colors[color] : colors.grey1,
  fontSize: fontSize ? fontSize + 'px' : '14px'
}))`
  color: ${(props) => props.color};
  font-size: ${(props) => props.fontSize};
  display: block;
  padding: 0 12px;
  text-transform: unset;
  cursor: pointer;
  text-decoration: none;

  &:not(:last-child) {
    border-right: 1px solid ${colors.grey1};
  }
  &:hover {
    text-decoration: underline;
  }
`;

export const StyledFooterLink = styled(StyledLink).attrs(() => ({}))`
  &:last-child {
    margin-left: 0px !important;
  }

  @media ${device.tablet} {
    &:not(:last-child) {
      border-right: unset;
    }
    &:last-child {
      margin-left: auto !important;
    }
  }
`;

export const StyledFooterSeparator = styled.div`
  display: none;
  @media ${device.tablet} {
    display: block;
  }

  color: ${colors.grey1};
  font-size: 14px;
  text-transform: unset;
  text-decoration: none;
  background-color: ${colors.grey1};
  width: 1px;
  height: auto;
  padding: 0 0 0 0;
  margin: 1rem auto;
`;

export const CloseSnackIcon = styled.i`
  &:before {
    content: '${(props) => icons.close}';
    font-family: 'Leinero', serif;
    font-style: normal;
    margin-right: 10px;
    cursor: pointer;
  }
`;

export const StyledForm = styled.form`
  width: 100%;
  background-color: ${colors.white0};
  display: grid;
  padding: 30px;
  &.valid {
    border: ${'1px solid ' + colors.green1};
  }
  .checkbox-group {
    display: flex;
  }
  .input-group {
    display: block;
  }
`;

export const StyledDrawer = styled.div.attrs(({ position, isOpen, minWidth, maxWidth }) => ({
  position: position,
  isOpen: isOpen,
  minWidth: minWidth || '370px',
  maxWidth: maxWidth || '520px'
}))`
  position: absolute;
  top: 0;
  ${(props) => props.position}: -270px;
  height: 100%;
  overflow-y: auto;
  min-width: ${(props) => props.minWidth};
  max-width: ${(props) => props.maxWidth};
  z-index: 4;
  background-color: white;
  transition: ease-in-out transform 0.2s;
  box-shadow: 0px 8px 10px -5px rgba(0, 0, 0, 0.2), 0px 16px 24px 2px rgba(0, 0, 0, 0.14),
    0px 6px 30px 5px rgba(0, 0, 0, 0.12);
  transform: translateX(${(props) => (props.isOpen ? (props.position === 'right' ? '-270px' : '270px') : '0')});
  @media ${device.tablet} {
    min-width: unset;
    max-width: unset;
    width: 100%;
  }
`;

export const StyledDrawerOverflowContent = styled.div`
  height: calc(100vh - 80px);
  overflow-y: auto;
`;

export const StyledDrawerOverflowFooter = styled.div`
  height: 80px;
  border-top: 1px solid ${colors.grey2};
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const MenuItem = styled.div`
  display: flex;
  width: 100%;

  @media ${device.tablet} {
    flex-direction: column;
  }
`;

export const MenuLink = styled.div`
  width: 30%;
  padding: 6px 0;
  border-right: 1px solid ${colors.blue1};

  text-transform: uppercase;
  text-align: right;

  pointer-events: none;

  span {
    color: ${colors.white0};
    pointer-events: auto;
    padding: 0 16px;
    cursor: pointer;
  }
  &:hover {
    span {
      color: ${colors.blue1};
    }
    & + div {
      display: flex;
    }
  }
  a {
  }
  @media ${device.tablet} {
    width: 100%;
    &:hover + div {
      opacity: 1;
    }
  }
`;

export const SubMenu = styled.div`
  position: absolute;
  right: -7px;
  top: 0;

  display: none;
  height: 100%;
  width: 70%;
  align-items: top;
  flex-flow: row wrap;
  align-content: baseline;
  justify-content: space-between;

  &:hover {
    display: flex;
  }

  @media ${device.tablet} {
    position: relative;
    top: 0;
    right: 0;

    display: none;
    width: 100%;
    padding-left: 16px;
    border-right: 1px solid ${colors.blue1};
    flex-direction: row;
    justify-content: flex-end;

    transition: opacity 1.25s;
  }
`;

export const SubMenuItem = styled.div`
  position: relative;

  display: block;
  margin: 5px 20px;
  min-width: 120px;
  max-width: 150px;
  cursor: pointer;

  a {
    padding-right: 20px;
    color: ${colors.white0};
    ${textOverflowMixin(1)};
    font-size: 14px;
    &:hover {
      color: ${colors.blue1};
    }

    &:before {
      position: absolute;
      top: 3px;
      right: 100%;

      height: 0;
      width: 0;
      content: ' ';
      border: solid transparent;
      border-width: 5px;

      border-color: transparent;
      border-left-color: ${colors.blue1};

      pointer-events: none;
      cursor: pointer;
    }
  }
  span {
    font-size: 11px;
    ${textOverflowMixin(2)};
    color: ${colors.grey1};
  }

  @media ${device.tablet} {
    width: 33%;
    max-width: none;
    margin: 0 0 10px 0;
    padding-right: 32px;
  }
  @media ${device.mobileL} {
    width: 50%;
  }
`;

export const IconLink = styled(Link).attrs(({ content }) => ({ content: content }))`
  position: relative;  
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  color: ${colors.blue1};
  padding-left: 55px;
  line-height: 80px;
  margin-left:0;
  height: 0px;
  position: relative;
  top: 40px;
  cursor: pointer;
  text-transform: uppercase;
  font-weight: 700;
  z-index: 4;
  &.support{
    height: 40px;
    top: 15px;
    @media ${device.mobileL} {
      position: absolute;
    }
    @media ${device.tablet} {
      height: 30px;
      top: 20px;
    }
  }
  &:before{
    content: '${(props) => icons[props.content]}';
    font-family: 'Leinero', serif;
    display: flex;
    align-items: center;
    justify-content: center;
    font-style: normal;
    font-size: 40px !important;
    width: 40px;
    height: 40px;
    padding: 10px;
    border-radius: 50%;
    color: ${colors.blue1};
    position: absolute;
    left: 0;
  }
  @media ${device.mobileL} {
    font-size: 1px;
    letter-spacing: -1px;
    color: transparent;
  
  }
`;

export const IconButton = styled.span.attrs(({ content, after }) => ({ content: content, after: after }))`
  position: relative;  
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  color: ${colors.white0};
  padding-${(props) => (props.after ? 'right' : 'left')}: 105px;
  line-height: 80px;
  margin-left: ${(props) => (props.after ? 'auto' : '0')};
  &:hover {
    &:${(props) => (props.after ? 'after' : 'before')} {
      background-color: ${colors.blue2};
      box-shadow: 0 0 0 10px rgba(255, 255, 255, 0.1);

    }
    color: ${colors.white1};
  }
  &:${(props) => (props.after ? 'after' : 'before')} {
    content: '${(props) => icons[props.content]}';
    font-family: 'Leinero', serif;
    display: flex;
    align-items: center;
    justify-content: center;
    font-style: normal;
    font-size: 50px !important;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    color: ${colors.white0};
    position: absolute;
    ${(props) => (props.after ? 'right' : 'left')}: 0;
    background-color: ${colors.blue1};
    box-shadow: 0 0 0 10px rgba(255, 255, 255, 0.2);
    transition: all 0.25s;
  }
  @media ${device.tablet} {
    &:${(props) => (props.after ? 'after' : 'before')} {
      width: 50px;
      height: 50px;
      font-size: 40px !important;
      box-shadow: 0 0 0 5px rgba(255, 255, 255, 0.2);
    }
  }
  @media ${device.mobileL} {
    font-size: 1px;
    letter-spacing: -1px;
    color: transparent;
  }
`;

export const UnvisibleContainer = styled.div`
  display: none;
  align-items: center;
  justify-content: center;
  &:hover {
    display: flex;
  }
  &:hover + ${GeneralText} {
    display: none;
  }
`;

export const PrimaryRoundIconButton = styled.button.attrs(({ content, label, size }) => ({
  content,
  size: size === 'big' ? '60px' : '48px',
  fontSize: size === 'big' ? '44px' : '36px',
  label: label,
  backgroundColor: size === 'big' ? colors.blue1 : colors.white0,
  color: size === 'small' ? colors.blue1 : colors.white0,
  marginLeft: size === 'big' ? '0' : '30px',
  boxShadow: size === 'small' ? '0px 0px 10px 0px rgba(0,0,0,0.25)' : '',
  hoverColor: size === 'big' ? '#1babeaaa' : '#1babea10'
}))`
  position: relative;
  height: ${(props) => props.size};
  width: ${(props) => props.size};
  display: flex;
  justify-content: center !important;
  align-items: center;
  border-radius: 50%;
  outline: none;
  margin: 10px 0px 10px ${(props) => props.marginLeft} ;
  border: 0;
  box-shadow: ${(props) => props.boxShadow};
  background-color: ${(props) => props.backgroundColor};
  cursor: pointer;
  &:before {
    color: red;
  }
  &.disabled {
    pointer-events: none;
    opacity: 0.5;
  }
  & ~ ${GeneralText} {
    margin: 0 0 0 15px;
    font-weight: 500;
    font-size: 20px;
  }
  &:hover ~ ${GeneralText} {
    display: none;
  }
  &:hover, &.active {
    background-color: ${(props) => props.hoverColor};
    &+${UnvisibleContainer} {
      display: flex;
    }
  }
  .label {
    position: absolute;
    bottom: calc(100% + 8px);
    left: 50%;
    font-size: 12px;
    white-space: nowrap;
    padding: 1px 4px;
    background: ${t.card.alternativeBackground};
    color: ${colors.white0};
    transform: translateX(-50%);
    &::before {
      content: ' ';
      border-color: red;
      height: 0;
      width: 0;
      border-left: 5px solid transparent;
      border-right: 5px solid transparent;
      border-top: 5px solid ${t.card.alternativeBackground};
      top: 100%;
      left: 50%;
      position: absolute;
      transform: translateX(-50%);
    }
  }

  
  i {
    color: ${(props) => props.color};
    font-size: ${(props) => props.fontSize};
    height: ${(props) => props.fontSize};
    line-height: ${(props) => props.fontSize};
    &::before {
      font-family: leinero;
      font-style: normal;
      content: '${(props) => icons[props.content]}';
    }
  }
`;

export const TextList = styled.ul``;

export const TextListNumber = styled.span`
  left: 0;
  position: absolute;
  background: ${colors.grey1};
  border-radius: 50%;
  color: ${colors.white0};
  font-size: 12px;
  font-weight: 600;
  height: 18px;
  width: 18px;
  line-height: 18px;
  text-align: center;
`;
export const TextListItem = styled.li.attrs(({ border }) => ({
  border: border ? `1px dashed ${colors.grey1}` : '0',
  textAlign: border ? 'center' : 'left',
  padding: border ? '15px' : '0 0 0 30px'
}))`
  position: relative;
  padding: ${(props) => props.padding};
  font-size: 14px;
  text-align: ${(props) => props.textAlign};
  border: ${(props) => props.border};
  color: ${colors.grey1};
  margin-bottom: 10px;
  img {
    width: 100px;
    height: 100px;
  }
  a {
    word-break: break-word;
  }
`;

export const WhiteBox = styled.div`
  margin: 20px 0;
  padding: 20px;
  background: ${t.card.background};
  border: 1px solid ${t.card.border};
`;

export const Container = styled.div`
  min-height: calc(100vh - 40px);
  max-height: calc(100vh - 40px);
  overflow: hidden;
  width: 100%;
  background: white;
  display: flex;
  flex-direction: column;
  -ms-overflow-y: auto;
`;

export const Header = styled.div`
  background: ${colors.blue1};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
`;

export const HeaderContent = styled.div`
  color: ${colors.white0};
`;

const BaseIcon = styled.i.attrs(({ color }) => ({
  color: color ? colors[color] : colors.white0
}))`
  border-radius: 50%;
  height: 54px;
  display: flex;
  cursor: pointer;
  min-width: 54px;
  align-items: center;
  justify-content: center;
  &:hover {
    background-color: rgba(255,255,255,0.3);
  }
  &:before {
    height: auto;
    width: auto;
    font-size: 40px;
    color: ${(props) => props.color};
    font-style: normal;
    font-family: leinero;
    content: '${icons.exit}';
  }`;
export const ScanAgainIcon = styled(BaseIcon)`
 
  &:before {
    content: '${icons.exit}';
  }
`;

export const CloseIcon = styled(BaseIcon)`
  &:before {
    content: '${icons.close}';
  }
`;

export const ContentWrapper = styled.div`
  max-height: 100%;
  min-height: 100%;
  overflow: auto;
  padding: 20px;
  display: flex;
  flex: 1;
  -ms-flex: 1 1 auto;
  flex-direction: column;
  justify-content: space-between;
`;

export const Content = styled.div.attrs(({ padding }) => ({ padding: padding ? padding : '20px 20px 20px 30px' }))`
  position: relative;
  flex-direction: column;
  padding: 15px 10px;
  border: 2px solid ${colors.blue1};
  margin: 25px 0 10px !important;
  .styles_a__3aZjV {
    height: 100%;
    width: 100%;
  }
`;

export const ActionsContainer = styled.div`
  border-top: 1px solid ${colors.blue1};
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 15px;
`;

export const PhotoSelector = styled.ul`
  display: flex;
`;

export const PhotoSelectorItem = styled.li`
  height: 25px;
  width: 25px;
  background: ${colors.blue1};
  color: white;
  text-align: center;
  line-height: 25px;
  margin: 2px;
  &.active,
  &:hover {
    background: ${colors.blue2};
  }
`;

export const BorderLabel = styled.span`
  color: ${colors.blue1};
  position: absolute;
  background: ${colors.white0};
  top: -16px;
  font-size: 16px;
  left: 27px;
  padding: 5px 10px;
`;

export const CounterLabel = styled.label.attrs(({ valid }) => ({
  valid: valid ? colors.green0 : colors.grey2
}))`
  background: ${(props) => props.valid};
  border-radius: 50%;
  height: 20px;
  min-width: 20px;
  font-size: 14px;
  line-height: 21px;
  color: ${colors.white0};
  text-align: center;
`;

export const IconButtonWithText = styled.button.attrs(({ content }) => ({ content: content ? content : 'plus' }))`
  background: transparent;
  outline: transparent;
  border: transparent;
  color: blue;
  display: flex;
  font-size: 14px
  align-items: center;
  color: ${colors.blue1};
  cursor: pointer;
  margin-top: 10px;
  i {
    background: ${colors.blue1};
    font-style: normal;
    height: 36px;
    width: 36px;
    border-radius: 50%;
    margin-right: 8px;
    font-size: 32px;
    &:before {
      font-family: leinero;
      content: '${(props) => icons[props.content]}';
      color: white;
      font-size: 32px;
      line-height: 36px;
    }
  }
  &:hover {
    color: ${colors.blue2};
    i {
      background: ${colors.blue2};
    }
  }
`;

export const Separator = styled.div`
  display: block;
  height: 1px;
  border: 0;
  border-top: 1px solid rgb(221, 221, 221);
  padding: 0;
  overflow: visible;
  width: 100%;
  position: relative;
  top: -21px;
  margin-bottom: -21px;
`;

export const Viewer = styled.div.attrs(({ isOpen }) => ({ isOpen }))`
  width: 100vw;
  height: 100vh;
  display: ${(props) => (props.isOpen ? 'flex' : 'none')};
  position: fixed;
  background: white;
  top: 0;
  left: 0;
  justify-content: center;
  align-items: center;
  div {
    width: 100%;
    height: 100%;
  }
`;

export const CloseButton = styled.i`
position: absolute;
top: 0;
right: 0;
display: flex;
align-items: center;
justify-content: center;
height: 60px;
width: 60px;
z-index: 5;
background: rgba(0,0,0,0.8);
border-radius: 0 0 0 50%;
  &:before {
    font-family: leinero;
    height: auto;
    width: auto;
    font-style: normal;
    font-size: 40px;
    color: ${colors.white0};
    font-weight: bold;
    content: '${icons.close}';
  }
`;

export const ProgressContainer = styled.div.attrs(({ color, isAlwaysVisible, disableAnimation }) => ({
  color: color,
  isAlwaysVisible: isAlwaysVisible,
  disableAnimation: disableAnimation
}))`
  position: sticky;
  top: 0;
  height: 0;
  z-index: 1;
  .MuiLinearProgress-root {
    width: 100%;
    height 4px;
    background-color:${(props) =>
      props.isAlwaysVisible ? (props.color ? colors[props.color] : colors.green1) + '1A' : 'transparent'};
    .MuiLinearProgress-barColorPrimary {
      background-color: ${(props) => (props.color ? colors[props.color] : colors.green1)};
    }
    .MuiLinearProgress-bar1Determinate{
      transition:  ${(props) => (props.disableAnimation ? 'none' : 'transform .4s linear')};
    }
  }
`;

export const RoundedAvatarImage = styled.img`
  height: 80px;
  width: 80px;
  object-fit: cover;
  background-color: rgb(27, 171, 234);
  box-shadow: rgba(255, 255, 255, 0.2) 0px 0px 0px 10px;
  border-radius: 50%;
  transition: all 0.25s ease 0s;
  @media ${device.tablet} {
    width: 50px;
    height: 50px;
    font-size: 40px !important;
    box-shadow: 0 0 0 5px rgba(255, 255, 255, 0.2);
  }
`;

export const RoundedAvatarContainer = styled.div`
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  line-height: 80px;
`;

export const RoundedAvatarTextWrapper = styled.div`
  padding-right: 20px;
  color: #fff;
  white-space: nowrap;
  @media ${device.mobileL} {
    font-size: 1px;
    letter-spacing: -1px;
    color: transparent;
  }
`;
