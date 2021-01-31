import React, { useRef, useCallback } from 'react';
import { Viewer, CloseButton } from '../styled';
import QuickPinchZoom, { make3dTransformValue } from 'react-quick-pinch-zoom';

interface ImageViewerProps {
  src: string;
  onClose: () => void;
  isOpen: boolean;
}

export const ImageViewer: React.FC<ImageViewerProps> = ({ isOpen, src, onClose }) => {
  const imgRef: any = useRef<HTMLImageElement>();

  const onUpdate = useCallback(
    ({ x, y, scale }) => {
      const updateImg = (x: number, y: number, scale: number) => {
        const img = imgRef.current;
        if (img) {
          const value = make3dTransformValue({ x, y, scale });
          img.style.setProperty('transform', value);
        }
      };
      updateImg(Number.isNaN(x) ? 1 : x, Number.isNaN(y) ? 1 : y, Number.isNaN(scale) ? 1 : scale);
    },
    []
  );

  return (
    <Viewer isOpen={isOpen}>
      <QuickPinchZoom
        wheelScaleFactor={100}
        animationDuration={0}
        minZoom={0.99999999}
        zoomOutFactor={1}
        onUpdate={onUpdate}
        style={{ width: '100%', height: '100%' }}
      >
        <img ref={imgRef} src={src} alt="" />
      </QuickPinchZoom>
      <CloseButton onClick={onClose} />
    </Viewer>
  );
};
