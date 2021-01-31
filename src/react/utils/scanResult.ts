import { HighlightProps } from '../components/common/pkAuszug/pkAuszug.interfaces';
import { IkScanResultItem, IkScanResultItemValue } from '../app_modules/pensionState/modulePensionState';

export const getBoundaries = (res: IkScanResultItem, key: string = '') => {
  if (!res || !res.combinedBoundingPoly || !res.combinedBoundingPoly.vertices) return undefined;
  let props: HighlightProps = {
    leftest: res.combinedBoundingPoly.vertices[0],
    topest: res.combinedBoundingPoly.vertices[1],
    righest: res.combinedBoundingPoly.vertices[2],
    bottomest: res.combinedBoundingPoly.vertices[3],
    leftest1: { x: 0, y: 0 },
    topest1: { x: 0, y: 0 },
    righest1: { x: 0, y: 0 },
    bottomest1: { x: 0, y: 0 }
  };

  res.Values.forEach((x: IkScanResultItemValue) => {
    if (key === x.SystemName && x.boundingPoly && x.boundingPoly.vertices && x.boundingPoly.vertices.length > 0) {
      props = {
        ...props,
        leftest1:
          x.boundingPoly && x.boundingPoly.vertices && x.boundingPoly.vertices.length > 0
            ? x.boundingPoly.vertices[0]
            : { x: 0, y: 0 },
        topest1:
          x.boundingPoly && x.boundingPoly.vertices && x.boundingPoly.vertices.length > 0
            ? x.boundingPoly.vertices[1]
            : { x: 0, y: 0 },
        righest1:
          x.boundingPoly && x.boundingPoly.vertices && x.boundingPoly.vertices.length > 0
            ? x.boundingPoly.vertices[2]
            : { x: 0, y: 0 },
        bottomest1:
          x.boundingPoly && x.boundingPoly.vertices && x.boundingPoly.vertices.length > 0
            ? x.boundingPoly.vertices[3]
            : { x: 0, y: 0 }
      };
    }
  });

  return props;
};
