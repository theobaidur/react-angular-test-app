import React, { useState } from 'react';
import { client } from '../../../services/httpService';
import { LinearProgress } from '@material-ui/core';
import { ProgressContainer } from '../styled';

export const LoadingIndicator: React.FC<any> = (props: any) => {
  const [isVisible, setVisible] = useState<boolean>(false);
  let count: number = 0;

  const request = (config: any) => {
    count = count + 1;

    if (count > 0) setVisible(() => true);
    return config;
  };

  const response = (config: any) => {
    count = count - 1;
    if (count === 0) setVisible(() => false);
    return config;
  };

  client.interceptors.request.use(request);

  client.interceptors.response.use(response, response);

  return isVisible ? (
    <ProgressContainer>
      <LinearProgress />
    </ProgressContainer>
  ) : (
    <></>
  );
};
