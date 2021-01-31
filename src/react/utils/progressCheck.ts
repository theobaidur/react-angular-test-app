import { ModuleProviderBase_Props } from '../app_modules/module.interfaces';

export const progressCheck: (x: any) => any = (state: any) => {
  for (var k in state.authInfo.applications) {
    let total: number = 0,
      invalid: number = 0;
    let mode = k === 'pensionPlaning' ? 1 : k === 'disabilityPlaning' ? 2 : k === 'leftBehindPlaning' ? 3 : 1;
    state.authInfo.applications[k].filter.forEach((module: ModuleProviderBase_Props, i: number) => {
      const moduleName = module.moduleName;
      if (
        state.myPerson.legal === undefined ||
        state.myPartner.legal === undefined ||
        state.myConnection.legal === undefined
      )
        return;
      const legalData: { [key: string]: any } = {
        myPerson:
          moduleName !== 'profile' && moduleName !== 'children'
            ? { ...state.myPerson.legal[moduleName] }
            : { ...state.myPerson },
        myPartner:
          moduleName !== 'profile' && moduleName !== 'children'
            ? { ...state.myPartner.legal[moduleName] }
            : { ...state.myPartner },
        myConnectionData:
          moduleName !== 'profile' && moduleName !== 'children'
            ? { ...state.myConnection.legal[moduleName] }
            : { ...state.myConnection }
      };
      
      const core = module.moduleCore;
      if (!core) return false;
      core.process(legalData.myPerson, legalData.myPartner, legalData.myConnectionData, state);
      const moduleCheck = { done: false, invalid: 0, total: 0 };
        if(core.layout === 'static' ){
         module.cardFilter &&
          module.cardFilter.forEach((filter) => {
            if (state.myPartner.active || filter.person === 'myPerson'){
              const person = state[filter.person];
              filter.content.forEach((card) => {
                const elem = core.cards.find((x:any) => x.name === card.name);
                if (elem) {
                  const elemCheck = elem.classed.validate(
                    legalData[elem.connection ? 'myConnectionData' : filter.person],
                    mode,
                    person
                  );
                  moduleCheck.invalid += elemCheck.invalid;
                  moduleCheck.total += elemCheck.total;
                }
              });
            }
          });
          moduleCheck.done = moduleCheck.invalid === 0;
          core.progress = moduleCheck;
          total += moduleCheck.total;
          invalid += moduleCheck.invalid;
        }
        else if( core.layout === 'array'){
          module.cardFilter &&
            module.cardFilter.forEach((filter) => {
              if (state.myPartner.active || filter.person === 'myPerson'){
                const person = state[filter.person];
                filter.content.forEach((card) => {
                  const elem = core.cards.find((x:any) => x.name === card.name);
                  if (elem) {
                    const target = filter.person;
                    if( legalData[target].array ){ 
                      legalData[target].array.forEach((e:any)=>{
                        const elemCheck = elem.classed.validate( e, module.mode, person );
                        moduleCheck.invalid += elemCheck.invalid;
                        moduleCheck.total += elemCheck.total;
                      });
                    }else if(!legalData[target].hasNoElements || !legalData[target].hasNoElements[0]){
                      moduleCheck.invalid++;
                      moduleCheck.total++;
                    }else if(legalData[target].hasNoElements[0] === 1){
                      moduleCheck.total++;
                    }
                  }
                });
              }
           });
           moduleCheck.done = moduleCheck.invalid === 0;
           core.progress = moduleCheck;
           total += moduleCheck.total;
           invalid += moduleCheck.invalid;
          
        }
    });
    state.authInfo.applications[k].progress = ((total - invalid) / total) * 100;
  }

  return state;
};
