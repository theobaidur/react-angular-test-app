import { ModuleChildren, ModuleFinances, ModulePensionState, ModulePensionWork, ModulePensionPrivate, ModuleWealth, ModuleNeed } from "src/react/app_modules";
import { ModuleProviderBase_Props } from "src/react/inc/module.interfaces";

export const pensionPlaningFilter: ModuleProviderBase_Props[] = [
  {
    moduleName: 'children',
    moduleCore: new ModuleChildren(),
    mode: 1,
    cardFilter: [
      {
        person: 'myPerson',
        name: 'self',
        content: [{ name: 'card_children_ex_1', filter: [] }]
      },
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
    mode: 1,
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
    mode: 1,
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
    mode: 1,
    cardFilter: [
      {
        person: 'myPerson',
        name: 'self',
        content: [{ name: 'card_pensionwork_base_1', filter: [] }]
      },
      {
        person: 'myPartner',
        name: 'partner',
        content: [{ name: 'card_pensionwork_base_1', filter: [] }]
      }
    ]
  },
  {
    moduleName: 'pensionPrivate',
    moduleCore: new ModulePensionPrivate(),
    mode: 1,
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
    moduleCore: new ModuleWealth(),
    mode: 1,
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
    moduleCore: new ModuleNeed(),
    mode: 1,
    cardFilter: [
      {
        person: 'myPerson',
        name: 'self',
        content: [{ name: 'card_need_pension_1', filter: [] }]
      },
      {
        person: 'myPartner',
        name: 'partner',
        content: [{ name: 'card_need_pension_1', filter: [] }]
      }
    ]
  },

  {
    moduleName: 'analyzerPension',
    moduleType: 'analyzer',
    mode: 1,
    alternate: 1
  }
];
