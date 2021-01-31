import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import * as DE from '../locales/de';
import * as EN from '../locales/en';
import * as FR from '../locales/fr';

i18n
  .use(LanguageDetector)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: {
      de: {
        global: DE.global,
        routes: DE.routes,

        header: DE.components.header,
        footer: DE.components.footer,
        kForms: DE.components.kForms,
        breadCrumbs: DE.components.breadCrumbs,

        landingMoneto: DE.contents.landingMoneto,
        quickCheck: DE.contents.quickCheck,
        dashboard: DE.contents.dashboard,
        ikScan: DE.contents.ikScan,
        pkScan: DE.contents.pkScan,
        about: DE.contents.about,
        applications: DE.contents.applications,
        scan: DE.contents.scan,
        news: DE.contents.news,
        login: DE.contents.login,
        consultantContact: DE.contents.consultantContact,
        upload: DE.contents.upload,
        account: DE.contents.account,
        support: DE.contents.support,
        contact: DE.contents.contact,
        partner: DE.contents.partner,
        imprint: DE.contents.imprint,
        resetPassword: DE.contents.resetPassword,
        termsOfUse: DE.contents.termsOfUse,
        termsAndConditions: DE.contents.termsAndConditions,
        privacyPolicy: DE.contents.privacyPolicy,
        validator: DE.contents.validator,
        ocrDetectionSummary: DE.contents.ocrDetectionSummary,
        logout: DE.contents.logout,

        modules: DE.modules.general,
        module_profile: DE.modules.profile,
        module_finances: DE.modules.finances,
        module_pensionState: DE.modules.pensionState,
        module_pensionWork: DE.modules.pensionWork,
        module_pensionPrivate: DE.modules.pensionPrivate,
        module_wealth: DE.modules.wealth,
        module_analyzer: DE.modules.analyzer,
        module_need: DE.modules.need,
        module_children: DE.modules.children,

        styleGuide: DE.contents.styleGuide,
        scanExceptions: DE.contents.scanExceptions
      },

      en: {
        global: EN.global,

        header: EN.components.header,

        landingMoneto: EN.contents.landingMoneto,
        quickCheck: EN.contents.quickCheck
      },

      fr: {
        global: FR.global,
        routes: FR.routes,

        header: FR.components.header,
        footer: FR.components.footer,
        kForms: FR.components.kForms,
        breadCrumbs: FR.components.breadCrumbs,

        landingMoneto: FR.contents.landingMoneto,
        quickCheck: FR.contents.quickCheck,
        dashboard: FR.contents.dashboard,
        ikScan: FR.contents.ikScan,
        pkScan: FR.contents.pkScan,
        about: FR.contents.about,
        applications: FR.contents.applications,
        scan: FR.contents.scan,
        news: FR.contents.news,
        login: FR.contents.login,
        consultantContact: FR.contents.consultantContact,
        upload: FR.contents.upload,
        account: FR.contents.account,
        support: FR.contents.support,
        contact: FR.contents.contact,
        partner: FR.contents.partner,
        imprint: FR.contents.imprint,
        resetPassword: FR.contents.resetPassword,
        termsOfUse: FR.contents.termsOfUse,
        termsAndConditions: FR.contents.termsAndConditions,
        privacyPolicy: FR.contents.privacyPolicy,
        validator: FR.contents.validator,
        ocrDetectionSummary: FR.contents.ocrDetectionSummary,
        logout: FR.contents.logout,

        modules: FR.modules.general,
        module_profile: FR.modules.profile,
        module_finances: FR.modules.finances,
        module_pensionState: FR.modules.pensionState,
        module_pensionWork: FR.modules.pensionWork,
        module_pensionPrivate: FR.modules.pensionPrivate,
        module_wealth: FR.modules.wealth,
        module_analyzer: FR.modules.analyzer,
        module_need: FR.modules.need,
        module_children: FR.modules.children,

        styleGuide: FR.contents.styleGuide,
        scanExceptions: FR.contents.scanExceptions
      }
    },

    fallbackLng: 'de',
    lng: 'de',

    keySeparator: '.',

    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;
