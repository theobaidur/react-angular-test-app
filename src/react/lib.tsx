import React from 'react';
import ReactDom from 'react-dom';
import './styles/App.css';

export * from './components/common/pkAuszug';
export * from './components/common/ikAuszug';
export * from './components/common/dialog';
export * from './components/common/section';
export * from './components/common/uploadFiles';

/**
 * Renders the react component at the given container
 * @param container DOM Element to render conmponent to.
 * @param reactComponent React component to render
 * @param props Props to set on the react component
 */
export function render(container: Element, reactComponent: string, props?: any) {
  const reactElement = React.createElement(reactComponent, props);
  ReactDom.render(reactElement, container);
}

/**
 * Removes the react component rendered in container
 * @param container DOM element where react component was rendered
 */
export function unrender(container: Element) {
  ReactDom.unmountComponentAtNode(container);
}
