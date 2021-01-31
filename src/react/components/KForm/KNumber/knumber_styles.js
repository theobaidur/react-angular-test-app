import styled from 'styled-components';
import { KFormField } from '../KForm_styles';

export const KFormNumber = styled.input`
  ${KFormField}
  -moz-appearance: textfield;
  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    display: none;
    -webkit-appearance: none;
    margin: 0;
  }
`;
