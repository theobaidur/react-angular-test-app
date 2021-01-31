import React from 'react';
import AppProvider from '../app.core';
import { ModuleProfile } from '../../app_modules';
import { ModuleProviderBase_Props } from '../../app_modules/module.interfaces';


const Profile = (props: any) => {
  return <AppProvider {...props} appName={'profile'} />;
};

export default Profile;
