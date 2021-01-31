import { useCallback, useEffect, useRef } from 'react';

export const useMemoizedCallback = (callback: any, inputs: any[] = []) => {
  // Instance var to hold the actual callback.
  const callbackRef = useRef(callback);

  // The memoized callback that won't change and calls the changed callbackRef.
  const memoizedCallback = useCallback((...args) => {
    return callbackRef.current(...args);
  }, []);

  // The callback that is constantly updated according to the inputs.
  const updatedCallback = useCallback(callback, inputs);

  // The effect updates the callbackRef depending on the inputs.
  useEffect(() => {
    callbackRef.current = updatedCallback;
  }, [updatedCallback]);

  // Return the memoized callback.
  return memoizedCallback;
};
