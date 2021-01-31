import styled from 'styled-components';
import {KFormFieldTheme as f} from '../KForm_theming';

export const KFormButton = styled.button.attrs(({ type })=>({
    type:type
}))`
    
    border-radius: 0;
    border: 0px;
    color: #fff;
    cursor:pointer;
    text-align:center;

    &&.disabledButton{
        opacity:0.4;
        cursor:inherit;
    }

    &.textButton{
        margin: 0.5rem 0;
        padding: 0 1rem;
        width:100%;
        max-width: 14rem;
        height: 3rem;
        line-height: 1rem;
        font-size: 0.7rem;
        text-transform: uppercase;
        background:${f.foreground};
    }

    &.textButton:hover{
        background: #7CF;
        border-color: #7CF;
        box-shadow: inset 0 -7px 0 #1792c7;
        transition: all 0.3s ease;
    }

    &&.pale{
        background:#aaa;
    }

    &.addButton,
    &.deleteButton,
    &.removeButton{
        display: block;
        font-family:leinero;
        text-align:center;
        padding:0;
        transition: all 0.3s ease;
    }

    &.addButton{
        position: relative;
        min-width: 3rem;
        width: 3rem;
        height: 3rem;
        font-size:3rem;
        margin:0 1rem 0 0;
        line-height: 3rem;
        background:rgb(113,196,239);
    }
    &.addButton:hover{
        background:${f.foreground};
    }

    &.deleteButton{
        position: relative;
        min-width: 3rem;
        width: 3rem;
        height: 3rem;
        font-size:2.5rem;
        background: none;
        border: 1px solid #aaa;
        color: #aaa;
    }
    &.deleteButton:hover{
        color: #fff;
        background: #f7928d;
        border-color: #f7928d;
        box-shadow: inset 0 0 0 #fff;
    }
`;