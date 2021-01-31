import styled from 'styled-components';
import { theme as t } from '../../../assets/theming';
import icons from '../../common/icons';
import { CardHeading } from '../../common/styled';

export const KFieldArrayHolder = styled.div`
  & ${CardHeading}{
    margin: 20px 0 0;
  }
`;

export const KFieldArrayAdd = styled.div`
    width: 100%;
    height: 50px;
    border-radius: 50%;
    position: relative;
    color:${t.button.primary};
    padding-left: 60px;
    margin: 20px 0;
    display:flex;
    align-items:center;
    cursor:pointer;

    &::before{    
        content:'';
        width: 50px;
        height: 50px;
        background: ${t.button.primary}
        text-align:center;
        border-radius: 50%;
        position: absolute;
        top: 50%;
        left: 0;
        transform: translate(0%,-50%);
        font-size: 30px;

    }
    &::after{
        content: '${icons.plus}';
        font-family:leinero;
        color: ${t.button.text}
        width: auto;
        height: auto;
        position: absolute;
        top: 50%;
        left: 25px;
        transform: translate(-50%,-50%);
        font-size: 30px;
    }
`;

export const KFieldArrayRow = styled.div`
  position: relative;
  padding: 30px 15px 15px 15px;
  margin: 20px 0 40px;
  background: ${t.module.background};
  border-left: 3px solid ${t.card.blockBorder};
  & h4 {
    margin: 1rem 0 0 20px;
  }
`;

export const KFieldArrayRemove = styled.div`
    position:absolute;
    right:15px;
    top:10px;
    color: ${t.button.primary}
    
    &::before{
        content: '${icons.close}';
        font-family:leinero;
        font-size: 30px;
        cursor: pointer;
    }
`;
