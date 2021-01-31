import React from 'react';
import { KFormElement, KSliderWrapper } from '../KForm_styles';
import Slider, { Mark } from '@material-ui/core/Slider';

interface KSlider_Props {
  name: string;
  label?: string;
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: number | undefined;
  fieldValue: number | undefined;
  autoHideLabel?: boolean;
  marks?: boolean;
  markStep?: number;
  setFieldValue?: (name: string, value: number) => void;
}

const KSlider: React.FC<KSlider_Props> = ({
  name,
  label,
  min,
  max,
  step,
  defaultValue,
  fieldValue,
  autoHideLabel,
  marks,
  markStep,
  setFieldValue,
  ...props
}) => {
  let parsedMarks: boolean | Mark[] | undefined = marks;

  if (
    marks === true &&
    markStep !== null &&
    markStep !== undefined &&
    markStep > 0 &&
    min !== undefined &&
    min !== null &&
    max !== undefined &&
    max !== null
  ) {
    parsedMarks = [];
    for (let n = min + markStep; n <= max; n += markStep) parsedMarks.push({ value: n });
  }

  return (
    <KFormElement>
      <KSliderWrapper>
        <Slider
          {...props}
          min={min}
          max={max}
          step={step}
          defaultValue={fieldValue == null || isNaN(fieldValue) ? defaultValue || min : fieldValue}
          valueLabelDisplay={autoHideLabel ? 'auto' : 'on'}
          marks={parsedMarks}
          onChangeCommitted={(e: any, value: any) => setFieldValue && setFieldValue(name, value)}
        />
      </KSliderWrapper>
    </KFormElement>
  );
};

KSlider.defaultProps = {
  min: 0,
  max: 100,
  step: 1,
  autoHideLabel: true,
  marks: false
};

export default KSlider;
