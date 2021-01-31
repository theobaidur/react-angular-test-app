import styled, { css, keyframes } from 'styled-components';
import { KFormFieldTheme as f } from '../KForm_theming';
import {
  KFormField,
  KFormLabel,
  KFormSquareBox,
  KFormSquareWrapper,
  KDateTimePickerWrapper,
  KFormSquareItem
} from '../KForm_styles';
import colors from '../../common/colors';
import { device } from '../../common/device';
import { KFormSelectWrapper } from '../KSelect/kselect_styles';
import icons from '../../common/icons';
import { theme as t } from '../../../assets/theming';
import { KFieldArrayAdd } from '../KFieldArray/kFieldArray_styles';

export const StyledIndicator = styled.div.attrs(({ state, position }) => ({
  state: state,
  position: position
}))`
  position: absolute;
  ${(props) => props.position}: ${(props) => (props.state === 'valid' ? '-82.5px' : '-100px')};
  display: flex;
  top: ${(props) => (props.state === 'valid' ? '' : '-100px')};
  align-items: center;
  transition: top 0.25s;

  .big-circle {
    ${(props) => (props.state === 'valid' ? shadowValid : shadowInvalid)}
    transition: backround-color 0.25s;
    background-color: ${(props) => (props.state === 'valid' ? 'transparent' : t.card.indicatorBackground)};
    opacity: 0.15;
    width: ${(props) => (props.state === 'valid' ? '40' : '75')}px;
    height: ${(props) => (props.state === 'valid' ? '40' : '75')}px;
    border-radius: 50%;
    align-items: center;
    justify-content: center;
    text-align: center;
    border: 0;
    display: flex;
  }

  .small-circle {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    justify-content: center;
    transition: background-color 0.25s;
    background-color: ${(props) => (props.state === 'valid' ? colors.green0 : colors.red1)};
    width: 40px;
    height: 40px;
    border-radius: 50%;
    &:before {
      position: absolute;
      left: 50%;
      top: 50%;
      width: auto;
      height: auto;
      transform: translate(-50%, -50%);
      color: ${colors.white0};
      backround-color: ${colors.green0};
      font-size: 40px;
      line-height: 40px;
      font-family: leinero;
      content: ${(props) => (props.state === 'valid' ? "'\\e931'" : '')};
    }
  }

  .text {
    color: ${colors.white0};
    font-size: 22px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    display: ${(props) => (props.state === 'valid' ? 'none' : 'block')};
  }

  .line {
    width: ${(props) => (props.state === 'valid' ? '42px' : '25px')};
    transition: border-color 0.25s;
    height: 0;
    position: absolute;
    border: 1px dashed ${(props) => (props.state === 'valid' ? colors.green0 : colors.red1)};
    ${(props) => (props.position === 'left' ? 'right' : 'left')}: ${(props) =>
      props.state === 'valid' ? '-40px' : '-25px'};
  }

  @media ${device.laptopL} {
    top: -17px;
    left: -17px;
    right: unset;

    & .big-circle {
      width: 35px;
      height: 35px;
    }

    & .big-circle::before {
      font-size: 50px;
      line-height: 50px;
    }

    & .small-circle {
      width: 25px;
      height: 25px;
    }

    & .text {
      font-size: 16px;
    }

    & .line {
      display: none;
      width: 10px;
      right: -10px;
    }
  }
`;

export const HelpBar = styled.div.attrs(({ visible, valid }) => ({
  visible: visible,
  valid: valid
}))`
  transition: all 1s;
  width: ${(props) => (props.visible ? '35px' : '0')};
  height: 100%;
  background: ${(props) => (props.valid ? colors.blue1 : colors.blue1)};
  position: absolute;
  right: 0;
  top: 0;
  display: flex;
  cursor: pointer;
  &:hover{
    opacity:0.8;
  }
  &::before {
    content: '\\e9b9';
    color: ${colors.white0};
    font-size: 60px;
    font-family: 'Leinero', serif;
    align-self: center;
    margin: 0 auto;
    cursor: pointer;
    width: auto;
    height: auto;
    opacity: 0.8;
  }
`;

export const KFormCardStyled = styled.div.attrs(({ editable, state }) => ({
  editable: editable,
  state: state
}))`
  
  transition: box-shadow 0.5s, background 0.5s, max-height 5s;
  margin: 0 auto 30px;
  position: relative;
  padding: 20px 60px 20px 20px;
  background: ${(props) => (props.editable || props.state !== 'valid' ? 'white' : 'none')};
  &.disabled {
    pointer-events: none;
    background: transparent !important;
    box-shadow: none;
    ${StyledIndicator}, ${HelpBar} {
      display: none;
    }
    ${KFormField} {
      background: linear-gradient(to bottom, transparent calc(100% - 1px), ${colors.gray3} 1px);
      color: ${colors.gray3};
    }
    ${KFormLabel}, ${KFormSquareBox}, ${KFormSquareItem} {
      border-color: ${colors.gray3};
      color: ${colors.gray3};
    }
    ${KFormSquareWrapper} {
      &.check.checked:before {
        border-color: ${colors.gray3};
        color: ${colors.gray3};
      }
      &.radio .checked:before {
        background: ${colors.gray3};
      }
    }
    ${KFieldArrayAdd} {
      display: none;
    }
    ${KDateTimePickerWrapper} {
      .MuiFormControl-root.MuiTextField-root {
        .MuiFormLabel-root {
          color: ${colors.gray3};
        }
        .MuiInputBase-root {
          background: linear-gradient(to bottom, transparent calc(100% - 1px), ${colors.gray3} 1px);
          .MuiInputBase-input {
            color: ${colors.gray3};
          }
        }
        .MuiInputAdornment-root {
          .MuiButtonBase-root {
            padding: 4px;
            .MuiIconButton-label i:before {
              color: ${colors.gray3};
            }
          }
        }
      }
    }
    ${KFormSelectWrapper} {
      .title {
        color: ${colors.gray3};
      }
      .react-select-container {
        .react-select__control {
          background: linear-gradient(to bottom, transparent calc(100% - 1px), ${colors.gray3} 1px);
        }
        .react-select__indicators {
          .react-select__indicator-separator {
            background-color: ${colors.gray3};
          }
          .react-select__dropdown-indicator,
          .react-select__clear-indicator {
            color: ${colors.gray3};
          }
        }
        .react-select__value-container {
          .react-select__single-value {
            color: ${colors.gray3};
          }
          .react-select__multi-value {
            background-color: transparent;
            .react-select__multi-value__label {
              color: ${colors.gray3};
            }
            .react-select__multi-value__remove {
              display: none;
            }
          }
          .react-select__placeholder {
            color: ${colors.gray3};
          }
        }
      }
    }
  }
  color: ${(props) => (props.editable ? colors.white0 : colors.grey1)};
    
  box-shadow: ${(props) =>
    !props.editable || props.state === 'valid'
      ? '0 0 0 1px inset ' + colors.gray3
      : '0 0 0 1px inset ' + colors.gray3};
  .indicator {
    top: ${(props) => (!props.editable ? '50%' : 'auto')};
    transform: ${(props) => (!props.editable ? 'translateY(-50%)' : 'none')};
  }
  .next-button-right {
    margin: 16px 0 0 auto;
  }
  .next-button-center {
    margin: 16px 0;
  }
  .next-button-left {
    margin: 16px auto 0 0;
  }
`;

export const EditButton = styled.i`
  font-size: 40px;
  width: 32px;
  line-height: 40px;
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  cursor: pointer;
  &:before {
    font-family: leinero;
    content: '${icons.edit}';
    color: ${colors.blue1};
  }
  &:hover {
    color: ${f.primaryBackground};
  }
`;

export const RemoveButton = styled.div`
  position:absolute;
  top: 20px;
  right: 60px;
  text-transform: uppercase;
  font-weight: 700;
  cursor:pointer;
  color: ${colors.blue1};
`;

const shadowValidFrames = keyframes`
from { box-shadow: 0px 0px 3px 3px ${colors.green0};
}
to { box-shadow: 0px 0px 1px 35px ${colors.green0};
}
`;

const shadowInvalidFrames = keyframes`
from { box-shadow: 0px 0px 3px 3px ${colors.red2};
}
to { box-shadow: 0px 0px 1px 35px ${colors.red2};
}
`;

const shadowInvalid = css`
  animation: ${shadowInvalidFrames} 0.75s ease-in-out;
`;
const shadowValid = css`
  animation: ${shadowValidFrames} 0.75s ease-in-out;
`;
