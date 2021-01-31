import React from 'react';
import AppProvider from '../app.core';
import { ModuleChildren, ModuleFinances, ModulePensionState, ModuleNeed, ModulePensionWork, ModuleWealth, ModulePensionPrivate } from '../../app_modules';
import { ModuleProviderBase_Props } from '../../app_modules/module.interfaces';

export const leftBehindPlaningFilter: ModuleProviderBase_Props[] = [
  {
    moduleName: 'children',
    moduleCore: new ModuleChildren(),
    mode: 3,
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
    mode: 3,
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
    mode: 3,
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
    mode: 3,
    cardFilter: [
      {
        person: 'myPerson',
        name: 'self',
        content: [
          { name: 'card_pensionwork_base_1', filter: [] }
        ]
      },
      {
        person: 'myPartner',
        name: 'partner',
        content: [
          { name: 'card_pensionwork_base_1', filter: [] }
        ]
      }
    ]
  },
  {
    moduleName: 'pensionPrivate',
    moduleCore: new ModulePensionPrivate(),
    mode: 3,
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
    moduleCore: new ModuleWealth(3),
    mode: 3,
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
    moduleCore: new ModuleNeed(3),
    mode: 3,
    cardFilter: [
      { 
        person: 'myPerson', 
        name: 'self', 
        content: [{ name: 'card_need_leftbehind_1', filter: [] }] 
      },
      {
        person: 'myPartner',
        name: 'partner',
        content: [{ name: 'card_need_leftbehind_1', filter: [] }]
      }
    ]
  },
  {
    moduleName: 'analyzerLeftBehind1',
    moduleType: 'analyzer',
    mode: 3,
    alternate: 1
  },
  {
    moduleName: 'analyzerLeftBehind2',
    moduleType: 'analyzer',
    mode: 3,
    alternate: 2
  }
];

const LeftBehindPlaning = (props: any) => {
  return <AppProvider {...props} appName={'leftBehindPlaning'} />;
};

export default LeftBehindPlaning;
