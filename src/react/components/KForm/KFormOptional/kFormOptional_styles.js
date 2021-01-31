import styled from 'styled-components';
import { theme as t } from '../../../assets/theming';
import icons from '../../common/icons';

export const KFormOptionalHeader = styled.div`
  color: ${t.button.primary};
  cursor: pointer;
  position: relative;
  width:100%;
  height: 20px;
  margin-top: 30px;

  & span{ 
      background-color: white;
      position: absolute;
      left:0; 
      top:0;
      font-size:16px;
      padding: 0 5px 0 30px;
      z-index:1;
  }

  &::after{
      content:'';
      width:100%;
      height:1px;
      background-color: ${t.button.primary};
      position:absolute;
      top:10px;
      left:0px;
  }
  &::before{
    content:'${icons.downBig}';
    font-family: leinero;
    width:20px;
    height:20px;
    font-size:30px;
    line-height:20px;
    position:absolute;
    left:0;
    top:0;
    color: ${t.button.primary};
    transition: all 0.25s;
    transform: rotate(0deg);
    z-index:2;
  }
  &&.open::before{
    transition: all 0.25s;
    transform: rotate(180deg);
  }
`;
export const KFormOptionalBody = styled.div``;