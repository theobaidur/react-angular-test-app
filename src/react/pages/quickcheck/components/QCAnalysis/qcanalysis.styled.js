import styled from 'styled-components';

export const QCLegend = styled.div.attrs(({color})=>({
    color:color
}))`
    padding-left:18px;
    position:relative;
    font-size:14px;
    line-height:14px;
    margin:5px 8px 5px 0;

    &:before{
        content:'';
        width:14px;
        height:14px;
        position:absolute;
        left:0;
        top:0;
        background:${props=>props.color}
    }

`;