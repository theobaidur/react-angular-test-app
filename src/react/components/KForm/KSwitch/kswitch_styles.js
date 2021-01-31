import styled from 'styled-components';
import { KFormFieldTheme as f } from '../KForm_theming';

export const KFormSwitch = styled.div`
  width: 64px;
  max-width: 64px;
  height: 32px;
  border-radius: 16px;
  background: none;
  box-shadow: inset 0 0 0 1px ${f.labelFocused};
  transition: 200ms;
  position: relative;
  margin-right: 8px;
  cursor: pointer;

  .switchHolder {
    display: block;
    flex-direction: row;
    flex: unset;
    label {
      font-size: 14px;
    }
  }

  &::after {
    content: '';
    display: block;
    position: absolute;
    width: calc(32px * 10 / 16);
    height: calc(32px * 10 / 16);
    left: calc(32px * 3 / 16);
    top: 50%;
    transform: translate(0, -50%);
    border-radius: 50%;
    background: ${f.labelFocused};
    transition: 200ms;
  }

  &.checked {
    background: ${f.labelFocused};
  }
  &.checked::after {
    background: white;
    transform: translate(32px, -50%);
  }
`;

export const KFormSwitchHidden = styled.input`
  position: absolute;
  visibility: hidden;
`;
