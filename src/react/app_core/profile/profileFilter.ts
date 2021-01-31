import { ModuleProfile } from "src/react/app_modules";
import { ModuleProviderBase_Props } from "src/react/inc/module.interfaces";

export const profileFilter: ModuleProviderBase_Props[] = [
  {
    moduleName: 'profile',
    moduleCore: new ModuleProfile(),
    mode: 1,
    cardFilter: [
      {
        person: 'myPerson',
        name: 'self',
        content: [{ name: 'card_profile_personal_1', filter: [] }, { name: 'card_profile_partner_1', filter: [] }]
      },
      {
        person: 'myPartner',
        name: 'partner',
        content: [{ name: 'card_profile_personal_1', filter: [] }, { name: 'card_profile_connection_1', filter: [] }]
      }
    ]
  }
];
