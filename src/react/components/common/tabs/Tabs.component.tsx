import React, { useState, useEffect } from 'react';
import Tabs from '@material-ui/core/Tabs';
import { TabsComponentWrapper } from './tabs.styled';

interface TabsComponentProperties {
  defaultTab: string;
  onChanged: (value: string) => void;
  children: any;
  color?: string;
}

const TabsComponent: React.FC<TabsComponentProperties> = (props: TabsComponentProperties) => {
  const [value, setValue] = useState<string>(props.defaultTab);

  useEffect(() => {
    setValue(props.defaultTab);
  }, [props.defaultTab]);

  function handleChange(event: React.ChangeEvent<{}>, newValue: string) {
    setValue(newValue);
    props.onChanged(newValue);
  }

  return (
    <TabsComponentWrapper color={props.color}>
      <Tabs value={value} onChange={handleChange} variant="fullWidth">
        {props.children}
      </Tabs>
    </TabsComponentWrapper>
  );
};

interface TabContainerProperties {
  children?: any;
  activeTabId: string;
}

const TabsContainer: React.FC<TabContainerProperties> = (props: TabContainerProperties) => {
  return props.children.map((item: any, i: number) =>
    item.props.id === props.activeTabId || props.activeTabId.indexOf(item.props.id) > -1 ? item : null
  );
};

interface TabContentProperties {
  id: string;
  children?: any;
}

const TabContent: React.FC<TabContentProperties> = (props: TabContentProperties) => {
  return <div id={props.id}>{props.children}</div>;
};

export { TabsComponent, TabsContainer, TabContent };
