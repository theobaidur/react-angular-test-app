import { getMonths } from '../../../../utils/calculators';
import { analyzerHoles, analyzerBlock, analyzerDistributor } from '../../../../app_modules/analyzer/analyzer.helpers';

const constantNumbers = {
  AHV_max: 28440,
  UVG_basePercent: 0.8,
  BVG_minPercent: 0.125,
  BVG_coordPercent: 0.875,
  BVG_pensionPercent: 0.068,

  BVG_lvls: [
    { f: 25, t: 35, p: 0.07 },
    { f: 35, t: 45, p: 0.1 },
    { f: 45, t: 55, p: 0.15 },
    { f: 55, t: 65, p: 0.18 }
  ],

  BVG_lvl: function(start: number, end: number) {
    const lvl = this.BVG_lvls;
    let result = 0;
    for (var k = 0; k < lvl.length; k++) {
      if (start > lvl[k].t || end < lvl[k].f) {
        continue;
      }
      let year = 0;
      if (end > lvl[k].t) {
        year = Math.min(lvl[k].t - start, 10);
      } else if (end < lvl[k].t) {
        year = Math.min(end - lvl[k].f, end - start);
      }
      result += lvl[k].p * year;
    }
    return result;
  },
  BVG_min: function() {
    return this.AHV_max * this.BVG_minPercent;
  },
  BVG_coord: function() {
    return this.AHV_max * this.BVG_coordPercent - this.BVG_min();
  }
};

const QCCalculator = (gender: number, income: number, birthYear: number, firstYear: number) => {
  const nowYear = new Date().getFullYear(),
    maxYears = gender === 1 ? 44 : 43,
    startAge = firstYear - birthYear < 21 ? 21 : firstYear - birthYear,
    maxAge = 21 + maxYears,
    maxPossibleYears = birthYear + maxAge - firstYear,
    maxCurrentYears = nowYear - (birthYear + 21),
    currentYears = nowYear - firstYear;

  const cat1Base = constantNumbers.AHV_max * 0.4 + income * 0.2,
    cat1Pension = (cat1Base * maxPossibleYears) / maxYears / 12,
    cat1DisabilityBase = (cat1Base * currentYears) / maxCurrentYears,
    cat1Disability = cat1DisabilityBase/12,
    cat2Base = income - constantNumbers.BVG_coord(),
    cat2Pension =
      (cat2Base * constantNumbers.BVG_lvl(startAge, maxAge) * constantNumbers.BVG_pensionPercent) /
      12,
    cat2DisabilityI =
      (cat2Base * constantNumbers.BVG_lvl(startAge, maxAge) * constantNumbers.BVG_pensionPercent) /
      12,
    cat2DisabilityA1 = (((income * 0.9) / income) * income) / 12,
    cat2DisabilityA2 = (((income * 0.9 - cat1DisabilityBase) / income) * income) / 12,
    mainStart = new Date(`${birthYear + maxAge}-01-01`),
    nowStart = new Date(),
    mainEnd = new Date(`${birthYear + maxAge + 20}-01-01`),
    incomeMonth = income / 12,
    now2Year = new Date(`${nowStart.getFullYear() + 2}-01-01`),
    birth = new Date(`${birthYear}-01-01`);

  console.log( cat2Pension );
  const blocksPension = [
    new analyzerBlock( 1, 'main', 'pension', undefined, mainStart, mainEnd, undefined, cat1Pension, undefined ), 
    new analyzerBlock( 2, 'main', 'pension', undefined, mainStart, mainEnd, undefined, cat2Pension, undefined ) 
  ];

  const blocksDisA = [
    new analyzerBlock( 1, 'main', 'disA', undefined, now2Year, mainStart, undefined, cat1Disability, undefined ),
    new analyzerBlock( 3, 'main', 'disA', undefined, nowStart, now2Year, undefined, cat2DisabilityA1, undefined ),
    new analyzerBlock( 3, 'main', 'disA', undefined, now2Year, mainStart, undefined, cat2DisabilityA2, undefined )   
  ];
  const blocksDisI = [
    new analyzerBlock( 1, 'main', 'disI', undefined, now2Year, mainStart, undefined, cat1Disability, undefined ),
    new analyzerBlock( 2, 'main', 'disI', undefined, nowStart, now2Year, undefined, cat2DisabilityA1, undefined ),
    new analyzerBlock( 2, 'main', 'disI', undefined, now2Year, mainStart, undefined, cat2DisabilityI, undefined )   
  ];

  const stepsPension = analyzerDistributor( blocksPension, [], incomeMonth, 1, 1, income );
  const stepsDisA = analyzerDistributor( blocksDisA, [], incomeMonth, 2, 1, income );
  const stepsDisI = analyzerDistributor( blocksDisI, [], incomeMonth, 2, 2, income );
  console.log( stepsDisA );
  const timePension =  getMonths(mainStart, mainEnd);
  const timeDis = getMonths( now2Year, mainStart );

  const analysis = {
    pension: {
      missing: {
        value: Math.round(incomeMonth - (cat1Pension + cat2Pension)),
        percent: 100 - Math.round(((cat1Pension + cat2Pension) / incomeMonth) * 100)
      },
      sub: Math.round(cat1Pension + cat2Pension),
      income: { month: incomeMonth, value: income },
      birth: birth,
      need: {
        value: incomeMonth * timePension,
        start: mainStart,
        end: mainEnd,
        month: incomeMonth 
      },
      groupLabels: { type1: 'type1a', type2: 'type2', type42: 'type42' },
      steps: stepsPension, 
      hole : { 
        pos: analyzerHoles( stepsPension, undefined, incomeMonth ),
        total: Math.round( incomeMonth*timePension - (cat1Pension + cat2Pension)*timePension ),
        remainingTime: 0
      },
      yMax: incomeMonth
    },
    disabilityA: {
      missing: {
        value: Math.round(incomeMonth - (cat1Disability + cat2DisabilityA2)),
        percent: 100 - Math.round(((cat1Disability + cat2DisabilityA2) / incomeMonth) * 100)
      },
      sub: Math.round(cat1Disability + cat2DisabilityA2),
      income: { month: incomeMonth, value: income },
      birth: birth,
      need: { 
          value: incomeMonth * getMonths(nowStart, mainStart), 
          start: nowStart, 
          end: mainStart,
          month: incomeMonth
      },
      groupLabels: { type1: 'type1a', type2: 'type2', type42: 'type42' },
      steps: stepsDisA,
      hole : { 
        pos: analyzerHoles( stepsDisA, undefined, incomeMonth ),
        total: Math.round( (incomeMonth*24 - cat2DisabilityA1*24 ) + (incomeMonth*timeDis - (cat1Disability+cat2DisabilityA2)*timeDis )),
        remainingTime: 0
      },
      yMax: incomeMonth
    },
    disabilityI: {
      missing: {
        value: Math.round(incomeMonth - (cat1Disability + cat2DisabilityI)),
        percent: 100 - Math.round(((cat1Disability + cat2DisabilityI) / incomeMonth) * 100)
      },
      sub: Math.round(cat1Disability + cat2DisabilityI),
      income: { month: incomeMonth, value: income },
      birth: birth,
      need: { 
          value: incomeMonth * getMonths(nowStart, mainStart), 
          start: nowStart, 
          end: mainStart,
          month: incomeMonth
      },
      groupLabels: { type1: 'type1a', type2: 'type2', type42: 'type42' },
      steps: stepsDisI,
      hole : { 
        pos: analyzerHoles( stepsDisI, undefined, incomeMonth ),
        total: Math.round( (incomeMonth*24 - cat2DisabilityA1*24 ) + (incomeMonth*timeDis - (cat1Disability+cat2DisabilityI)*timeDis )),
        remainingTime: 0
      },
      yMax: incomeMonth
    }
  };
  console.log( analysis );  
  return analysis;
};

export default QCCalculator;
