import styled from 'styled-components';
import { device } from '../device';
import colors from '../colors';
import { theme as t } from '../../../assets/theming';
import icons from '../icons';

export const StyledHeaderWrapper = styled.div`
  background-color: ${t.header.background};

  position: relative;
  overflow: hidden;
  &.is-open {
    min-height:250px;
    transition: ease 0.35s;
  }

  &.is-closed {
    min-height: 60px;
    max-height: 60px;
    transition: ease 0.25s;
  }
  @media ${device.tablet} {  
    &.is-open {
      min-height: 400px;
    }
  }
`;

export const Highlight = styled.div.attrs(({ display }) => ({ display: display }))`
  display: ${(props) => props.display};
  width: 100%;
  background: ${colors.blue1};
  position: absolute;
  bottom: 0;
  height: 5px;
  transform: translateX(-20px);

  @media ${device.tablet} {
    transform: translateX(-10px);
  }
`;

export const StyledHeader = styled.header`
  width: 100%;
  min-height:250px;
  height: 100%;
  padding: 15px;
  display: flex;
  background-color: ${t.header.background};
  color: white;  
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  grid-area: header;
  z-index: 2;
  transition: 0.25s;

  &.is-logged-in {
    padding: 12px 15px;
  }

  &.is-closed {
    transform: translateY(calc(-100% + 60px));
  }

  &.is-open {
    transform: translateY(0);

    #btn-menu {
      bottom: calc(100% - 52px);
    }

    .logo-link {
      bottom: calc(100% - 48px);
    }
  }
  .logo-link {
    position: absolute;
    left: 65px;
    bottom: 12px;
    width: 36px;
    height: 36px;
    z-index: 3;
    transition: bottom 0.25s;
    cursor: pointer;
    img {
      width: 100%;
    }
    @media ${device.tablet} {
      left: 50%;
      transform: translateX(-50%);
    }
  }

  .main-menu,
  .full-menu {
    display: flex;
    align-items: baseline;
    width: 100%;
  }
  .main-menu{
    position: absolute;
    left: 0;
    bottom: 0;
    height: 60px;
    padding: 10px;
  }
  .full-menu {
    position: absolute;
    left: 0;
    bottom: 50px;
    min-height: 200px;
    margin-bottom: 0;
    margin-top: 0;
    align-items: baseline;

    .main-links,
    .help-links {
      position: relative;
    }

    .help-links {
      text-align: right;
      margin: 16px 0;
      a {
        color: ${t.header.soft};
        display: inline-block;
        font-size: 14px;        
        margin: 6px 0;
        cursor: pointer;

        &.highlight:hover,
        &:hover {
          color: ${t.header.active};
        }
        &.highlight {
          text-transform: uppercase;
          color: ${t.header.foreground};
          margin-bottom:12px;
        }
      }
    }

    .search {
      text-align: right;
      position: relative;
      margin: 12px 0;
      input {
        width: 250px;
        background: transparent;
        border: 0;
        outline: none;
        box-shadow: none;
        font-size: 16px;
        padding: 8px 16px 8px 4px ;
        color: ${colors.grey2};
        background: linear-gradient(to bottom, transparent calc(100% - 1px), ${colors.grey2} 1px);
        &:focus {
          background: linear-gradient(to bottom, transparent calc(100% - 1px), ${colors.blue1} 1px);
          transition: background 0.25s;
        }
      }
      i {
        position: absolute;
        top: 8px;
        right: 0;
        margin-left: 10px;
        cursor: pointer;
        transition: all 0.25s;
        &:before {
          font-family: leinero;
          content: '${icons.search}';
        }
        &:focus,
        &:hover {
          color: ${colors.blue1};
        }
        &:click {
          opacity: 0.5;
        }
      }
    }
  }

  nav {
    display: flex;
    margin-left: auto;
    .lang-bar {
      display: flex;
      align-items: center;
    }
    .my-profile {
      display: flex;
      align-items: center;
      cursor: pointer;
      img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        object-fit: cover;
        margin-left: 8px;
      }
      &:hover {
        span {
          color: ${colors.blue1};
        }
        ${Highlight} {
          display: block;
        }
      }
    }
  }

  @media ${device.tablet} {
    min-height:400px;
    flex-direction: column;
    nav {
      width: 100%;
      transition: all 0.25s;
      opacity: 0;
      justify-content: space-around;

      .my-profile {
        transition: all 0.25s;
      }
    }
    &.is-open .main-menu nav {
      opacity: 1;
    }
    &.is-logged-in {
      &.isOpen .main-menu nav .my-profile span {
        display: block;
      }

      .main-menu nav {
        .my-profile {
          margin-left: auto;
          span {
            display: none;
          }
        }

        justify-content: end;
        opacity: 1;
      }
    }
  }
`;

export const MenuButton = styled.span.attrs(({ position, content }) => ({
  position: position,
  content: icons[content]
}))`
  position: absolute;

  ${(props) => props.position}: 8px;
  bottom: 8px;
  padding: 8px ${(props) => (props.isOpen ? '14px' : '11px')};
  height: 44px;
  width: 44px;
  border-radius: 50%;
  z-index: 3;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.25s, transform 0.25s, bottom 0.25s;
  
  &:hover,
  &:focus {
    background-color: rgba(255, 255, 255, 0.2);
    
  }

  &:before {
    font-family: 'Leinero', serif;
    font-size: 24px;
    font-weight: 1000;
    content: '${(props) => props.content}';
    width: auto;
    height: auto;
  }
`;

export const ChangeDossierButton = styled.div`
  position: absolute;
  bottom: 0;
  left: 50%;
  cursor: pointer;
  transform: translateX(-50%);
  height: 60px;
  display: flex;
  align-items: center;
  user-select: none;
  @media ${device.tablet} {
    transform: translateX(30%);
  }
`;

export default StyledHeader;
