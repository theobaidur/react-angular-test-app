import { getColor } from './kdiagram_helpers';
import { getMonths } from '../../utils/calculators';
import { Step_Props } from '../../app_modules/analyzer/analyzer.helpers';
import createGUID from '../../utils/guidGenerator';

interface KDiagram_Block {
  id: string;
  type: number;
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  [key: string]: any;
}
interface KDiagram_Step {
  start: number;
  end: number;
  pos: KDiagram_Block[];
}

export function extractData(xDomain: number[], yDomain: number[], xWidth: number, yHeight: number, data: any) {
  const xLength = xDomain[1] - xDomain[0],
    yLength = yDomain[1] - yDomain[0],
    xOffset = Math.abs(xDomain[0]),
    xMul = xWidth / xLength,
    yMul = yHeight / yLength;

  const mainStart = data.need.start,
    steps = data.steps,
    groups: number[] = [42],
    newSteps: KDiagram_Step[] = [];

  steps.forEach((step: Step_Props, index: number) => {
    const start = getMonths(mainStart, step.start),
      end = getMonths(mainStart, step.end),
      pos = step.pos,
      holes = data.hole.pos,
      newPos: KDiagram_Block[] = [];

    let yOffset = 0;
    pos.forEach((block) => {
      const h = block.month * yMul,
        newBlock = {
          type: block.ref.type,
          id: block.ref.id,
          x: (xOffset + start) * xMul,
          width: (end - start) * xMul,
          y: yHeight - (yOffset + h),
          height: h,
          fill: getColor(block.ref.type, block.ref.sType),
          ...block
        };
      if (!groups.includes(block.ref.type)) {
        groups.push(block.ref.type);
      }
      yOffset += h;
      newPos.push(newBlock);
    });

    const holeBlock = holes[index];
    const holeBlockHeight = holeBlock.month * yMul;
    const newHole = {
      type: 42,
      id: createGUID(),
      x: (xOffset + start) * xMul,
      width: (end - start) * xMul,
      y: yHeight - (yOffset + holeBlockHeight),
      height: holeBlockHeight,
      fill: getColor(42),
      ...holeBlock
    };
    newPos.push(newHole);

    newSteps.push({
      start: start,
      end: end,
      pos: newPos
    });
  });

  const breaker : any[] = [];
  steps.forEach((e:any) => {
    if(breaker.indexOf(e.start) === -1){ breaker.push( e.start ); }  
    if(breaker.indexOf(e.end) === -1){ breaker.push( e.end ); }  
  });
  const breaks : any[] = [];
  const monthBreaks : any[] = [];
  breaker.forEach((e:any)=>{
    monthBreaks.push( getMonths(data.need.start,e) );
    breaks.push( e.getMonth() + 1 + '.' + e.getFullYear() );
  });


  const income: KDiagram_Block = {
    x: 0,
    y: yHeight - data.income.month * yMul,
    height: data.income.month * yMul,
    width: xOffset * xMul,
    fill: getColor(23),
    labelId: 'type23',
    id: 'income',
    type: 23,
    value: data.income.value
  };

  const need: KDiagram_Block = {
    x: xOffset * xMul,
    y: yHeight - data.need.month * yMul,
    height: data.need.month * yMul,
    width: xWidth - xOffset * xMul,
    fill: getColor(42),
    labelId: 'type42',
    id: 'need',
    type: 42,
    value: data.need.value
  };

  return {
    need: need,
    income: income,
    groups: groups,
    steps: newSteps,
    breaks: breaks,
    monthBreaks: monthBreaks
  };
}
