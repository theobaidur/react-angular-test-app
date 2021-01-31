import styled from 'styled-components';
import icons from '../icons';
import colors from '../colors';
import { PrimaryButton } from '../styled';

export const StyledConsultantPanel = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  max-width: 400px;
  width: 100%;
  min-height: 100%;
  max-height: 100%;
  overflow-y: auto;
  height: 100%
  background: white;
  padding: 20px;
  display: flex;
  flex-direction: column;
  ${PrimaryButton} {
    margin: 20px 0;
    width: 100%;
  }
`;

export const UserInfo = styled.div`
  display: flex;
  align-items: center;
  // justify-content: space-between;
`;

export const Avatar = styled.img`
  height: 80px;
  width: 80px;
  object-fit: cover;
  margin-right: 10px;
`;

export const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

export const FullName = styled.span``;
export const SecondaryText = styled.span`
  color: #9da0a3;
`;

export const CloseIcon = styled.i`
cursor: pointer;
  position: absolute;
  right: 10px;
  top: 10px;
  border-radius: 50%;
  display: flex;
  min-width: 40px;
  align-items: center;
  justify-content: center;
  &:before {
    font-family: leinero;
    content: '${icons.close}';
    color: ${colors.blue1};
    width: auto;
    height: auto;
    font-size: 40px;
  }
`;

export const LinksContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 25px;
  ${SecondaryText}, .styled-link {
    margin-bottom: 15px;
    border: 0;
  }
  ${SecondaryText} {
    margin-top: 15px;
    text-transform: capitalize;
  }
  .styled-link {
    margin-left: 10px;
    cursor: pointer;
    font-size: 16px;
    margin-left: 30px;
    color: ${colors.blue1};
    font-weight: bold;
    text-transform: uppercase;
  }
`;

export const IconPlaceholder = styled.span.attrs(({ content }) => ({ content: content }))`
  position: relative;  
  display: inline-flex;
  align-items: center;
  color: ${colors.white0};
  padding-left: 95px;
  margin-left: 0;
  height:80px;
  &:before {
    content: '${(props) => icons[props.content]}';
    font-family: 'Leinero', serif;
    display: flex;
    align-items: center;
    justify-content: center;
    font-style: normal;
    font-size: 50px !important;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    color: ${colors.white0};
    position: absolute;
    left: 0;
    background-color: ${colors.blue1};
    box-shadow: 0 0 0 10px rgba(255, 255, 255, 0.2);
    transition: all 0.25s;
  }
`;
