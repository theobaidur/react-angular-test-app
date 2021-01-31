import styled from 'styled-components';
import { KFormField } from '../KForm_styles';

export const KFormAutosuggestText = styled.input.attrs(({ textColor }) => ({
  textColor: textColor
}))`
  ${KFormField}
  ${(props) => (props.textColor ? 'color:' + props.textColor + ';' : '')}
`;
