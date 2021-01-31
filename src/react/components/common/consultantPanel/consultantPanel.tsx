import React from 'react';
import PortalComponent from '../portal';
import {
  StyledConsultantPanel,
  UserInfo,
  Avatar,
  ContactInfo,
  FullName,
  SecondaryText,
  CloseIcon,
  LinksContainer,
  IconPlaceholder
} from './consultantPanel.styled';
//import { HashLink as StyledLink } from 'react-router-hash-link';
import { useTranslation } from 'react-i18next';
import { config } from '../../../config';
import { RoundedAvatarContainer, RoundedAvatarTextWrapper, RoundedAvatarImage, IconButton } from '../styled';
import i18next from 'i18next';

/* The following imports are for a currently restricted feature
import notificationService from '../../../services/notificationService';
import { clearSpecialist } from '../../../redux/actions';
import { useDispatch } from 'react-redux';
import consultantProvider from '../../../providers/consultantProvider';
*/

export const ConsultantPanel: React.FC<any> = ({
  isOpen,
  toggle,
  consultantState,
  consultantName,
  consultantEmail,
  consultantPhone,
  consultantPicture
}) => {
  const { t } = useTranslation(['contact']);
  /* This feature is currently restricted
  const dispatch = useDispatch();
  const removeConsultant = () => {
      consultantProvider.dropSpecialist(
        (res: any) => {
          if (res.action === 'dropSpecialist' && res.status === 'ok') {
            notificationService.showSuccessMessage(t('specialistDeleted'));
            dispatch(clearSpecialist());
            toggle();
          } else {
            notificationService.showErrorMessage(t('specialistDeleteFailed'));
          }
        },
        (err: any) => {
          notificationService.showErrorMessage(t('specialistDeleteFailed'));
          console.log(err);
        }
      );
    };
    */

  return (
    <PortalComponent headerActive={true} isOpen={isOpen} toggle={toggle}>
      <StyledConsultantPanel onClick={(evt: any) => evt.stopPropagation()}>
        {consultantState === 1 ? (
          <>
            <UserInfo>
              {consultantPicture ? (
                <Avatar src={`${config.monetoApiUrl}/${consultantPicture}`}></Avatar>
              ) : (
                <IconPlaceholder content="person" />
              )}
              <ContactInfo>
                <FullName>{consultantName}</FullName>
                <SecondaryText>{consultantEmail}</SecondaryText>
                <SecondaryText>{consultantPhone}</SecondaryText>
              </ContactInfo>
              <CloseIcon onClick={toggle} />
            </UserInfo>
            <LinksContainer>
              {/* This feature is currently restricted
              <SecondaryText>{t('consultantMenuHeader')}</SecondaryText>
              <StyledLink to="#" className="styled-link" onClick={toggle}>
                {t('contact')}
              </StyledLink>
              <StyledLink to="#" className="styled-link" onClick={toggle}>
                {t('recommend')}
              </StyledLink>
              <StyledLink to="#" className="styled-link" onClick={toggle}>
                {t('consultantInfo')}
              </StyledLink>*/}
              {/* 
              <SecondaryText>{t('authorization')}</SecondaryText>
              <StyledLink to="#" className="styled-link" onClick={toggle}>
                {t('changeConsultant')}
              </StyledLink>
              <StyledLink to="#" className="styled-link" onClick={removeConsultant}>
                {t('removeConsultant')}
              </StyledLink> 
              */}
            </LinksContainer>
          </>
        ) : (
          <>
            <UserInfo>
              <IconPlaceholder content="person" />
              <ContactInfo>
                <FullName>{t(`placeholderTitle`)}</FullName>
              </ContactInfo>
              <CloseIcon onClick={toggle} />
            </UserInfo>
            <SecondaryText style={{ paddingTop: '50px' }}>{t(`placeholderText`)}</SecondaryText>
          </>
        )}
      </StyledConsultantPanel>
    </PortalComponent>
  );
};


export const ConsultantAvatar: React.FC<
{
  specialist: { [key:string]:any }, 
  togglePanel: any, 
  t: i18next.TFunction,
  withText?: boolean
 }> = ({
  specialist,
  togglePanel,
  t,
  withText = true
}) => {
  
  return(
  <>
  { specialist.profile_pic ? (
    <RoundedAvatarContainer onClick={togglePanel}>
      { withText ? 
      <RoundedAvatarTextWrapper>
        {specialist.state !== 0 && (specialist.full_name || specialist.mail)
          ? specialist.full_name
          : t('consultantButtonContacted')}
      </RoundedAvatarTextWrapper>
      : '' }
      <RoundedAvatarImage
        src={`${config.monetoApiUrl}/${specialist.profile_pic}`}
      ></RoundedAvatarImage>
    </RoundedAvatarContainer>
  ) : (
    <IconButton content="person" onClick={togglePanel} after style={{ whiteSpace: 'nowrap' }}>
      { !withText ? '' : specialist.state !== 0 && (specialist.full_name || specialist.mail)
        ? specialist.full_name
        : t('consultantButtonContacted')}
    </IconButton>
  )}
  </>
  )
}