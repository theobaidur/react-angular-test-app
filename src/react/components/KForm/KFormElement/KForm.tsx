import React from 'react';
import { KForm } from '../KForm_styles';

interface KFormProps {
  children: any;
  onSubmit: any;
}
export const KFormElement: React.FC<KFormProps> = ({ children, onSubmit }) => {
  return (
    <KForm
      onSubmit={(evt: any) => {
        evt.preventDefault();
        onSubmit();
      }}
    >
      {children}
    </KForm>
  );
};
