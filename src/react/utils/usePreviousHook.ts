import { useEffect, useState } from 'react';

export const usePrevious = (value: any | undefined) => {
  const [previous, setPrevious] = useState<any | undefined>(value);

  useEffect(() => {
    setPrevious(value);
  }, [value]);

  return previous;
};
