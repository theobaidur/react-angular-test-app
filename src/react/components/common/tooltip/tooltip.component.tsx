import React from 'react';
import { Tooltip, ClickAwayListener } from '@material-ui/core';

interface TooltipComponentProps {
  children: any;
  title: React.ReactNode;
  placement?:
    | 'bottom-end'
    | 'bottom-start'
    | 'bottom'
    | 'left-end'
    | 'left-start'
    | 'left'
    | 'right-end'
    | 'right-start'
    | 'right'
    | 'top-end'
    | 'top-start'
    | 'top';
  clickToOpen?: boolean;
}

const TooltipComponent: React.FC<TooltipComponentProps> = ({ title, placement, clickToOpen, ...props }) => {
  const [open, setOpen] = React.useState(false);

  if (!clickToOpen) {
    return (
      <Tooltip interactive enterDelay={300} leaveDelay={100} title={title} placement={placement}>
        {props.children}
      </Tooltip>
    );
  } else {
    return (
      <ClickAwayListener onClickAway={() => setOpen(false)}>
        <Tooltip
          disableFocusListener
          disableHoverListener
          disableTouchListener
          title={title}
          placement={placement}
          onClick={() => setOpen(true)}
          open={open}
        >
          {props.children}
        </Tooltip>
      </ClickAwayListener>
    );
  }
};

export default TooltipComponent;
