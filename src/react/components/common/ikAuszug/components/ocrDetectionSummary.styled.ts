import styled from 'styled-components';

export const AlertComponentWrapper = styled.div.attrs(() => ({}))`
  .MuiAlert-message {
    font-family: 'Roboto Condensed', sans-serif;
    font-size: 16px;
  }
  .MuiTypography-root {
    font-family: 'Roboto Condensed', sans-serif;
    font-size: 18px;
  }
`;

export const ButtonBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
