import React from 'react';

import i18n from '../utils/i18n';
import Referrals from '../constants/referrals';
import { string } from 'prop-types';

const QuickCheckPage = React.lazy(() => import('../pages/quickcheck/page/quickCheck'));
const LandingPage = React.lazy(() => import('../pages/newLanding'));
const StyleGuidePage = React.lazy(() => import('../pages/styleGuide'));
const Dashboard = React.lazy(() => import('../pages/dashboard'));
const Profile = React.lazy(() => import('../app_core/profile'));
const PensionPlanning = React.lazy(() => import('../app_core/pensionPlanning'));
const LeftBehindPlanning = React.lazy(() => import('../app_core/leftBehindPlanning'));
const DisablityPlanning = React.lazy(() => import('../app_core/disabiltyPlanning'));
const ScanPage = React.lazy(() => import('../pages/scan'));
const LoginPage = React.lazy(() => import('../pages/login'));
const ConsultantContactPage = React.lazy(() => import('../pages/consultantContact'));
const AccountPage = React.lazy(() => import('../pages/account'));
const ContactPage = React.lazy(() => import('../pages/contact'));
const SupportPage = React.lazy(() => import('../pages/support'));
const PartnerPage = React.lazy(() => import('../pages/partner'));
const ImprintPage = React.lazy(() => import('../pages/imprint'));
const AboutPage = React.lazy(() => import('../pages/about'));
const ResetPasswordPage = React.lazy(() => import('../pages/resetPassword'));
const TermsOfUsePage = React.lazy(() => import('../pages/termsOfUse'));
const TermsAndConditionsPage = React.lazy(() => import('../pages/termsAndConditions'));
const LogoutPage = React.lazy(() => import('../pages/logout'));
const PrivacyPolicyPage = React.lazy(() => import('../pages/privacyPolicy'));

export type RouteWithLayoutProps = {
  component: React.LazyExoticComponent<any>;
  path: Array<string>;
  isSpecialist?: boolean;
  unavailableForSpec?: boolean;
  availableForOwnDossier?: boolean;
};

function makePath(path: string) {
  let paths: Array<string> = path.split('|');
  let resultArray: Array<string> = [];
  paths.map((item: string) => (resultArray = resultArray.concat([item, '/client' + item, '/de' + item, '/fr' + item])));
  return resultArray;
}

export const loggedInComponents: Array<RouteWithLayoutProps> = [
  {
    path: makePath(`/|${i18n.t('routes:more')}`),
    component: Dashboard
  },
  {
    path: makePath('/plus'),
    component: Dashboard
  },
  {
    path: makePath(i18n.t('routes:disability-plan')),
    component: DisablityPlanning
  },
  {
    path: makePath('/incapacite-de-travail'),
    component: DisablityPlanning
  },
  {
    path: makePath(i18n.t('routes:pension-plan')),
    component: PensionPlanning
  },
  {
    path: makePath('/planification-de-la-retraite'),
    component: PensionPlanning
  },
  {
    path: makePath(i18n.t('routes:leftbehind-plan')),
    component: LeftBehindPlanning
  },
  {
    path: makePath('/deces'),
    component: LeftBehindPlanning
  },
  {
    path: makePath(i18n.t('routes:consultant-contact')),
    component: ConsultantContactPage
  },
  {
    path: makePath('/conseiller-contact'),
    component: ConsultantContactPage
  },
  {
    path: makePath(i18n.t('routes:profile')),
    component: Profile,
    unavailableForSpec: true,
    availableForOwnDossier: true
  },
  {
    path: makePath('/profil'),
    component: Profile,
    unavailableForSpec: true,
    availableForOwnDossier: true
  },
  {
    path: makePath(i18n.t('routes:account')),
    component: AccountPage,
    unavailableForSpec: true
  },
  {
    path: makePath('/compte'),
    component: AccountPage,
    unavailableForSpec: true
  }
];
export const loggedOutComponents: Array<RouteWithLayoutProps> = [
  {
    path: makePath(`/|/:referralIdentifier(${Referrals.identifiers.join('|')})`),
    component: LandingPage
  },
  {
    path: makePath(
      `${i18n.t('routes:login')}|${i18n.t('routes:register')}|${i18n.t('routes:register')}/:referrerCode|${i18n.t(
        'routes:register'
      )}/:referrerCode/:promotionCode`
    ),
    component: LoginPage
  },
  {
    path: makePath(
      `/connexion|/inscription|/inscription/:referrerCode|/inscription/:referrerCode/:promotionCode`
    ),
    component: LoginPage
  },
  {
    path: makePath(i18n.t('routes:reset-password')),
    component: ResetPasswordPage
  },
  {
    path: makePath('reinitialiser-le-mot-de-passe'),
    component: ResetPasswordPage
  },
  {
    path: makePath(i18n.t('routes:logout')),
    component: LogoutPage
  },
  {
    path: makePath('/deconnexion'),
    component: LogoutPage
  }
];
export const unsecureComponents: Array<RouteWithLayoutProps> = [
  {
    path: makePath(i18n.t('routes:partner')),
    component: PartnerPage
  },
  {
    path: makePath('/partenaire'),
    component: PartnerPage
  },
  {
    path: makePath(i18n.t('routes:imprint')),
    component: ImprintPage
  },

  {
    path: makePath(i18n.t('routes:about')),
    component: AboutPage
  },
  {
    path: makePath('/sur-moneto'),
    component: AboutPage
  },
  {
    path: makePath(i18n.t('routes:quick-check')),
    component: QuickCheckPage
  },
  {
    path: makePath(i18n.t('routes:style-guide')),
    component: StyleGuidePage
  },

  {
    path: makePath(`${i18n.t('routes:scan')}/:key`),
    component: ScanPage
  },

  {
    path: makePath(i18n.t('routes:contact')),
    component: ContactPage
  },
  {
    path: makePath('/contact'),
    component: ContactPage
  },
  {
    path: makePath(`${i18n.t('routes:support')}|${i18n.t('routes:support')}/:id`),
    component: SupportPage
  },
  {
    path: makePath(i18n.t('routes:terms-of-use')),
    component: TermsOfUsePage
  },
  {
    path: makePath("/conditions-d_utilisation"),
    component: TermsOfUsePage
  },
  {
    path: makePath(i18n.t('routes:terms-and-conditions')),
    component: TermsAndConditionsPage
  },
  {
    path: makePath("/conditions-commerciales"),
    component: TermsAndConditionsPage
  },
  {
    path: makePath(i18n.t('routes:privacy-policy')),
    component: PrivacyPolicyPage
  },
  {
    path: makePath("/declaration-de-la-confidentialite-des-donnees"),
    component: PrivacyPolicyPage
  }
];
