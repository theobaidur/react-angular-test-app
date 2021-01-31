import { shallowIndexOf } from './customMethods';

export function testModuleData(testData: any[], moduleData: any[], mode?: number) {
  if( !testData || testData.length === 0 ) return {}
  const result = { done: false, total: 0, invalid: 0 };
  moduleData.forEach((data, i) => {
    if (!data || ! testData[i] ) return false;
    const test = testAgainst(testData[i], data, mode);
    for (var k in test) {
      if( test[k] === 1 ) result.invalid++;
      if( test[k] === 1 || test[k] === 2 ) result.total++;
    }
    result.done = result.invalid === 0;
  });
  return result;
}

export function testAgainst(tester: any, data: any, mode?: number) {
  const result: { [key: string]: 1 | 2 | 3 } = {};
  tester.forEach((elem: any) => {
    let validLevel: 1 | 2 | 3 = 1, depToken: boolean = true;
    const dataValue = data[elem.name];
    
    if ( !mode || ( mode && elem.mode === mode ) ){
      if ( elem.dKey ) {
        const depElem = tester.find((x:any) => x.name === elem.dKey);
        if ( !testValue(data[elem.dKey], depElem.type, elem.dValue) ){
            validLevel = 3;
            depToken = false;
        }
      }
      if ( depToken && testValue(dataValue, elem.type) ) {
        validLevel = 2;
      }
    }
    else{
      validLevel = 3;
    }
    result[elem.name] = validLevel;
  });
  return result;
}

function testValue(value: any, type: any, depending?: any) {
  if( !value ) return false;
  if (
    (type === 'num' && typeof value === 'number' && value > 0) ||
    (type === 'numArr' && value.length > 0 &&
      (!depending || (depending && shallowIndexOf(value, depending) > -1))) ||
    (type === 'str' && typeof value === 'string' )
  ) {
    return true;
  }
  return false;
}
