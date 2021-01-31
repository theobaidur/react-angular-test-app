import styled from 'styled-components';
import colors from '../../../components/common/colors';

export const SupportTitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
`;

export const Divider = styled.hr`
  width: 100%;
  border-top: 1px solid ${colors.gray3};
`;
