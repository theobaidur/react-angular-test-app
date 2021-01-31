import styled from 'styled-components';
import { KFormFieldTheme as f } from '../KForm_theming';
import colors from '../../common/colors';

export const KFormSelectWrapper = styled.div.attrs(({ width = undefined }) => ({ width: width }))`
  position: relative;
  width: 100%;
  top: 0px;
  .title {
    position: absolute;
    top: -12px;
    left: 1rem;
    color: ${f.label};
    font-size: 12px;
    background: transparent;
    z-index: 2;
    &.disabled {
      color: $info;
    }
    &.focused {
      color: ${f.labelFocused};
    }
  }
  .react-select-container {
    position: relative;
    display: block;
    border: 0;
    width: 100%;
    &.inverse .react-select__control .react-select__value-container .react-select__single-value {
      color: ${colors.white1};
    }

    .react-select__menu {
      ${(props) => (props.width ? 'width: ' + props.width + ';' : '')}
      border: 0;
      margin-top: -8px;
      z-index: 100500;
      font-size: 16px;
      border-radius: 0;
      outline: none;
      color: ${f.foreground};
      overflow: hidden;
      .react-select__option {
        padding: 0.625rem 1rem;
        cursor: pointer;
        &:hover {
          color: ${f.primaryHighlight};
        }
      }
      .react-select__option--is-selected {
        color: white !important;
        background: ${f.primaryHighlight} !important;
      }
      ::-webkit-scrollbar {
        width: 6px;
      }
      ::-webkit-scrollbar-track {
        background: $gray-300;
      }
      ::-webkit-scrollbar-thumb,
      ::-webkit-scrollbar-thumb:hover {
        background: $primary;
        cursor: pointer;
      }
    }
    .react-select__control {
      position: relative;
      cursor: pointer;
      font-size: 16px;
      height: 100%;
      background-color: ${f.background};
      min-height: 60px;
      margin-bottom: auto;
      border: 0;
      background: linear-gradient(to bottom, transparent calc(100% - 1px), ${f.underline} 1px);
      &:hover {
        background: linear-gradient(to bottom, transparent calc(100% - 1px), ${f.underlineHover} 1px);
      }
      &:focus {
        background: linear-gradient(to bottom, transparent calc(100% - 2px), ${f.underlineFocus} 2px);
      }
      .react-select__value-container > div {
        margin: 0;
      }
      &.react-select__control--menu-is-open {
        .react-select__indicators {
          .react-select__dropdown-indicator {
            color: ${f.primaryHighlight};
            transform: rotate(180deg);
          }
          .react-select__clear-indicator {
            color: ${f.primaryHighlight};
          }
        }
      }
      &.react-select__control--is-focused {
        box-shadow: none;
        border-color: ${f.primaryHighlight};
        background: linear-gradient(to bottom, transparent calc(100% - 1px), ${f.underlineFocused} 1px);

        .react-select__value-container {
          .react-select__placeholder {
            position: absolute;
            top: -12px;
            left: 1rem;
            display: block;
            color: ${f.labelFocused};
            font-size: 12px;
            background-color: ${f.primaryForeground};
          }
        }
      }
      .react-select__indicators {
        .react-select__indicator-separator {
          display: none;
          background-color: ${f.labelFocused};
        }
        .react-select__dropdown-indicator,
        .react-select__clear-indicator {
          transition: ease-in-out 0.3s;
          padding: 7px;
          color: ${f.labelFocused};
          cursor: pointer !important;
        }
      }
      .react-select__value-container {
        width: 100%;
        min-height: 2.25rem;
        overflow: visible;
        position: relative;
        padding: 0 1rem;

        .react-select__single-value {
          color: ${f.foreground};
        }
        .react-select__multi-value {
          margin-top: 0.1875rem;
          background-color: ${f.underline};
          .react-select__multi-value__label {
            color: ${f.foreground};
          }
          .react-select__multi-value__remove {
            &:hover {
              cursor: pointer;
              background: rgba(27, 171, 234, 0.07);
              svg {
                fill: ${f.foreground};
              }
            }
          }
        }
        .react-select__placeholder {
          transition: all 0.25s;
          color: $info;
          font-size: 16px;
          color: ${f.labelFocused};
          margin: 0;
        }

        .react-select__input {
          margin: 0;
          color: ${f.foreground};
        }
        input[id^='react-select-'] {
          opacity: 1 !important;
        }
      }
    }
  }
`;
