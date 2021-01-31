import styled from 'styled-components';
import icons from '../icons';
import colors from '../colors';
import { PrimaryButton } from '../styled';

export const StyledUserPanel = styled.div`
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

export const Icon = styled.i`
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
