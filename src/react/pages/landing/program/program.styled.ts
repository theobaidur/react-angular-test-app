import styled from 'styled-components';
import colors from '../../../components/common/colors';
import { gradientMixin, Icon, PrimaryButton } from '../../../components/common/styled';
import { device } from '../../../components/common/device';

const StyledProgram = styled.div`
  padding: 20px 40px 120px;
  margin: 10px 0;
  background-color: ${colors.white3};
  border-radius: 5px;
  border: 1px solid ${colors.grey2};
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: relative;
  min-height: 280px;
  min-width: 320px;
  box-shadow: 0 0 30px rgba(0,0,0,0.05);

  & ${Icon} {
    position: absolute;
    top: 0;
    right: 0;
  }

  & ${PrimaryButton} {
    position: absolute;
    bottom: 20px;
    left: 40px;
  }

  &.highlighted {
    background-color: ${colors.white0};
    button {
      ${gradientMixin};
      
    }
  }
  title {
    color: ${colors.blue1};
    display: block;
  }
  .content {
    color: ${colors.black1};
    text-align: left;
    padding: 0;
  }

  @media ${device.tablet} {
    padding-bottom: 20px;
    min-height: unset;

    & ${Icon} {
      position: absolute;
      top: 20px;
      right: 20px;
    }

    & ${PrimaryButton} {
      position: relative;
      margin: 20px auto;
      bottom: unset;
      left: unset;
    }
  }
  @media ${device.mobileS} {
    padding: 10px 30px;
  }
`;

export default StyledProgram;
