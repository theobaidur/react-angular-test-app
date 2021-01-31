import styled from 'styled-components';

export const StyledBackground = styled.div.attrs((props: any) => ({
  alignItems: props.alignItems ? props.alignItems : 'baseline',
  decreaseZIndex: props.decreaseZIndex,
  display: props.display,
  zIndex: props.decreaseZIndex ? 4 : 5,
  justifyContent: props.justifyContent ? props.justifyContent : 'baseline',
  headerActive: props.headerActive ? true : false
}))`
  position: fixed;
  height: ${(props) => (props.headerActive ? 'calc(100vh - 60px)' : '100vh')};
  width: 100vw;
  align-items: ${(props) => props.alignItems};
  justify-content: ${(props) => props.justifyContent};
  top: ${(props) => (props.headerActive ? '60px' : '0')};
  bottom: 0;
  left: 0;
  visibility: hidden;
  opacity: 0;
  transition: ease-in-out all 0.2s;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: ${(props) => props.zIndex};
  display: ${(props) => props.display};
  overflow-y: auto;
  .splitter-layout {
    position: absolute;
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .splitter-layout .layout-pane {
    position: relative;
    flex: 0 0 auto;
    overflow: auto;
  }

  .splitter-layout .layout-pane.layout-pane-primary {
    flex: 1 1 auto;
  }

  .splitter-layout > .layout-splitter {
    flex: 0 0 auto;
    width: 4px;
    height: 100%;
    cursor: col-resize;
    background-color: #ccc;
  }

  .splitter-layout .layout-splitter:hover {
    background-color: #bbb;
  }

  .splitter-layout.layout-changing {
    cursor: col-resize;
  }

  .splitter-layout.layout-changing > .layout-splitter {
    background-color: #aaa;
  }

  .splitter-layout.splitter-layout-vertical {
    flex-direction: column;
  }

  .splitter-layout.splitter-layout-vertical.layout-changing {
    cursor: row-resize;
  }

  .splitter-layout.splitter-layout-vertical > .layout-splitter {
    width: 100%;
    height: 4px;
    cursor: row-resize;
  }

  &.isOpen {
    visibility: visible;
    opacity: 1;
    .splitter-layout > .layout-splitter {
      height: calc(100% - 40px);
      cursor: e-resize;
      position: relative;
      &:before {
        position: absolute;
        top: 50%;
        left: -8px;
        content: '';
        width: 0px;
        height: 0px;
        border-style: solid;
        border-width: 5px 6px 5px 0px;
        border-color: transparent rgb(255, 255, 255) transparent transparent;
      }
      &:after {
        position: absolute;
        top: 50%;
        right: -8px;
        content: '';
        width: 0px;
        height: 0px;
        border-style: solid;
        border-width: 5px 0px 5px 6px;
        border-color: transparent transparent transparent rgb(255, 255, 255);
      }
    }
  }
`;
export default StyledBackground;
