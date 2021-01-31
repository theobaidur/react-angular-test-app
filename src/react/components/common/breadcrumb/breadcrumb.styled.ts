import styled from 'styled-components';
import { theme as t } from '../../../assets/theming';
import { device } from '../device';

const StyledBreadcrumb = styled.div`
  transition: margin-left 0.25s ease-in-out;
  margin-right: auto;
  margin-left: 110px;
  color: ${t.header.soft};
  a {
    color: ${t.header.active};
    text-decoration: none;
    cursor: pointer;
  }
  & .bc {
    margin: 0 12px;
  }
  & .bc:first-of-type {
    margin-left: 0;
  }
  & .bc:last-of-type {
    margin-right: 0;
  }
  @media ${device.tablet} {
    margin-left: auto;
  }
`;

export default StyledBreadcrumb;
