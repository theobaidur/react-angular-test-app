import React from 'react';
import PortalComponent from '../portal';
import {
  StyledUserPanel,
  UserInfo,
  Avatar,
  ContactInfo,
  FullName,
  SecondaryText,
  Icon,
  LinksContainer
} from './userPanel.styled';
import avatar from '../../../assets/images/avatar.png';
import { PrimaryButton } from '../styled';
import { HashLink as StyledLink } from 'react-router-hash-link';
import { useTranslation } from 'react-i18next';
import { useStore } from 'react-redux';
import { Link } from 'react-router-dom';

export const UserPanel: React.FC<any> = ({ isOpen, toggle, fullName, email, logout, isMyOffice, ownDossier }) => {
  const { t } = useTranslation(['header', 'routes']);
  const state = useStore().getState();

  const main = true;
  return (
    <PortalComponent headerActive={true} isOpen={isOpen} toggle={toggle}>
      <StyledUserPanel onClick={(evt: any) => evt.stopPropagation()}>
        <div>
          <UserInfo>
            <Avatar src={avatar} />
            <ContactInfo>
              <FullName>{fullName}</FullName>
              <SecondaryText>{email}</SecondaryText>
            </ContactInfo>
            <Icon onClick={toggle} />
          </UserInfo>
          {isMyOffice ? (
            <LinksContainer>
              <PrimaryButton
                outlined={main}
                onClick={() => {
                  logout();
                  toggle();
                }}
              >
                {t('userPanel.logOut')}
              </PrimaryButton>
              {ownDossier ? (
                <>
                  <SecondaryText>{t('userPanel.profileLinks')}</SecondaryText>
                  <StyledLink to={t('routes:profile')} className="styled-link" onClick={toggle}>
                    {t('userPanel.profileEdit')}
                  </StyledLink>
                </>
              ) : (
                <>
                  <SecondaryText>{`${state.myPerson.fullName() || ''},
              ${state.myPerson.birthDate || ''},
              ${(state.myPerson.gender && t('userPanel.genderItems.' + state.myPerson.gender[0])) ||
                ''}`}</SecondaryText>
                  <SecondaryText style = {{textTransform:"unset"}}>{`${state.specialist ? state.specialist.mail:""}`}</SecondaryText>
                  <SecondaryText>{`${state.specialist ? state.specialist.phone:""}`}</SecondaryText>
                  <SecondaryText>{`${t(`userPanel.partnerText`)}: ${
                    state.myPerson.hasPartner && state.myPerson.hasPartner[0] === 1
                      ? t('userPanel.answers.0')
                      : t('userPanel.answers.1')
                  }`}</SecondaryText>
                  
                  <SecondaryText>
                    {state.myPerson.hasPartner && state.myPerson.hasPartner[0] === 1
                      ? `${state.myPartner.fullName() || ''},
              ${state.myPartner.birthDate || ''},
              ${(state.myPartner.gender && t('userPanel.genderItems.' + state.myPartner.gender[0])) || ''}`
                      : ''}
                  </SecondaryText>
                </>
              )}
            </LinksContainer>
          ) : (
            <LinksContainer>
              <Link to={'/'}>
                <PrimaryButton
                  outlined={main}
                  onClick={() => {
                    logout();
                    toggle();
                  }}
                >
                  {t('userPanel.logOut')}
                </PrimaryButton>
              </Link>
              <SecondaryText>{t('userPanel.accountLinks')}</SecondaryText>
              <StyledLink to={t('routes:account') + '#changePassword'} className="styled-link" onClick={toggle}>
                {t('userPanel.changePassword')}
              </StyledLink>
              <StyledLink to={t('routes:account') + '#changeEmail'} className="styled-link" onClick={toggle}>
                {t('userPanel.changeEmail')}
              </StyledLink>
              <StyledLink to={t('routes:account') + '#changeLogin'} className="styled-link" onClick={toggle}>
                {t('userPanel.changeLogin')}
              </StyledLink>
              <SecondaryText>{t('userPanel.profileLinks')}</SecondaryText>
              <StyledLink to={t('routes:profile')} className="styled-link" onClick={toggle}>
                {t('userPanel.profileEdit')}
              </StyledLink>
            </LinksContainer>
          )}
        </div>
      </StyledUserPanel>
    </PortalComponent>
  );
};
