import { useState, useEffect } from 'react';
import { IDocScan } from '../Scan.interfaces';
import scanProvider from '../../../../providers/scanProvider';

export function useCheckerCode(key: string) {
  const initialState = { progress: true };
  const [isUnique, setIsUnique] = useState<IDocScan>(initialState);
  useEffect(() => {
    checkDocsData(key, setIsUnique);
  }, [key, setIsUnique]);

  return isUnique;
}

const checkDocsData: Function = (key: string, save: Function) => {
  scanProvider.checkDocScan(
    key,
    (res) => save(res),
    (err: string) => console.log(err)
  );
};

export function GetPortraitOrientation() {
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });

  return { height, width };
}
