import styled, { css } from 'styled-components';
import { Icon, PrimaryButton } from '../../../../components/common/styled';
import colors from '../../../../components/common/colors';
import icons from '../../../../components/common/icons';
import { device } from '../../../../components/common/device';

export const NewsContainer = styled.div`
  padding: 20px;
`;

export const NewsHeader = styled.div`
  display: flex;
  align-items: center;
`;

export const IconAction = styled(Icon)`
  border-radius: 50%;
  width: 40px;
  height: 40px;
  line-height: 40px;
  cursor: pointer;
  text-align: center;
  &:hover {
    background: ${colors.grey2};
  }
`;

export const NewsWrapper = styled.div`
  padding: 20px 20px 0;
  @media ${device.tablet} {
    padding: 0;
  }
`;

export const NewsWrapperHeader = styled.span.attrs(({ isOpen }) => ({
  isOpen: isOpen ? true : false
}))`
  position: relative;
  display: flex;
  align-items: center;
  padding-left: 30px;
  line-height: 56px;
  cursor: pointer;
  user-select: none;
  &:before {
    font-family: leinero;
    content: '${icons.down}';
    font-size: 56px;
    user-select: none;
    position: absolute;
    left: 0;
    color: ${colors.blue1};
    width: auto;
    height: auto;
    top: 0;
    transition: all 0.25s;
    transform: ${(props) => (props.isOpen === true ? 'rotate(180deg)' : 'rotate(0)')};
  }
`;

export const CardNewsWrapper = styled.div`
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: inherit;
`;

export const StyledNewCardHeader = styled.div`
  width: 100%;
  height: 150px;
  position: relative;

  img {
    max-height: 150px;
    width: 100%;
    object-fit: cover;
    position: absolute;
    left: 0;
    top: 0;
  }
`;

export const StyledDate = styled.div`
  position: absolute;
  top: 15px;
  right: 20px;
  width: 60px;
  height: 60px;
  display: flex;
  flex-direction: column;
  border-radius: 50%;
  align-items: center;
  justify-content: center;
  .number,
  .month {
    color: ${colors.white0};
  }
  .number {
    font-size: 16px;
    font-weight: 700;
  }
  .month {
    font-size: 14px;
  }
`;

export const StyledLabel = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  padding: 8px 20px;
  width: 100px;
  color: ${colors.white0};
  bottom: 0;
  left: 0;
  text-transform: uppercase;
`;

export const StyledCardContent = styled.div`
  padding: 20px;
`;

export const StyledCardTitle = styled.h4`
  font-size: 20px;
  font-weight: 600;
`;
export const StyledCardSubTitle = styled.h6`
  font-size: 14px;
`;
export const StyledCardText = styled.p`
  font-size: 14px;
  margin-top: 14px;
`;
export const StyledCardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 20px 20px;
  margin-top: auto;
`;

export const StyledNewCard = styled.div.attrs(({ color }) => ({
  color: color ? colors[color] : colors.blue1
}))`
  width: calc(33% - 30px);
  min-width: 290px;
  min-height: 200px;
  box-shadow: 1px 4px 9px 5px rgba(0, 0, 0, 0.3);
  margin: 15px;
  display: flex;
  flex-direction: column;
  ${StyledCardTitle}, ${StyledCardSubTitle}{
    color: ${(props) => props.color};
  }

  ${StyledLabel}, ${StyledDate}, ${PrimaryButton} {
    background: ${(props) => props.color};
  }
  @media ${device.tablet} {
      min-width: 280px;
      width: 100%;
      margin: 10px 0;
  }
`;

export const StyledReadedCardLabel = styled.div.attrs(({ color }) => ({
  color: color ? colors[color] : colors.blue1
}))`
  font-size: 14px;
  width: 120px;
  background-color: ${(props) => props.color};
  display: flex;
  color: ${colors.white0};
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
`;

export const StyledReadedCard = styled.div.attrs(({ color }) => ({
  color: color ? colors[color] : colors.blue1
}))`
  width: 100%;
  background-color: ${colors.white0};
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  position: relative;
  padding: 0 10px 0 120px;
  @media ${device.laptop} {
    padding: 25px 0 0;
    ${StyledReadedCardLabel} {
      right: 0;
      width: 100%;
      bottom: auto;
      padding: 6px 0;
    }
  }
`;

const visibleText = css`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const hiddenText = css`
  display: -webkit-box;
  -webkit-line-clamp: 1;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const StyledReadedDate = styled.span`
  width: 100px;
  font-size: 14px;
  padding: 0 10px;
  color: ${colors.grey1};
  text-align: center;
  ${visibleText};
`;
export const StyledReadedTitle = styled.span.attrs(({ isOpen }) => ({ isOpen: isOpen }))`
  width: 240px;
  font-size: 14px;
  padding: 0 10px;
  font-weight: 700;
  text-align: center;
  visibility: visible;
  ${visibleText};
  ${(props) => (props.isOpen === true ? visibleText : hiddenText)}
`;
export const StyledReadedText = styled.p.attrs(({ isOpen }) => ({ isOpen: isOpen }))`
  width: calc(100% - 360px);
  font-size: 14px;
  padding: 0 10px;
  color: ${colors.grey1};
  text-align: center;
  transition: all 0.25s;
  visibility: visible;
  ${(props) => (props.isOpen === true ? visibleText : hiddenText)}
`;

export const StyledReadedCardContent = styled.div`
  transition: all 0.25s;
  padding: 10px 0;
  width: 100%;
  height: 100%;
  border: 1px solid ${colors.gray3};
  border-left: 0;
  display: flex;
  cursor: pointer;
  align-items: center;
  @media ${device.laptop} {
    flex-direction: column;
    border-left: 1px solid ${colors.gray3};
    border-top: 0;
    padding: 20px;
    ${StyledReadedText}, ${StyledReadedTitle}, ${StyledReadedDate} {
        width: 100%;
        padding: 0 20px;
    }
  }
`;

export const StyledReadedCollapseIcon = styled.i.attrs(({ isOpen }) => ({ isOpen: isOpen }))`
  position: absolute;
  right: 20px;
  transform: rotate(${(props) => (props.isOpen ? '180deg' : '0')});
  transition: all 0.25s;
  &:before {
    font-family: leinero;
    font-size: 32px;
    color: ${colors.grey1};
    content: '${icons.down}';
  }
`;
