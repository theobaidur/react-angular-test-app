import React from 'react';
import ScanComponent from '../../../components/common/scanComponent';

const ScanPage: React.FC<any> = (props: any) => {
  return <ScanComponent history={props.history} match={props.match} />;
};

export default ScanPage;
