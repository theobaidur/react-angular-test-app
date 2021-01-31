import { Person } from '../../redux/types';
import { constantNumbers, getMyScale } from '../../utils/calculators';
import dateFromString from '../../utils/dateFromString';
import { ModulePensionStateCore_Props } from './ModulePensionStateCore_Props';
import { ModulePensionStateResult_Props } from './ModulePensionStateResult_Props';
import { IkSummaryItem } from './IkSummaryItem';


export function ModulePensionStateCore(
  moduleData: ModulePensionStateCore_Props | undefined,
  mode: number | undefined,
  person: Person | undefined
) {
  if (!moduleData || !person)
    return {};

  const { gender, birthDate } = person;
  const now: number = new Date().getFullYear();
  const birth = dateFromString(birthDate);
  if (!birth)
    return {};
  const result: ModulePensionStateResult_Props = {
    pension: 0,
    child: 0,
    disability: 0,
    disabilityChild: 0,
    widow: 0,
    orphan: 0
  };

  const realIncome: number = person.result.finances.incomeYear || 0,
    startYear: number = birth.getFullYear() + constantNumbers.AHV_age,
    youngYear: number = startYear - 3,
    totalYear: number = constantNumbers.workYears[+gender[0] - 1],
    realYear: number = now - startYear;

  if (moduleData.detailed && moduleData.detailed.indexOf(1) > -1 && moduleData.ikSummaryItems) {
    const details = [...moduleData.ikSummaryItems];
    if (details.length < 1)
      return {};

    const youngDetails: IkSummaryItem[] = [];
    const realDetails: IkSummaryItem[] = [];
    details.forEach((k) => {
      if (!k.year)
        return false;
      if (k.year.length > 4)
        k.year = k.year.substring(0, 4);
      const itemYear = k.year.length !== 2 ? k.year : +k.year > 25 ? '19' + k.year : '20' + k.year;
      if (+itemYear < youngYear)
        return false;
      let item = realDetails.find((x) => x.year === itemYear) || youngDetails.find((x) => x.year === itemYear);
      if (item) {
        item.income += k.income;
      } else {
        item = {
          originalYear: k.year,
          year: itemYear,
          income: k.income,
          incomeCode: k.incomeCode,
          isCodeValid: true
        };
        if (+itemYear >= startYear) {
          realDetails.push(item);
        } else {
          if (item.income > constantNumbers.AHV_needed)
            youngDetails.push(item);
        }
      }
    });

    realDetails.sort((a, b) => {
      return +a.year - +b.year;
    });

    youngDetails.sort((a, b) => {
      return +b.income - +a.income;
    });

    if (!realDetails.length)
      return {};
    const lastItem = realDetails[realDetails.length - 1];
    const lastIncome: number = lastItem.income || 0,
      lastYear: number = +lastItem.year || 0,
      endYear: number = startYear + totalYear - 1;
    let realTotal: number = 0;
    realDetails.forEach((k) => {
      realTotal += +k.income;
    });

    let realLossYears: number = 0;

    const detailsForYear = (year: number) => realDetails.find((x) => +x.year === year);

    for (let k = startYear; k < lastYear + 1; k++) {
      const item = detailsForYear(k);
      if (!item || (item.income < constantNumbers.AHV_needed && +item.year >= startYear)) {
        if (youngDetails.length) {
          realTotal += youngDetails[0].income;
        } else {
          realLossYears++;
        }
      }
    }

    const sumDetails = [...realDetails];
    let sumTotal: number = realTotal;
    let sumLossYears: number = realLossYears;
    for (let k = lastYear + 1; k < endYear + 1; k++) {
      sumDetails.push({ incomeCode: 0, year: k.toString(), income: lastIncome, isCodeValid: true });
      sumTotal += lastIncome;
      if (lastIncome < constantNumbers.AHV_needed)
        sumLossYears++;
    }

    const pensionAvg: number = sumTotal / (totalYear - sumLossYears),
      disAvg: number = realTotal / (realYear - realLossYears),
      pension = getMyScale(pensionAvg),
      dis = getMyScale(disAvg);

    result.pension = Math.round((pension / totalYear) * (totalYear - sumLossYears));
    result.child = Math.round(result.pension * constantNumbers.AHV_child);
    result.disability = Math.round((dis * (realYear - realLossYears)) / realYear);
    result.disabilityChild = Math.round(result.disability * constantNumbers.AHV_child);
    result.widow = Math.round(result.disability * constantNumbers.AHV_widow);
    result.orphan = Math.round(result.disability * constantNumbers.AHV_orphan);
  } else if (moduleData.quick && moduleData.quick.indexOf(1) > -1) {
    const { firstAge, missing, missingYears } = moduleData;
    if (!firstAge || !missing || !missing.length)
      return {};
    const cutIncome = realIncome ? realIncome * constantNumbers.AHV_ageCut(person.age()) : 0,
      pre: number = Math.max(0, constantNumbers.AHV_age - firstAge),
      preMiss: number = firstAge > constantNumbers.AHV_age ? firstAge - constantNumbers.AHV_age : 0,
      miss: number = preMiss + Math.max(0, missingYears - pre),
      pension: number = getMyScale(cutIncome);

    result.pension = Math.round((pension * (totalYear - miss)) / totalYear);
    result.disability = Math.round((pension * (realYear - miss)) / realYear);
    result.widow = Math.round(result.pension * constantNumbers.AHV_widow);
    result.child = Math.round(result.pension * constantNumbers.AHV_child);
    result.disabilityChild = Math.round(result.disability * constantNumbers.AHV_child);
    result.orphan = Math.round(result.disability * constantNumbers.AHV_orphan);
  } else if (moduleData.minMedMax && moduleData.minMedMax.length > 0) {
    const val = constantNumbers.AHV_minMedMax(moduleData.minMedMax[0]);
    result.pension = val;
    result.disability = val;
    result.disabilityChild = val * constantNumbers.AHV_child;
    result.child = val * constantNumbers.AHV_child;
    result.widow = val * constantNumbers.AHV_widow;
    result.orphan = val * constantNumbers.AHV_orphan;
  }

  if (isNaN(result.pension))
    result.pension = 0;
  if (isNaN(result.disability))
    result.disability = 0;
  if (isNaN(result.child))
    result.child = 0;
  if (isNaN(result.widow))
    result.widow = 0;
  if (isNaN(result.orphan))
    result.orphan = 0;

  return result;
}
