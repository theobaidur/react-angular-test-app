import { getMonths, getAge } from "../../utils/calculators";
import { theme as t } from '../../assets/theming';

export function getXYDomains( data: any ){
    const 
    yMax = data.yMax ? data.yMax : data.income,
    xMax = getMonths( data.need.start, data.need.end ),
    xMinTick = getAge( data.birth, data.need.start ),
    xMaxTick = getAge( data.birth, data.need.end );
  
    return {
       y : [ 0, yMax ],
       x : [ 0 - ( 5 * 12 ), xMax ],
       xMinTick : xMinTick,
       xMaxTick : xMaxTick 
    }
}
 
export function getColor( type: number, sType: string = 'main' ){
    const childCheck = ['child', 'orphan', 'exorphan'];
    if( childCheck.indexOf( sType ) > -1 ){
        return type === 1 ? t.analyzer.diagramPillarFirstChild : 
            type === 2 || type === 3 ? t.analyzer.diagramPillarSecondChild : 'white';
    }else{
        return type === 1 ? t.analyzer.diagramPillarFirst : 
            type === 2 || type === 3 || type === 4 ? t.analyzer.diagramPillarSecond : 
            type === 5 || type === 6 ? t.analyzer.diagramPillarThird : 
            type === 23 ? t.analyzer.diagramIncome : 
            type === 42 ? t.analyzer.diagramNeed : 'white';
    }
}