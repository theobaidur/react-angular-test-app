import styled from 'styled-components';
import { device } from '../device';

const StyledFooter = styled.footer`
  /* Footer Section*/

  display: flex;
  align-items: start;
  justify-content: space-between;
  background-color: #303435;
  align-items: center;
  color: #fff;
  padding: 2rem;
  grid-area: footer;

  ul {
    display: flex;
  }

  ul li {
    margin-left: 16px;
  }

  p {
    text-transform: uppercase;
    font-size: 14px;
    opacity: 0.6;
    align-self: center;
  }
  nav {
    display: flex;
    width: 100%;
    margin-left: 2rem;
    & a:last-child {
      margin-left: auto;
    }
  }
  .logo {
    height: 4rem;
  }

  @media ${device.tablet} {
    flex-direction: column;
    align-items: center;
  }
  @media ${device.tablet} {
    padding-bottom: 0;
    nav {
      margin: 0;
      justify-content: space-between;
      a {
        margin: 1rem auto;
      }
    }
  }
`;

export default StyledFooter;
