import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import StyledHeader, { StyledHeaderWrapper, MenuButton, Highlight, ChangeDossierButton } from './header.styled.js';
import logo from '../../../assets/images/moneto-logo.svg';
import avatar from '../../../assets/images/avatar.png';
import { HeaderButtonPrimary, HeaderButtonSecondary, LangButton, Icon } from '../styled';
import { Link } from 'react-router-dom';
import Breadcrumbs from '../breadcrumb';
import OpenedMenu from './Openedmenu.component';
import { setLogin, clearKey } from '../../../redux/actions';
import { Dossier } from '../../../redux/initialState';
import authService from '../../../services/authService';
import UserPanel from '../userPanel/';
import dossierProvider from '../../../providers/dossierProvider';

const mapStateToProps = (state: Dossier) => {
  return {
    isLoggedIn: state.authInfo.loggedIn,
    state
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    setLogin: (isLoggedIn: boolean) => dispatch(setLogin(isLoggedIn)),
    clearKey: (target: number) => dispatch(clearKey(target))
  };
};

const Header: React.FC<any> = ({ isLoggedIn, state, history, setLogin, clearKey }) => {
  const { t, i18n } = useTranslation(['header', 'routes']);
  const [langInit, setLangInit ] = useState(false);
  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
    localStorage.setItem('language', language);
    if(!langInit){ setLangInit(true); }else{ 
      window.location.reload();
    }
  };
  const [previousLoggedIn, setPrevious] = useState<boolean>(false);

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const languages = ['de', 'fr'];
  const name: string = state.myPerson.fullName() || state.myPerson.email || t(`userNameDefault`);
  const [isUserPanelOpen, setUserPanelOpen] = useState<boolean>(false);
  const [logoutUrl, setUrl] = useState<string>(t('routes:logout'));
  const togglePanel = () => {
    setUserPanelOpen((open: boolean) => !open);
    if (isOpen) setIsOpen(false);
  };

  useEffect(() => {
    if (isLoggedIn)
      setUrl(
        `${t('routes:logout')}?firstName=${state.myPerson.firstName}${
          state.myPartner.firstName ? `&secondName=${state.myPartner.firstName}` : ''
        }`
      );
    else if (!isLoggedIn && previousLoggedIn) history.push(logoutUrl);
    setPrevious(isLoggedIn);
  }, [isLoggedIn, state.myPartner.firstName, state.myPerson.firstName, history, logoutUrl, previousLoggedIn, t]);

  useEffect(() => {
    setIsOpen(false);
    setUserPanelOpen(false);
  }, [history.location]);

  useEffect(() => {
    if (!localStorage.getItem('language') || localStorage.getItem('language') === null) {
      changeLanguage(languages[0]);
    } else if (languages.indexOf(localStorage.getItem('language') || '') > -1) {
      changeLanguage(localStorage.getItem('language') as string);
    }
  }, []);

  const logout = () => {
    authService.logout(() => {
      setLogin(false);
      clearKey(0);
      clearKey(1);
      clearKey(2);
    });
  };

  const closeDossier = () => {
    dossierProvider.closeDossier(
      (res: any) => {
        authService.redirectToProMode();
      },
      (err: any) => console.log(err)
    );
  };

  return (
    <StyledHeaderWrapper className={isOpen ? 'is-open' : 'is-closed'}>
      <StyledHeader className={(isOpen ? 'is-open' : 'is-closed') + (isLoggedIn ? ' is-logged-in' : '')}>
        <MenuButton
          position="left"
          content={isOpen ? 'close' : 'menu'}
          onClick={() => {
            setIsOpen(!isOpen);
            if (isUserPanelOpen) setUserPanelOpen(false);
          }}
        />
        <Link className="logo-link" to="/">
          <img src={logo} alt="logo" />
        </Link>

        {!isLoggedIn && (
          <MenuButton
            className="mobile"
            position="right"
            content="exit"
            onClick={() => history && history.push(t('routes:login'))}
          ></MenuButton>
        )}
        <OpenedMenu
          logout={logout}
          isOpen={isOpen}
          isLoggedIn={isLoggedIn}
          history={history}
          renderLanguages={() =>
            languages.map((lang) => (
              <LangButton
                className={lang === i18n.language ? 'active' : ''}
                key={lang}
                onClick={() => changeLanguage(lang)}
              >
                {lang}
              </LangButton>
            ))
          }
        />

        <div className="main-menu">
          <div className="d-flex">
            <Breadcrumbs />
          </div>
          <nav>
            <div className="lang-bar d-flex">
              {languages.map((lang) => (
                <LangButton
                  className={lang === i18n.language ? 'active' : ''}
                  key={lang}
                  onClick={() => changeLanguage(lang)}
                >
                  {lang}
                </LangButton>
              ))}
            </div>
            {isLoggedIn ? (
              <>
                <div className="my-profile" onClick={togglePanel}>
                  <span>
                    {state.account.is_specialist === 1 ? state.account.full_name || state.account.username : name}
                  </span>
                  <img src={avatar} alt="avatar" />
                  <Highlight display={isUserPanelOpen ? 'block' : 'none'} />
                </div>
                <UserPanel
                  isOpen={isUserPanelOpen}
                  toggle={togglePanel}
                  logout={logout}
                  fullName={state.account.is_specialist === 1 ? state.account.full_name : name}
                  email={state.account.mail}
                  isMyOffice={state.account.is_specialist === 1}
                  ownDossier={state.account.own_dossier}
                />
              </>
            ) : (
              <React.Fragment>
                <Link to={t('routes:login')} className="desktop">
                  <HeaderButtonPrimary>{t('loginBtn')}</HeaderButtonPrimary>
                </Link>
                <Link to={t('routes:register')} className="desktop">
                  <HeaderButtonSecondary>{t('registerBtn')}</HeaderButtonSecondary>
                </Link>
              </React.Fragment>
            )}
          </nav>
        </div>
        {isLoggedIn && state.account && state.account.is_specialist === 1 && (
          <>
            <ChangeDossierButton
              onClick={() => {
                if (window.confirm(t('closeDossierQuestion'))) {
                  closeDossier();
                }
              }}
            >
              {name}
              <Icon content="folder" />
            </ChangeDossierButton>
          </>
        )}
      </StyledHeader>
    </StyledHeaderWrapper>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
