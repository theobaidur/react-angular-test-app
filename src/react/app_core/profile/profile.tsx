import React from 'react';
import AppProvider from '../app.core';
import { ModuleProfile } from '../../app_modules';
import { ModuleProviderBase_Props } from '../../app_modules/module.interfaces';

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

const Profile = (props: any) => {
  return <AppProvider {...props} appName={'profile'} />;
};

export default Profile;
