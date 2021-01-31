import { constantNumbers } from '../../utils/calculators';
import { Dossier } from '../../redux/initialState';
import { Person } from '../../redux/types';
import dateFromString from '../../utils/dateFromString';
import {
  analyzerBlock,
  getAnalyzerChildren,
  analyzerDistributor,
  analyzerHoles,
  leftBehindRights
} from './analyzer.helpers';
import { getMonths } from '../../utils/calculators';

export function analyzerCore(
  appName: string,
  state: Dossier,
  target: number,
  mode: number,
  alternate: number
) {
  const person: Person = target === 1 ? state.myPerson : state.myPartner,
    birthDate = dateFromString(person.birthDate),
    incomeMonth = person.result.finances.incomeMonth || 0,
    incomeValue = person.result.finances.incomeYear || 0;

  if (!birthDate || incomeMonth === undefined || incomeValue === undefined) return {};

  let result: { [key: string]: any } = {
    person: person,
    income: {
      month: incomeMonth,
      value: incomeValue
    },
    birth: birthDate
  };

  let appSpecific: { [key: string]: any } | false = {};

  switch (appName) {
    case 'pensionPlaning':
      appSpecific = analyzerPension(person, birthDate, state, target);
      break;
    case 'disabilityPlaning':
      appSpecific = analyzerDisability(person, birthDate, state, target, alternate);
      break;
    case 'leftBehindPlaning':
      appSpecific = analyzerLeftBehind(person, birthDate, state, target, alternate);
      break;
  }

  if (!appSpecific) return {};

  if (person.legal.wealth) {
    const wealthId = `${appName}${alternate}`;
    const wealthPerson: number = person.legal.wealth.use && person.legal.wealth.use[wealthId] | 0;
    const wealthCon: any = state.myConnection.legal.wealth && state.myConnection.legal.wealth.use;
    const wealthConUse: number = !wealthCon
      ? 0
      : target === 1
      ? wealthCon.person[wealthId]
      : wealthCon.partner[wealthId];
    if (wealthPerson > 0) {
      const modBlockPerson = new analyzerBlock(
        88,
        'person',
        appSpecific.category,
        person,
        appSpecific.need.start,
        undefined,
        undefined,
        undefined,
        wealthPerson
      );
      appSpecific.liquids.push(modBlockPerson);
      appSpecific.groupLabels.type88 = 'type88';
    }
    if (wealthConUse > 0) {
      const modBlockCon = new analyzerBlock(
        88,
        'con',
        appSpecific.category,
        person,
        appSpecific.need.start,
        undefined,
        undefined,
        undefined,
        wealthConUse
      );
      appSpecific.liquids.push(modBlockCon);
      appSpecific.groupLabels.type88 = 'type88';
    }
  }

  const steps = analyzerDistributor(
    appSpecific.blocks,
    appSpecific.liquids,
    appSpecific.need.month,
    mode,
    alternate,
    incomeValue
  );
  result.need = { ...appSpecific.need };
  result.groupLabels = appSpecific.groupLabels;
  result.steps = steps;
  result.yMax = incomeMonth;

  let totalFromSteps: number = 0;
  const months: number[] = [];
  steps.forEach(step => {
    months.push(step.month);
    totalFromSteps += step.total;
  });

  const stepMax = Math.max(...months);
  result.yMax = Math.max(stepMax, appSpecific.need.month, incomeMonth);
  const holeTotal = Math.max(appSpecific.need.value - totalFromSteps, 0);
  const remainingTime = getMonths(new Date(), appSpecific.need.start);

  result.hole = {
    pos: analyzerHoles(steps, person, appSpecific.need.month),
    total: holeTotal,
    remainingTime: remainingTime,
    saveMonth: Math.round(holeTotal / remainingTime)
  };

  return result;
}

function analyzerPension(person: Person, birthDate: Date, state: Dossier, target: number) {
  const category = 'pension',
    startAge = person.result.need.retirementStart || 0;
  if (startAge === 0) return false;
  const pensionStart: Date = new Date(+birthDate);
  pensionStart.setFullYear(
    birthDate.getFullYear() + constantNumbers.defaultPension[person.gender[0] - 1]
  );

  const needStart: Date = new Date(+birthDate);
  needStart.setFullYear(birthDate.getFullYear() + startAge);
  const needEnd: Date = new Date(+birthDate);
  needEnd.setFullYear(birthDate.getFullYear() + 85);
  const needMonth = person.result.need.retirementNeed || 0;
  const needValue = getMonths(needStart, needEnd) * needMonth;

  const blocks: analyzerBlock[] = [];
  const liquids: analyzerBlock[] = [];
  const groupLabels: { [key: string]: string } = { type42: 'type42' };

  const emptyBlock = new analyzerBlock(
    0,
    'main',
    category,
    person,
    needStart,
    needEnd,
    undefined,
    0,
    undefined
  );
  blocks.push(emptyBlock);

  if (person.result.pensionState) {
    const modStart = pensionStart > needStart ? pensionStart : needStart;
    const modBlock = new analyzerBlock(
      1,
      'main',
      category,
      person,
      modStart,
      needEnd,
      undefined,
      person.result.pensionState.pension,
      undefined
    );
    const modChildren = getAnalyzerChildren(
      person.getChildren(state.myConnection, 1, 1, false, false),
      1,
      'child',
      category,
      modStart,
      person.result.pensionState.child,
      needEnd,
      undefined
    );
    blocks.push(modBlock, ...modChildren);
    groupLabels.type1 = 'type1a';
  }

  if (person.result.pensionWork && person.result.pensionWork.pension) {
    const modValues = person.result.pensionWork.pension.find(
      (x: any) => +x.pensionage === startAge
    );
    if (modValues && modValues.month && modValues.child) {
      const modStart = new Date(+birthDate);
      modStart.setFullYear(modStart.getFullYear() + startAge);
      const modBlock = new analyzerBlock(
        2,
        'main',
        category,
        person,
        modStart,
        needEnd,
        undefined,
        modValues.month,
        undefined
      );
      const modChildren = getAnalyzerChildren(
        person.getChildren(state.myConnection, 1, 1, false, false),
        2,
        'child',
        category,
        modStart,
        modValues.child,
        needEnd,
        undefined
      );
      blocks.push(modBlock, ...modChildren);
      groupLabels.type2 = 'type2';
    }
  }

  if(person.result.pensionPrivate){
    const modData = person.result.pensionPrivate;
    modData.array && modData.array.forEach((elem:any) => {
      if( !elem.capitalType || ( 
        elem.capitalType && elem.capitalType[0] === 2 && elem.capitalOption 
          && elem.capitalOption[0] === 1
       ) ){
        return false;
      }
      let elemStart = elem.mainEnd > needStart ? elem.mainEnd : needStart;
      if( elem.capitalCustomDate ){
        elemStart = elem.capitalEnd > needStart ? elem.capitalEnd : needStart;
      }
      const elemBlock = new analyzerBlock(
        50,
        'cap',
        category,
        person,
        elemStart,
        undefined,
        undefined,
        undefined,
        elem.capitalUse === undefined ? elem.capitalValue : elem.capitalUse
      );
      elemBlock.labelExtra += `"${elem.name}"`;
      liquids.push(elemBlock);
    })
    groupLabels.type50 = 'type50';
  }

  return {
    category: category,
    blocks: blocks,
    liquids: liquids,
    groupLabels: groupLabels,
    need: {
      start: needStart,
      end: needEnd,
      month: needMonth,
      value: needValue
    }
  };
}

function analyzerDisability(
  person: Person,
  birthDate: Date,
  state: Dossier,
  target: number,
  alternate: number
) {
  const category = 'dis';

  const needStart: Date = new Date();
  const needEnd: Date = new Date(+birthDate);
  needEnd.setFullYear(
    birthDate.getFullYear() + constantNumbers.defaultPension[person.gender[0] - 1]
  );
  const needMonth = person.result.need.disabilityNeed || 0;
  const needValue = getMonths(needStart, needEnd) * needMonth;

  const blocks: analyzerBlock[] = [];
  const liquids: analyzerBlock[] = [];
  const groupLabels: { [key: string]: string } = { type42: 'type42' };

  const pseudoStart = new Date(+needStart);
  pseudoStart.setFullYear(pseudoStart.getFullYear() + 2);

  const emptyBlock = new analyzerBlock(
    0,
    'main',
    category,
    person,
    needStart,
    needEnd,
    undefined,
    0,
    undefined
  );
  blocks.push(emptyBlock);

  if (person.result.pensionState) {
    const modBlock = new analyzerBlock(
      1,
      'main',
      category,
      person,
      pseudoStart,
      needEnd,
      undefined,
      person.result.pensionState.disability,
      undefined
    );
    const modChildren = getAnalyzerChildren(
      person.getChildren(state.myConnection, 1, 1, false, false),
      1,
      'child',
      category,
      pseudoStart,
      person.result.pensionState.disabilityChild,
      needEnd,
      undefined
    );
    blocks.push(modBlock, ...modChildren);
    groupLabels.type1 = 'type1b';
  }

  if (person.result.pensionWork) {
    const income = person.result.finances.incomeYear || 0,
      uvgArray =
        alternate === 1
          ? person.result.pensionWork.uvgIllness
          : person.result.pensionWork.uvgAccident,
      start = new Date(+needStart);
    uvgArray.forEach((e: any, i:number) => {
      if(i === 0 && e.from > 30){
        start.setMonth(start.getMonth() + Math.floor(e.from/30));
      }
      const time = Math.floor((e.till - (e.from < 20 ? 0 : e.from)) / 30);
      let end = new Date(+start);
      end.setMonth(end.getMonth() + time);
      if (e.till >= 720) end = new Date(+pseudoStart);
      const month = Math.round((income * (e.percent / 100)) / 12);
      const block = new analyzerBlock(
        alternate === 1 ? 4 : 3,
        'day',
        category,
        person,
        new Date(+start),
        new Date(+end),
        undefined,
        month,
        undefined
      );
      start.setMonth(start.getMonth() + time);
      blocks.push(block);
    });
    
    if (alternate === 1) {
      const modBlock = new analyzerBlock(
        2,
        'main',
        category,
        person,
        pseudoStart,
        needEnd,
        undefined,
        person.result.pensionWork.disability,
        undefined
      );
      const modChildren = getAnalyzerChildren(
        person.getChildren(state.myConnection, 1, 1, false, false),
        2,
        'child',
        category,
        pseudoStart,
        person.result.pensionWork.disabilityChild,
        needEnd,
        undefined
      );
      blocks.push(modBlock, ...modChildren);
      groupLabels.type2 = 'type2';
      groupLabels.type4 = 'type4';
    } else if (alternate === 2) {
      const modBlock = new analyzerBlock(
        3,
        'main',
        category,
        person,
        pseudoStart,
        needEnd,
        undefined,
        person.result.pensionWork.uvgDisability,
        undefined
      );
      const modChildren = getAnalyzerChildren(
        person.getChildren(state.myConnection, 1, 1, false, false),
        3,
        'child',
        category,
        pseudoStart,
        person.result.pensionWork.uvgDisabilityChild,
        needEnd,
        undefined
      );
      blocks.push(modBlock, ...modChildren);
      groupLabels.type3 = 'type3';
    }
  }

  if(person.result.pensionPrivate){
    const modData = person.result.pensionPrivate;
    modData.array && modData.array.forEach((elem:any)=>{
      elem.disability && elem.disability.forEach((sub:any)=>{
        if(!sub.type) return false;
        let subStart = new Date(+needStart);
        if(sub.type[0] === 1){
          subStart.setMonth( subStart.getMonth() + (sub.wait||0));
          let subEnd = elem.mainEnd > needEnd ? needEnd : elem.mainEnd;
          if( sub.customDate ){
            subEnd = sub.end > needEnd ? needEnd : sub.end;
          } 
          const isShort = sub.short && sub.short[0] === 1;
          const subBlock = new analyzerBlock(
            51,
            'dis',
            category,
            person,
            subStart,
            isShort ? undefined : subEnd,
            isShort ? sub.shortTime : undefined,
            sub.value / (sub.cycle ? sub.cycle[0] === 1 ? 12 : 1 : 12),
            undefined
          );
          subBlock.labelExtra += `"${elem.name}"`;
          if( 
            (sub.illness && sub.illness[0] === 1 && alternate === 1) ||
            (sub.accident && sub.accident[0] === 1 && alternate === 2 ) 
            ){
              blocks.push( subBlock );
            }
            groupLabels.type51 = 'type51';
        }else if( sub.type[0] === 2 ){
          const subBlock = new analyzerBlock(
            50,
            'dis',
            category,
            person,
            subStart,
            undefined,
            undefined,
            undefined,
            sub.use === undefined ? sub.value : sub.use
          );
          
          subBlock.labelExtra += `"${elem.name}"`;
          if( 
            (sub.illness && sub.illness[0] === 1 && alternate === 1) ||
            (sub.accident && sub.accident[0] === 1 && alternate === 2 ) 
            ){
              liquids.push( subBlock );
          }
          groupLabels.type50 = 'type50';
        }
      })
    });
  }

  return {
    blocks: blocks,
    liquids: liquids,
    groupLabels: groupLabels,
    need: {
      start: needStart,
      end: needEnd,
      month: needMonth,
      value: needValue
    }
  };
}

function analyzerLeftBehind(
  person: Person,
  birthDate: Date,
  state: Dossier,
  target: number,
  alternate: number
) {
  const category = 'left';

  const needStart: Date = new Date();
  const needEnd: Date = new Date(+birthDate);
  needEnd.setFullYear(
    birthDate.getFullYear() + constantNumbers.defaultPension[person.gender[0] - 1]
  );
  const needMonth = person.result.need.leftBehindNeed || 0;
  const needValue = getMonths(needStart, needEnd) * needMonth;

  const blocks: analyzerBlock[] = [];
  const liquids: analyzerBlock[] = [];
  const groupLabels: { [key: string]: string } = { type42: 'type42' };

  const rights = leftBehindRights(person, state);

  const emptyBlock = new analyzerBlock(
    0,
    'main',
    category,
    person,
    needStart,
    needEnd,
    undefined,
    0,
    undefined
  );
  blocks.push(emptyBlock);

  if (person.result.pensionState) {
    const modStart = needStart;
    if (rights.type1.widow.hasRight) {
      const modBlock = new analyzerBlock(
        1,
        'main',
        category,
        person,
        modStart,
        rights.type1.widow.rightTill,
        undefined,
        person.result.pensionState.widow,
        undefined
      );
      blocks.push(modBlock);
    }
    if (rights.type1.orphans.length) {
      const modChildren = getAnalyzerChildren(
        rights.type1.orphans,
        1,
        'child',
        category,
        modStart,
        person.result.pensionState.orphan,
        needEnd,
        undefined
      );
      blocks.push(...modChildren);
    }
    if (rights.type1.exorphans.length) {
      const modChildren = getAnalyzerChildren(
        rights.type1.exorphans,
        1,
        'child',
        category,
        modStart,
        person.result.pensionState.orphan,
        needEnd,
        undefined
      );
      blocks.push(...modChildren);
    }
    groupLabels.type1 = 'type1a';
  }

  if (person.result.pensionWork) {
    const modStart = needStart;
    if (alternate === 1) {
      if (rights.type2.widow.hasRight) {
        const modBlock = new analyzerBlock(
          2,
          'main',
          category,
          person,
          modStart,
          rights.type2.widow.rightTill,
          undefined,
          person.result.pensionWork.widow,
          undefined
        );
        blocks.push(modBlock);
      }
      if (rights.type2.orphans.length) {
        const modChildren = getAnalyzerChildren(
          rights.type2.orphans,
          2,
          'child',
          category,
          modStart,
          person.result.pensionWork.orphan,
          needEnd,
          undefined
        );
        blocks.push(...modChildren);
      }
      if (rights.type2.exorphans.length) {
        const modChildren = getAnalyzerChildren(
          rights.type2.exorphans,
          2,
          'child',
          category,
          modStart,
          person.result.pensionWork.orphan,
          needEnd,
          undefined
        );
        blocks.push(...modChildren);
      }
      groupLabels.type2 = 'type2';
    } else if (alternate === 2) {
      if (rights.type3.widow.hasRight) {
        const modEnd =
          rights.type3.widow.rightTill === 'lifelong' ? needEnd : rights.type3.widow.rightTill;
        const modBlock = new analyzerBlock(
          3,
          'main',
          category,
          person,
          modStart,
          modEnd,
          undefined,
          person.result.pensionWork.uvgWidow,
          undefined
        );
        blocks.push(modBlock);
      }
      if (rights.type3.orphans.length) {
        const modChildren = getAnalyzerChildren(
          rights.type3.orphans,
          3,
          'child',
          category,
          modStart,
          person.result.pensionWork.uvgOrphan,
          needEnd,
          undefined
        );
        blocks.push(...modChildren);
      }
      if (rights.type3.exorphans.length) {
        const modChildren = getAnalyzerChildren(
          rights.type3.exorphans,
          3,
          'child',
          category,
          modStart,
          person.result.pensionWork.uvgOrphan,
          needEnd,
          undefined
        );
        blocks.push(...modChildren);
      }
      groupLabels.type3 = 'type3';
    }
  }

  if(person.result.pensionPrivate){
    const modData = person.result.pensionPrivate;
    modData.array.forEach((elem:any)=>{
      elem.leftBehind && elem.leftBehind.forEach((sub:any)=>{
        if(!sub.type) return false;
        const subStart = new Date(+needStart);
        if(sub.type[0] === 1){
          let subEnd = elem.mainEnd > needEnd ? needEnd : elem.mainEnd;
          if( sub.customDate ){
            subEnd = sub.end > needEnd ? needEnd : sub.end;
          } 
          const subBlock = new analyzerBlock(
            51,
            'left',
            category,
            person,
            subStart,
            new Date(subEnd),
            undefined,
            sub.value / (sub.cycle ? sub.cycle[0] === 1 ? 12 : 1 : 12),
            undefined
          );
          
          subBlock.labelExtra += `"${elem.name}"`;
          if( 
            (sub.illness && sub.illness[0] === 1 && alternate === 1) ||
            (sub.accident && sub.accident[0] === 1 && alternate === 2 ) 
            ){
              blocks.push( subBlock );
          }
          groupLabels.type51 = 'type51';
        }else if( sub.type[0] === 2 ){
          const subBlock = new analyzerBlock(
            50,
            'left',
            category,
            person,
            subStart,
            undefined,
            undefined,
            undefined,
            sub.use === undefined ? sub.value : sub.use
          );
          
          subBlock.labelExtra += `"${elem.name}"`;
          if( 
            (sub.illness && sub.illness[0] === 1 && alternate === 1) ||
            (sub.accident && sub.accident[0] === 1 && alternate === 2 ) 
            ){
              liquids.push( subBlock );
          }
          groupLabels.type50 = 'type50';
        }

      })
    });
  }

  return {
    blocks: blocks,
    liquids: liquids,
    groupLabels: groupLabels,
    need: {
      start: needStart,
      end: needEnd,
      month: needMonth,
      value: needValue
    }
  };
}
