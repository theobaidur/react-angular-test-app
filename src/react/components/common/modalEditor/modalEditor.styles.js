import styled from 'styled-components';
import colors from '../colors';

export const ModalWindow = styled.div`
  position: relative;
  max-width: 550px;
  min-width: 320px;
  height: auto;
  background: ${colors.white0};
  display: flex;
  padding-right: 35px;
  flex-direction: column;
`;

export const ModalHeaderWindow = styled.div`
  width: 100%;
  padding: 15px 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const ModalContentWindow = styled.div`
  padding: 15px 30px;
`;

export const ModalFooterWindow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-around;
  padding: 15px 30px;
  button {
    margin: 10px;
  }
`;
