import React from 'react';
import { Link } from 'react-router-dom';
import StyledBreadcrumb from './breadcrumb.styled';
import withBreadcrumbs, { BreadcrumbsRoute } from 'react-router-breadcrumbs-hoc';
import i18next from 'i18next';

interface BreadcrumbsRouteType {
  breadcrumbs: Array<BreadcrumbsRoute>;
}

const Breadcrumbs = ({ breadcrumbs }: BreadcrumbsRouteType) => {
  if (breadcrumbs.length < 1) return null;

  return (
    <StyledBreadcrumb className="breadcrumbs">
      {breadcrumbs.map(({ breadcrumb, match }: any, index: number) => {
        const text: string = breadcrumb.props.children.replace(/-/g, ' ');
        return (
          <React.Fragment key={match.url}>
            <span className="bc">
              <Link key={index} to={match.url || ''}>
                {i18next.t(`routes:${text}`) || text[0].toUpperCase() + text.slice(1)}
              </Link>
            </span>
            {index < breadcrumbs.length - 1 && '>'}
          </React.Fragment>
        );
      })}
    </StyledBreadcrumb>
  );
};

// @ts-ignore
export default withBreadcrumbs()(Breadcrumbs);
