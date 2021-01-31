import React, { useState, useRef, createRef, useEffect, useCallback } from 'react';
import { HighlightProps } from '../pkAuszug/pkAuszug.interfaces';
import QuickPinchZoom, { make3dTransformValue } from 'react-quick-pinch-zoom';
import { IconButtonWithText } from '../styled';

interface PhotoContainer_Props {
  image: string;
  boundingPoly: HighlightProps | undefined;
  currentWidth: number;
}

export const PhotoDragScaleContainer: React.FC<PhotoContainer_Props> = ({ currentWidth, boundingPoly, image }) => {
  const divRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const wrapperDivRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState<number>(1);
  const [scale, setScale] = useState<number>(1);
  const quickPinchZoomRef = useRef<any>(createRef());
  const [outerStroke, setOuterStroke] = useState<string>('');
  const [innerStroke, setInnerStroke] = useState<string>('');

  const highLight = useCallback(() => {
    if (boundingPoly) {
      const ratio: number = imgRef && imgRef.current ? imgRef.current.naturalWidth / imgRef.current.offsetWidth : 1;

      setOuterStroke(
        `${boundingPoly.leftest.x / ratio},${boundingPoly.leftest.y / ratio} ${boundingPoly.topest.x /
          ratio},${boundingPoly.topest.y / ratio} ${boundingPoly.righest.x / ratio},${boundingPoly.righest.y /
          ratio} ${boundingPoly.bottomest.x / ratio},${boundingPoly.bottomest.y / ratio} `
      );
      setInnerStroke(
        `${boundingPoly.leftest1.x / ratio - 2},${boundingPoly.leftest1.y / ratio - 2} ${boundingPoly.topest1.x /
          ratio +
          2},${boundingPoly.topest1.y / ratio - 2} ${boundingPoly.righest1.x / ratio + 2},${boundingPoly.righest1.y /
          ratio +
          2} ${boundingPoly.bottomest1.x / ratio - 2},${boundingPoly.bottomest1.y / ratio + 2} `
      );

      if (quickPinchZoomRef && quickPinchZoomRef.current && quickPinchZoomRef.current.alignCenter) {
        let newCenter = {
          x: (boundingPoly.leftest1.x > 0 ? boundingPoly.leftest1.x : boundingPoly.leftest.x) / ratio,
          y: (boundingPoly.leftest1.y > 0 ? boundingPoly.leftest1.y : boundingPoly.leftest.y) / ratio,
          scale: 1.4
        };

        if (newCenter.x !== Infinity && newCenter.y !== Infinity) quickPinchZoomRef.current.alignCenter(newCenter);
      }
    } else {
      setOuterStroke('');
      setInnerStroke('');
    }
  }, [boundingPoly]);

  useEffect(() => {
    if (boundingPoly)
      if (zoom === 2) highLight();
      else setZoom(2);
    else {
      setOuterStroke('');
      setInnerStroke('');
    }
  }, [boundingPoly, highLight, setZoom, zoom]);

  useEffect(() => highLight(), [zoom, highLight]);
  useEffect(() => {
    quickPinchZoomRef.current._handlers = [
      ...quickPinchZoomRef.current._handlers,
      ['touchstart', quickPinchZoomRef.current._handlerOnTouchStart],
      ['touchend', quickPinchZoomRef.current._handlerOnTouchEnd],
      ['touchmove', quickPinchZoomRef.current._handlerOnTouchMove]
    ];
    quickPinchZoomRef.current._unSubscribe();
    quickPinchZoomRef.current._bindEvents();
  }, [quickPinchZoomRef]);
  useEffect(() => highLight(), [currentWidth, highLight]);
  useEffect(() => {
    if (wrapperDivRef && wrapperDivRef.current) {
      wrapperDivRef.current.addEventListener(
        'wheel',
        (e: any) => {
          e.preventDefault();
        },
        { passive: false }
      );
    }
  }, [wrapperDivRef]);

  const changeZoom = (value: number) => {
    if (
      quickPinchZoomRef &&
      quickPinchZoomRef.current &&
      quickPinchZoomRef.current.alignCenter &&
      imgRef &&
      imgRef.current
    )
      quickPinchZoomRef.current.alignCenter({
        x:
          quickPinchZoomRef.current._offset.x / quickPinchZoomRef.current._zoomFactor +
          imgRef.current.offsetWidth / 2 / quickPinchZoomRef.current._zoomFactor,
        y:
          quickPinchZoomRef.current._offset.y / quickPinchZoomRef.current._zoomFactor +
          imgRef.current.offsetHeight / 2 / quickPinchZoomRef.current._zoomFactor,
        scale: value > 0 ? (scale + value > 5 ? 5 : scale + value) : scale + value < 1 ? 1 : scale + value
      });
  };

  const onUpdate = useCallback(
    ({ x, y, scale }) => {
      const { current: img } = divRef;
      const value = make3dTransformValue({ x, y, scale });
      setScale(scale);
      if (img) {
        img.style.setProperty('transform', value);
      }
    },
    [divRef]
  );

  return (
    <div style={{ position: 'relative' }}>
      <IconButtonWithText
        style={{
          position: 'absolute',
          zIndex: 5,
          left: '10px',
          bottom: '60px'
        }}
        content="zoomIn"
        onClick={() => changeZoom(0.25)}
      >
        <i />
      </IconButtonWithText>

      <IconButtonWithText
        style={{
          position: 'absolute',
          zIndex: 5,
          left: '10px',
          bottom: '15px'
        }}
        content="zoomOut"
        onClick={() => changeZoom(-0.25)}
      >
        <i />
      </IconButtonWithText>
      <QuickPinchZoom
        wheelScaleFactor={100}
        animationDuration={0}
        minZoom={0.99999999}
        zoomOutFactor={1}
        isTouch={() => false}
        onUpdate={onUpdate}
        ref={quickPinchZoomRef}
      >
        <div ref={divRef}>
          <img
            style={{
              height: '100%',
              width: '100%',
              objectFit: 'contain'
            }}
            src={image}
            ref={imgRef}
            alt="lhehel world"
          />
          <svg style={{ position: 'absolute', height: '100%', width: '100%', top: 0, left: 0 }}>
            <polygon
              strokeDasharray="10,5"
              points={outerStroke}
              style={{ stroke: 'green', fill: 'transparent', strokeWidth: 1 }}
            />
            <polygon
              strokeDasharray="5,5"
              points={innerStroke}
              style={{ stroke: 'red', fill: 'transparent', strokeWidth: 1 }}
            />
          </svg>
        </div>
      </QuickPinchZoom>
    </div>
  );
};
