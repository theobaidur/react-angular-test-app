import styled from 'styled-components';
import { GeneralText, Icon } from '../styled';
import { theme as t } from '../../../assets/theming';

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  ${Icon} {
    margin: 0;
    &:before {
      font-weight: 700;
    }
  }
`;

export const DrawerGeneralText = styled(GeneralText)`
  padding: 10px 0 10px 20px;
  color: ${t.help.text}
  & strong{ 
    font-weight: 700;
    color: ${t.help.textStrong}
  }
`;
