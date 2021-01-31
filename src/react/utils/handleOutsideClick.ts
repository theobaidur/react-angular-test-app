import { useEffect } from 'react';

const HandleOutsideClick = (ref: any, id: string, callback: (id: string) => void) => {
  const handleClick = (event: any) => {
    if (ref.current && !ref.current.contains(event.target)) {
      callback(id);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClick);
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  });

  return true;
};

export default HandleOutsideClick;
