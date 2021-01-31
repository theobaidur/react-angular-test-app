import React from 'react';
import { Menu } from './menu.styled';
import { Tab, Tabs } from '@material-ui/core';

interface DashboardMenuProps {
  activeTab: number;
  onChange: Function;
  menuItems: Array<string>;
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
}

const DashboardMenu: React.FC<DashboardMenuProps> = (props: DashboardMenuProps) => {
  return (
    <Menu isOpen={false}>
      <Tabs
        value={props.activeTab}
        onChange={(evt, value: number) => props.onChange(value)}
        indicatorColor="primary"
        textColor="primary"
        variant="scrollable"
        scrollButtons="auto"
        aria-label="simple tabs example"
      >
        {props.menuItems.map((item, index) => (
          <Tab key={index} label={item} selected={index === props.activeTab} {...a11yProps(index)} />
        ))}
      </Tabs>
    </Menu>
  );
};

export default DashboardMenu;
