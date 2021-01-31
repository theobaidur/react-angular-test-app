import React from 'react';
import AppProvider from '../app.core';
import { ModuleChildren, ModuleFinances, ModulePensionState, ModuleNeed, ModulePensionWork, ModuleWealth, ModulePensionPrivate } from '../../app_modules';
import { ModuleProviderBase_Props } from '../../app_modules/module.interfaces';

export const disabilityPlaningFilter: ModuleProviderBase_Props[] = [
  {
    moduleName: 'children',
    moduleCore: new ModuleChildren(),
    mode: 2,
    cardFilter: [
      { person: 'myPerson', name: 'self', content: [{ name: 'card_children_ex_1', filter: [] }] },
      {
        person: 'myPartner',
        name: 'partner',
        content: [{ name: 'card_children_ex_1', filter: [] }]
      },
      {
        person: 'myConnection',
        name: 'both',
        content: [{ name: 'card_children_base_1', filter: [] }]
      }
    ]
  },
  {
    moduleName: 'finances',
    moduleCore: new ModuleFinances(),
    mode: 2,
    cardFilter: [
      {
        person: 'myPerson',
        name: 'self',
        content: [{ name: 'card_finances_income_1', filter: [] }]
      },
      {
        person: 'myPartner',
        name: 'partner',
        content: [{ name: 'card_finances_income_1', filter: [] }]
      }
    ]
  },
  {
    moduleName: 'pensionState',
    moduleCore: new ModulePensionState(),
    mode: 2,
    cardFilter: [
      {
        person: 'myPerson',
        name: 'self',
        content: [{ name: 'card_pensionstate_base_1', filter: [] }]
      },
      {
        person: 'myPartner',
        name: 'partner',
        content: [{ name: 'card_pensionstate_base_1', filter: [] }]
      }
    ]
  },
  {
    moduleName: 'pensionWork',
    moduleCore: new ModulePensionWork(),
    mode: 2,
    cardFilter: [
      {
        person: 'myPerson',
        name: 'self',
        content: [
          { name: 'card_pensionwork_base_1', filter: [] },
          { name: 'card_pensionwork_uvg_1', filter: [] }
        ]
      },
      {
        person: 'myPartner',
        name: 'partner',
        content: [
          { name: 'card_pensionwork_base_1', filter: [] },
          { name: 'card_pensionwork_uvg_1', filter: [] }
        ]
      }
    ]
  },
  {
    moduleName: 'pensionPrivate',
    moduleCore: new ModulePensionPrivate(),
    mode: 2,
    cardFilter: [
      {
        person: 'myPerson',
        name: 'self',
        content: [{ name: 'card_pensionprivate_life_1', filter: [] }]
      },
      {
        person: 'myPartner',
        name: 'partner',
        content: [{ name: 'card_pensionprivate_life_1', filter: [] }]
      }
    ]
  },
  {
    moduleName: 'wealth',
    moduleCore: new ModuleWealth(2),
    mode: 2,
    cardFilter: [
      {
        person: 'myPerson',
        name: 'self',
        content: [{ name: 'card_wealth_person_1', filter: [] }]
      },
      {
        person: 'myPartner',
        name: 'partner',
        content: [{ name: 'card_wealth_person_1', filter: [] }]
      },
      {
        person: 'myConnection',
        name: 'both',
        content: [{ name: 'card_wealth_connection_1', filter: [] }]
      }
    ]
  },
  {
    moduleName: 'need',
    moduleCore: new ModuleNeed(2),
    mode: 2,
    cardFilter: [
      {
        person: 'myPerson',
        name: 'self',
        content: [{ name: 'card_need_disability_1', filter: [] }]
      },
      {
        person: 'myPartner',
        name: 'partner',
        content: [{ name: 'card_need_disability_1', filter: [] }]
      }
    ]
  },
  {
    moduleName: 'analyzerDisability1',
    moduleType: 'analyzer',
    mode: 2,
    alternate: 1
  },
  {
    moduleName: 'analyzerDisability2',
    moduleType: 'analyzer',
    mode: 2,
    alternate: 2
  }
];

const DisabilityPlaning = (props: any) => {
  return <AppProvider {...props} appName={'disabilityPlaning'} />;
};

export default DisabilityPlaning;
