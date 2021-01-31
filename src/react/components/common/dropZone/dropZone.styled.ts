import styled from 'styled-components';
import icons from '../icons';
import { device } from '../device';

const DropZoneStyled = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  height: 120px;
  width: 500px;
  padding: 30px;
  border: 2px dashed black;
  margin: auto;
  outline: none;
  i.upload::before {
    font-size: 64px;
    font-family: leinero;
    content: '${icons.upload}';
    font-style: normal;
    font-weight: 700;
  }
  p {
    margin-left: 30px;
  }
  &:hover {
    cursor: pointer;
  }
  @media ${device.tablet} {
    width: 100%;
  }
`;
export default DropZoneStyled;
