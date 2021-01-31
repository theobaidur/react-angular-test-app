import styled from 'styled-components';
import colors from '../../../../components/common/colors';

export const Menu = styled.div.attrs(({ isOpen }) => ({ isOpen: isOpen }))`
  position: absolute;
  left: 0;
  bottom: 0;
  display: flex;
  background-color: ${colors.white3};
  z-index: 1;
  border-bottom: 0px solid ${colors.grey2};
  height: 60px;
  max-width: 100%;
  user-select: none;
`;
