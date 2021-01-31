import React, { useState, useEffect, useCallback } from 'react';
import {
  SliderWrapper,
  Slider,
  SliderPaginationLabel,
  SliderPaginationContainer,
  Arrow,
  ProgressWrapper
} from './slider.styled';
import { debounce } from 'throttle-debounce';
import { LinearProgress } from '@material-ui/core';

interface SliderComponent_Props {
  children: any;
}

let syncTimer: any;
let debouncer: any;

const SliderComponent: React.FC<SliderComponent_Props> = ({ children }) => {
  const [checked, setChecked] = useState<number>(0);
  const [value, setValue] = useState<number>(0);

  const updateChecked = useCallback(
    (negative: boolean = false) => {
      setChecked((checked: number) =>
        !negative
          ? checked + 1 > children.length - 1
            ? 0
            : checked + 1
          : checked - 1 < 0
          ? children.length - 1
          : checked - 1
      );
      debouncer = debounce(10000, updateChecked);
    },
    [children.length]
  );

  const [updateSearchResultsDebounced] = useState<any>(() => (debouncer = debounce(10000, updateChecked)));

  const update = useCallback(() => {
    updateSearchResultsDebounced();
    setValue(0);
    clearInterval(syncTimer);
    syncTimer = setInterval(() => setValue((res: number) => res + 1), 95);
  }, [updateSearchResultsDebounced]);
  useEffect(() => {
    update();
    return () => {
      if (syncTimer) clearInterval(syncTimer);
      if (debouncer) debouncer.cancel();
    };
  }, [update]);
  useEffect(() => {
    update();
  }, [checked, update]);

  return (
    <SliderWrapper>
      <SliderPaginationContainer>
        {children &&
          children.length > 0 &&
          children.map((item: any, index: number) => (
            <SliderPaginationLabel
              key={index}
              onClick={() => {
                setChecked(index);
                updateSearchResultsDebounced();
              }}
              className={checked === index ? 'checked' : ''}
            ></SliderPaginationLabel>
          ))}
      </SliderPaginationContainer>
      <Arrow
        onClick={() => {
          updateChecked(true);
          updateSearchResultsDebounced();
        }}
        content="leftBig"
        color="white0"
        size="64"
        position="left"
      />
      <Arrow
        onClick={() => {
          setValue(0);
          updateChecked();
          updateSearchResultsDebounced();
        }}
        content="rightBig"
        color="white0"
        size="64"
        position="right"
      />
      {children &&
        children.length > 0 &&
        children.map((item: any, index: number) => (
          <Slider key={index} checked={checked} className={`slide-${index}`} style={{ left: `${100 * index}%` }}>
            {item}
          </Slider>
        ))}
      {value && (
        <ProgressWrapper>
          <LinearProgress variant="determinate" value={value} className="progress" />
        </ProgressWrapper>
      )}
    </SliderWrapper>
  );
};

export default SliderComponent;
