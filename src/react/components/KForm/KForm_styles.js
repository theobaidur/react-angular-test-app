import styled, { css } from 'styled-components';
import { KFormFieldTheme as f } from './KForm_theming';
import { device } from '../common/device';
import { KFormSelectWrapper } from './KSelect/kselect_styles';
import { KFormSwitch } from './KSwitch/kswitch_styles';
import { theme as t } from '../../assets/theming';
import colors from '../../components/common/colors';
import icons from '../common/icons';

export const KFormFormat = `
    color:${f.foreground};
    font-size: 16px;
`;

export const KForm = styled.form``;

export const KFormField = `
    ${KFormFormat};
    padding:0 1rem;
    min-width: 120px;
    min-height:  60px;
    line-height: 1;
    border: 0;
    background: linear-gradient(to bottom,
      transparent calc(100% - 1px),
      ${f.underline} 1px);
    font-family: inherit;
    outline: none;
    width: 100%;
    transition: border-color 0.25s;
    &:hover {
      background: linear-gradient(to bottom,
        transparent calc(100% - 1px),
        ${f.underlineHover} 1px);
    }
    &:focus {
      background: linear-gradient(to bottom,
        transparent calc(100% - 2px),
        ${f.underlineFocus} 2px);
    }
    &:not([value=''])+label {
      color: ${f.label};
    }
    &:focus + label
 {
  color: ${f.labelFocused}

 }
    &:focus + label,
    &:not([value='']) + label {
      top: 0rem;
      font-size: 12px;
    }
    &:-webkit-autofill + label{
      top: 0rem;
      color: ${f.labelFocused}
      font-size: 12px;
    }
    &.no-float-label:focus + label,
    &.no-float-label:not([value='']) + label  {
      display: none;
    }
`;

export const KFormLabel = styled.label.attrs(({ fontSize }) => ({ fontSize: fontSize ? `${fontSize}px;` : '16px' }))`
  margin-right: 2rem;
  background: inherit;
  line-height: 0.75rem;
  color: ${f.labelFocused};
  position: ${(props) => props.labelPos};
  top: ${(props) => props.labelTop};
  left: ${(props) => props.labelLeft};
  position: absolute;
  top: 35px;
  left: 1rem;
  padding: 0;
  font-size: ${(props) => props.fontSize};
  transition: top 0.25s, color 0.25s, font-size 0.25s;
  pointer-events: none;
  border-radius: 4px;
`;

export const KFormRow = styled.div.attrs(
  ({ clearRight, clearWrap, conditionName, conditionValues, conditionReverse, conditionLabels }) => ({
    conditionName: conditionName,
    conditionValues: conditionValues,
    conditionReverse: conditionReverse,
    conditionLabels: conditionLabels,
    clearRight: clearRight,
    clearWrap: clearWrap,
    paddingRight: clearRight ? '3rem' : '0'
  })
)`
  position: relative;
  width: 100%;
  display: flex;
  flex: 0;
  flex-wrap: ${(props) => (props.clearWrap ? 'no-wrap' : 'wrap')};
  padding-right: ${(props) => props.paddingRight};
`;

export const KFormError = styled.div`
  font-size: 12px;
  line-height: 14px;
  color: ${colors.red1};
  bottom: 0;
  position: relative;
`;

export const KFormButton = styled.button`
  padding: 16px;
  border: none;
  background: ${f.primaryBackground};
  color: ${f.primaryForeground};
`;

export const KFormSquareWrapper = styled.div`
  ${KFormFormat}
  display:flex;
  flex-wrap: wrap;
  & + label {
    top: 0;
  }
  .check {
    border-radius: 50%;
    margin-top: 8px;
  }
`;

export const KFormSquareItem = styled.div`
  display: flex;
  width: auto;
  height: 32px;
  position: relative;
  padding: 6px 16px 0 40px;
  line-height: 1rem;
  align-items: center;
  margin-bottom: 0.2rem;
  user-select: none;
  color: ${f.labelFocused};
`;

export const KFormSquareBox = styled.div.attrs(({ darkMode, disabled = false }) => ({
  darkMode: darkMode,
  disabled: disabled
}))`
  position: absolute;
  top: 0;
  left: 0;
  margin: 4px 2px
  height: 28px;
  width: 28px;
  ${(props) => (props.disabled ? '' : 'cursor: pointer')};
  color: ${f.labelFocused};
  border: 1px solid ${f.labelFocused};
  text-indent: 0;
  pointer-events: none;
  &.rounded {
    border-radius: 50%;
  }

  &.checked::before {
    position: absolute;
    height: 1.4rem;
    width: 1.4rem;
    top: 4px;
    left: 6px;
    font-size: 20px;
    content: '\\2713';
    font-family: leinero;
    color: ${f.labelFocused};
  }

  ${KFormSquareWrapper}.radio &.checked::before {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    content: '';
    background: ${f.labelFocused};
    height: 18px;
    border-radius: 50%;
    width: 18px;
  }

  ${(props) =>
    props.darkMode
      ? `
  &&.checked{
    background-color:${f.labelFocused};
  }
  border-radius: 10%;
  ${KFormSquareWrapper}.check &.checked::before {
    color: ${colors.white1};
  }
  `
      : ''}
`;

export const KFormCheckHidden = styled.input`
  visibility: hidden;
`;

export const KDateTimePickerWrapper = styled.div`
  width: 100%;
  .MuiFormControl-root.MuiTextField-root {
    width: 100%;
    position: static;
    .MuiFormLabel-root {
      color: ${f.labelFocused};
      font-size: 16px;
      transform: translate(1rem, 30px);
      transition: all 0.25s;
      font-family: 'Roboto Condensed', sans-serif !important;
    }
    .MuiInputLabel-outlined.MuiInputLabel-shrink {
      transform: translate(1rem, 0);
      font-size: 12px;
      color: ${f.label};
      &.Mui-focused {
        color: ${f.labelFocused};
      }
    }
    .MuiFormHelperText-root.MuiFormHelperText-contained.Mui-error {
      display: none;
    }
    .MuiInputBase-root {
      padding-right: 8px;
      background: linear-gradient(to bottom, transparent calc(100% - 1px), ${f.underline} 1px);
      &:hover {
        background: linear-gradient(to bottom, transparent calc(100% - 1px), ${f.underlineHover} 1px);
      }
      .MuiOutlinedInput-notchedOutline {
        border: 0;
        padding-left: 4px !important;
      }
      .MuiInputBase-input {
        padding: 0 1rem;
        color: ${f.foreground};
        height: 60px;
        line-height: 40px;
        font-family: 'Roboto Condensed', sans-serif !important;
        font-size: 16px;
      }

      &.Mui-focused {
        background: linear-gradient(to bottom, transparent calc(100% - 2px), ${f.underlineFocus} 2px);

        .MuiOutlinedInput-notchedOutline {
          border-color: ${f.primaryHighlight};
          border-width: 1px;
        }
      }
      .MuiInputAdornment-root {
        .MuiButtonBase-root {
          padding: 4px;
          .MuiSvgIcon-root {
            width: 24px;
            height: 24px;
            fill: ${f.labelFocused};
          }
        }
      }
    }
  }
`;

export const PercentageSymbol = styled.span.attrs(({ left }) => ({ left: left }))`
  top: 31px;
  fontsize: 16px;
  left: ${(props) => props.left};
  position: absolute;
  color: black;
`;

export const KSliderWrapper = styled.div`
  width: 100%;
  .MuiSlider-root {
    width: 100%;
    .MuiSlider-rail {
      color: ${f.labelFocused};
      height: 3px;
    }
    .MuiSlider-track {
      color: ${f.labelFocused};
      height: 3px;
    }
    .MuiSlider-mark {
      color: ${f.labelFocused};
      height: 3px;
      width: 3px;
    }
    .MuiSlider-mark.MuiSlider-markActive {
      width: 2px;
    }
    .MuiSlider-thumb {
      color: ${f.labelFocused};
      width: 21px;
      height: 21px;
      margin-top: -9px;
      margin-left: -9px;
      &:hover {
        box-shadow: none;
      }
    }
    .MuiSlider-thumb.MuiSlider-active {
      box-shadow: none;
    }
    .MuiSlider-valueLabel {
      left: calc(-50% + 5px);
      font-family: inherit;
      font-size: 16px;
    }
  }
`;

export const CalendarIcon = styled.i`
  line-height: 26px;
  height: 28px;
  width: 28px;
  font-size: 28px;
  &:before {
    font-family: leinero;
    font-size: 40px;
    color: ${colors.blue1};
    font-style: normal;
    content: '${icons.calendar}';
  }
`;

export const ClockIcon = styled.i`
  line-height: 28px;
  height: 28px;
  font-size: 28px;
  width: 28px;
  &:before {
    font-family: leinero;
    font-size: 36px;
    color: ${colors.blue1};
    font-style: normal;
    content: '${icons.clock}';
  }
`;

const invalidForms = css`
  input,
  input:hover {
    background: linear-gradient(to bottom, transparent calc(100% - 1px), ${f.invalid} 1px);
  }
  input:focus {
    background: linear-gradient(to bottom, transparent calc(100% - 2px), ${f.invalid} 2px);
  }
  input {
    color: ${f.invalid} !important;
  }
  ${KFormLabel}, ${KFormSquareItem}, ${PercentageSymbol} {
    color: ${f.invalid} !important;
  }
  ${KFormSquareBox} {
    border-color: ${f.invalid} !important;
    &.checked::before {
      color: ${f.invalid};
    }
  }
  
  ${KDateTimePickerWrapper} .MuiFormControl-root.MuiTextField-root {
    .MuiFormLabel-root,
    .MuiFormLabel-root.MuiInputLabel-shrink {
      color: ${f.invalid} !important;
    }
    .MuiInputAdornment-root .MuiButtonBase-root .MuiSvgIcon-root {
      fill: ${f.invalid} !important;
    }

    .MuiInputBase-root {
      background: linear-gradient(to bottom, transparent calc(100% - 1px), ${f.invalid} 1px) !important;
    }
  }
  ${KFormSwitch} {
    box-shadow: inset 0 0 0 1px ${f.invalid} !important;
    &::after {
      background-color: ${f.invalid};
    }
  }
  ${CalendarIcon}:before, ${ClockIcon}:before {
    color: ${f.invalid};
  }
  ${KFormSwitch} + label {
    color: ${f.invalid};
  }
  ${KFormSelectWrapper} {
    .title {
      color: ${f.invalid};
    }
    .react-select-container {
      .react-select__control {
        background: linear-gradient(to bottom, transparent calc(100% - 1px), ${f.invalid} 1px);
      }
      .react-select__indicators {
        .react-select__indicator-separator {
          background-color: ${f.invalid};
        }
        .react-select__dropdown-indicator,
        .react-select__clear-indicator {
          color: ${f.invalid};
        }
      }
      .react-select__control--is-focused .react-select__value-container .react-select__placeholder {
        color: ${f.invalid};
      }
      .react-select__value-container {
        .react-select__single-value {
          color: ${f.invalid};
        }
        .react-select__multi-value {
          background-color: transparent;
          .react-select__multi-value__label {
            color: ${f.invalid};
          }
        }
        .react-select__placeholder {
          color: ${f.invalid};
        }
      }
    }
  }
`;

export const KFormElement = styled.div.attrs(
  ({ layout = 'compact', invalid, noLabel = false, staticLabel = false, disabled = false }) => ({
    layout: layout,
    invalid: invalid,
    noLabel: noLabel,
    staticLabel: staticLabel,
    labelPos: layout === 'compact' ? 'absolute' : 'relative',
    labelTop: layout === 'compact' ? '0' : 'auto',
    labelLeft: layout === 'compact' ? '0' : 'auto',
    labelPadding: layout === 'compact' ? '10px' : '0',
    disabled: disabled
  })
)`
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  padding-top: ${(props) => (props.noLabel ? 0 : props.staticLabel ? '16px' : props.labelPadding)};
  font-family: inherit;
  margin: ${(props) => (props.noLabel ? '0 0 20px' : '20px 0 20px')};
  &.buttonHolder,
  &.switchHolder {
    align-items: center;
    flex-direction: row;
  }

  &.buttonHolder label,
  &.switchHolder label {
    color: ${f.foreground};
    font-size: 16px;
  }
  ${(props) => (props.invalid ? invalidForms : '')}
  ${(props) => (props.disabled ? 'opacity:0.4; cursor:inherit;' : '')}
`;

export const KFormSection = styled.div.attrs(({ layout }) => ({
  layout: layout
}))`
  display: ${(props) => props.layout};
  justify-content: space-between;
  align-content: middle;
  & > * {
    flex: 1;
    margin: 8px;
  }
  & ${KFormElement} > *,
  & ${KFormElement} input {
    display: ${(props) => props.layout || 'flex'};
    flex: 1 auto;
  }
  & ${KFormElement} label {
    flex: 0 auto;
  }
`;

export const KFormCol = styled.div.attrs(({ width, widthS, force, justify, alignItems }) => ({
  force: force,
  flex: force ? '1 0' : '1 1 auto',
  width: width ? 100 * width : 100,
  widthS: widthS ? 100 * widthS : 100,
  justify: justify ? justify : 'start',
  alignItems: alignItems ? alignItems : 'baseline'
}))`
  min-width: ${(props) => props.width}%;
  flex: ${(props) => props.flex};
  padding: 0 8px;
  box-sizing: border-box;
  display: flex;
  align-items: ${(props) => props.alignItems};

  & ${KFormElement} > div {
    flex: auto;
  }

  & > * {
    justify-content: ${(props) => props.justify};
  }
  @media ${device.tablet} {
    min-width: ${(props) => props.widthS}%;
  }
`;

export const KFormQuestion = styled.label.attrs(() => ({}))`
  position: relative;
  left: 5px;
  padding: 8px 3px;
  font-size: 14px;
  font-weight: 400;
  color: ${f.labelFocused};
`;

export const KFormListAdd = styled.div.attrs(() => ({}))`
  width: 100%;
  height: 50px;
  border-radius: 50%;
  position: relative;
  color:${t.button.primary};
  padding-left: 60px;
  margin: 20px 0 20px 16px;
  display:flex;
  align-items:center;
  font-size:16px;
  cursor:pointer;
  
  &::before{    
      content:'';
      width: 50px;
      height: 50px;
      background: ${t.button.primary}
      text-align:center;
      border-radius: 50%;
      position: absolute;
      top: 50%;
      left: 0;
      transform: translate(0%,-50%);
      font-size: 30px;

  }
  &::after{
      content: '${icons.plus}';
      font-family:leinero;
      color: ${t.button.text}
      width: 50px;
      height: 50px;
      text-align:center;
      position: absolute;
      top: 0;
      left: 0;
      font-size: 30px;
      line-height: 50px;
  }
`;

export const KFormListElement = styled.div.attrs(() => ({}))`
  padding: 10px 60px 10px 10px;
  margin: 10px 0 10px 16px;
  position:relative;
  color: black;
  border: 1px solid ${colors.gray3};
  line-height:30px;
  cursor:pointer;

  &.invalid{
    color: ${colors.red1};
  }

  &.numbered{
    padding-left:30px;
  }

  & .listElementIndex{
    position:absolute;
    left:10px;
    top:0;
    line-height:50px;
    color: ${colors.gray3};
  }

  & .listElementBody{
    width:100%;
    min-height:30px;
    display:flex;
  }

  & .listElementBody div{
    display:inline-block;
    margin-right:10px;
    flex:1
  }

  & .listElementBody .value{
    align-self:right;
    text-align:right;
  }

  & .remove{
    position:absolute;
    top:0;
    right:0;
    width:50px;
    height:50px;
    margin: 0;
    background: ${colors.blue1} 
  }
  & .remove::before{
    content:'${icons.close}';
    font-family:leinero;
    line-height:50px;
    width:50px;
    height:50px;
    font-size:30px;
    text-align:center;
    position:absolute;
    top:0; right:0;
    color:white;
  }
`;

export const KFormCardAdd = styled.div.attrs(() => ({}))`
  width: 100%;
  position: relative;
  color:${t.button.primary};
  padding: 100px 20px 20px 20px;
  margin: 0 0 20px;
  font-size:16px;
  text-align:center;

  & .button{
    width:80px;
    height:80px;
    position:absolute;
    top:0;
    left:50%;
    transform:translate(-50%,0);
    cursor:pointer;
    border-radius: 50%;
    background: ${t.button.primary}
  }
  & .button::after{
      content: '${icons.plus}';
      font-family:leinero;
      color: ${t.button.text}
      width: 80px;
      height: 80px;
      text-align:center;
      position: absolute;
      top: 0;
      left: 0;
      font-size: 50px;
      line-height: 80px;
  }
  & .text{
    text-transform:uppercase;
    font-weight:700;
    cursor:pointer;
  }
`;