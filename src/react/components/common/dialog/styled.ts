import styled, { css } from 'styled-components';

const InstructionItem = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 16px;
`;

const InstructionItemStep = styled.div`
  grid-area: txt;
  margin-right: 12px;
  span {
    border-radius: 50%;
    background-color: #b8c9d1;
    font-size: 14px;
    color: #fff;
    line-height: 18px;
    width: 18px;
    display: inline-block;
    text-align: center;
  }
  display: inline;
`;
const InstructionText = styled.span`
  grid-area: desc;
  color: #a6b4ba;
  display: inline;
  line-height: 20px;
  font-size: 14px;
  text-indent: 0;
`;

const QRIcon = styled.div`
  background: inherit;
  width: 2rem;
  height: 2rem;
  position: relative;
  display: inline-block;
  vertical-align: middle;
  margin-left: -8px;
  margin-right: 8px;
  margin-top: -4px;
  &::before {
    position: absolute;
    content: '\\E9B4';
    font-family: leinero;
    font-size: 2rem;
    top: 0;
    left: 0;
    line-height: 2rem;
    width: 2rem;
    text-align: center;
    color: inherit;
  }
`;

const EmailIcon = styled.div`
  background: inherit;
  width: 2rem;
  height: 2rem;
  position: relative;
  display: inline-block;
  vertical-align: middle;
  margin-left: -8px;
  margin-right: 8px;
  margin-top: -5px;
  &::before {
    position: absolute;
    content: '\\E9C9';
    font-family: leinero;
    font-size: 2rem;
    top: 0;
    left: 0;
    line-height: 2rem;
    width: 2rem;
    text-align: center;
    color: inherit;
  }
`;

const ManualIcon = styled.div`
  background: inherit;
  width: 2rem;
  height: 2rem;
  position: relative;
  display: inline-block;
  vertical-align: middle;
  margin-left: -12px;
  margin-right: 4px;
  margin-top: -4px;
  &::before {
    position: absolute;
    content: '\\E953';
    font-family: leinero;
    font-size: 2rem;
    top: 0;
    left: 0;
    line-height: 2rem;
    width: 2rem;
    text-align: center;
    color: inherit;
  }
`;

const QRCodeItem = styled.div`
  border: 1px dashed #5a6467;
  padding: 16px;
  text-align: center;
  padding-top: 24px;
`;

const ColumnsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-items: stretch;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 32px;
  > * {
    margin-left: 16px;
    margin-right: 16px;
  }
  > *:first-child {
    margin-left: 8px;
  }
  > *:last-child {
    margin-right: 8px;
  }
`;

const Column = styled.div`
  min-width: 200px;
  flex: 1 1;
`;

const ColumnHeader = styled.div`
  font-size: 18px;
  margin-bottom: 16px;
`;

const UrlBox = styled.div`
  border: 1px dashed #5a6467;
  padding: 8px;
  font-size: 14px;
  user-select: all;
  word-break: break-all;
`;

const EmailButton = styled.button<{ enabled: boolean }>`
  margin-top: 1rem;
  padding: 8px;
  font-size: 16px;
  border: 1px solid #b8c9d1;
  background: ${(props) => (props.enabled ? '#1BABEA' : '#FFF')};
  color: ${(props) => (props.enabled ? '#FFF' : '#b8c9d1')};
  width: 100%;
  ${(props) =>
    props.enabled &&
    css`
      &:hover {
        color: #fff;
        background: #1792c7;
        border-color: #1792c7;
        box-shadow: inset 0 -7px 0 #1792c7;
        -webkit-transition: all 0.3s ease;
        transition: all 0.3s ease;
        cursor: pointer;
      }
    `}
`;

export default {
  InstructionItem,
  InstructionItemStep,
  InstructionText,
  QRIcon,
  QRCodeItem,
  ColumnsContainer,
  Column,
  ColumnHeader,
  UrlBox,
  EmailButton,
  EmailIcon,
  ManualIcon
};
