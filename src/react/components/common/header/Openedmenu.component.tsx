import React from 'react';
import { useTranslation } from 'react-i18next';
import { MenuLink, Col, Row, SubMenu, SubMenuItem, MenuItem } from '../styled';
import { Link } from 'react-router-dom';
import { Route, SubRoute, helpRoutes, unAuthorizedRoutes, authorizedRoutes } from '../../../constants/routes';

interface OpenedMenu {
  isOpen: boolean;
  isLoggedIn: boolean;
  history: any;
  logout: () => void;
  renderLanguages: any;
}

const FullMenuLink: React.FC<Route & { history: any; t: any }> = (
  route: Route & { history: any; t: any },
  index: number
) => {
  return (
    <MenuItem key={index}>
      <MenuLink>
        <span
          onClick={() =>
            !route.subRoutes || route.subRoutes.length === 0
              ? route.history.push(route.t(`routes:${route.keyName}`))
              : undefined
          }
        >
          {route.t(`mainLinks.${route.keyName}`)}
        </span>
      </MenuLink>

      {route.subRoutes && route.subRoutes.length > 0 && (
        <SubMenu>
          {route.subRoutes.map((subRoute: SubRoute, index: number) => (
            <SubMenuItem key={index}>
              <Link to={route.t(`routes:${subRoute.keyName}`)}>{route.t(`subLinks.${subRoute.keyName}`)}</Link>
              <span>{subRoute.description}</span>
            </SubMenuItem>
          ))}
        </SubMenu>
      )}
    </MenuItem>
  );
};

const OpenedMenu: React.FC<OpenedMenu> = ({ isLoggedIn, history, logout, renderLanguages }) => {
  const { t } = useTranslation(['header', 'routes']);

  return (
    <Row className="full-menu">
      <Col layout={1 / 12} layoutS={0} className="desktop" />
      <Col layout={7 / 12} layoutS={1} className="main-links">
        {isLoggedIn
          ? authorizedRoutes &&
            authorizedRoutes.length > 0 &&
            authorizedRoutes.map((item: Route, index: number) => FullMenuLink({ ...item, history: history, t }, index))
          : unAuthorizedRoutes &&
            unAuthorizedRoutes.length > 0 &&
            unAuthorizedRoutes.map((item: Route, index: number) =>
              FullMenuLink({ ...item, history: history, t }, index)
            )}
      </Col>

      <Col layout={4 / 12} layoutS={1}>
        {/* <div className="search">
          <input />
          <i className="fas fa-search fa-lg" />
        </div>
        */}
        {helpRoutes && helpRoutes.length > 0 && (
          <ul className="help-links">
            {isLoggedIn && (
              <li>
                <Link to={'/'} className={'highlight'}>
                  <span onClick={logout}>{t('mainLinks.logOut')}</span>
                </Link>
              </li>
            )}
            {helpRoutes.map((item: Route, index: number) => (
              <li key={index}>
                <Link key={index} to={t(`routes:${item.keyName}`)} className={item.isHighlighted ? 'highlight' : ''}>
                  {t(`helpLinks.${item.keyName}`)}
                </Link>
              </li>
            ))}
          </ul>
        )}
        <div className="mobile" style={{ textAlign: 'right', paddingBottom: '30px' }}>
          {renderLanguages()}
        </div>{' '}
      </Col>
    </Row>
  );
};

export default OpenedMenu;
