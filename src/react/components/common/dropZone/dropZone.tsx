import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import DropZoneStyled from './dropZone.styled';

interface Dropzone {
  onDrop: Function;
  capture?: boolean | undefined;
  multiple: boolean;
  accept: string;
  text: string;
}

const DropZone = (props: Dropzone) => {
  const { onDrop } = props;
  const onDropInternal = useCallback(
    (acceptedFiles) => {
      onDrop(acceptedFiles);
    },
    [onDrop]
  );
  const { getRootProps, getInputProps } = useDropzone({ onDrop: onDropInternal });

  return (
    <DropZoneStyled {...getRootProps()}>
      <input {...getInputProps()} multiple={props.multiple} accept={props.accept} capture={props.capture} />
      <i className="upload" />
      <p> {props.text}</p>
    </DropZoneStyled>
  );
};
export default DropZone;
