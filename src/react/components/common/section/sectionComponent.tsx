import React from 'react';

interface ISection {
  nr?: number;
}

export const Section: React.FunctionComponent<ISection> = ({ nr, children }) => {
  return (
    <section className={nr ? 'numbered' : undefined}>
      <span>{nr}</span>
      {children}
    </section>
  );
};

export default Section;
