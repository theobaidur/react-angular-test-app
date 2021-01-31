import { createMuiTheme } from '@material-ui/core';
import { MuiPickersOverrides } from '@material-ui/pickers/typings/overrides';
import { KFormFieldTheme as f } from '../components/KForm/KForm_theming';
import { assetColors } from './themes/moneto/assets';

type overridesNameToClassKey = { [P in keyof MuiPickersOverrides]: keyof MuiPickersOverrides[P] };

declare module '@material-ui/core/styles/overrides' {
  export interface ComponentNameToClassKey extends overridesNameToClassKey {}
}
const muiTheme: any = createMuiTheme({
  overrides: {
    MuiTabs: {
      indicator: {
        backgroundColor: assetColors.activeBlue,
        height: '6px'
      },
      flexContainer: {
        height: '100%'
      },
      root: {
        height: '100%'
      }
    },
    MuiTab: {
      textColorPrimary: {
        '&$selected': {
          color: 'white'
        },
        minWidth: '200px',
        color: 'white'
      },
      wrapper: { fontSize: '16px' },
      root: {
        background: '#a7b6bc',
        fontFamily: 'Roboto condensed',
        '&$selected': {
          color: 'white',
          background: assetColors.miamiBlue
        }
      }
    },
    MuiTooltip: {
      tooltip: {
        padding: '2px 6px'
      },
      tooltipPlacementBottom: {
        margin: '7px  !important'
      }
    },
    MuiPickersToolbar: {
      toolbar: {
        backgroundColor: f.labelFocused
      }
    },
    MuiPickersDay: {
      daySelected: {
        backgroundColor: f.labelFocused,
        '&:hover': {
          backgroundColor: f.labelFocused
        }
      },
      current: {
        color: f.labelFocused
      }
    },
    MuiPickersYear: {
      yearSelected: {
        color: f.labelFocused
      }
    },
    MuiPickersClock: {
      pin: {
        backgroundColor: f.labelFocused
      }
    },
    MuiPickersClockNumber: {
      clockNumber: {
        zIndex: 2,
        '&:hover': {
          backgroundColor: f.labelFocused,
          color: 'white'
        }
      },
      clockNumberSelected: {
        backgroundColor: f.labelFocused,
        color: 'white'
      }
    },
    MuiPickersClockPointer: {
      pointer: {
        backgroundColor: f.labelFocused
      },
      thumb: {
        backgroundColor: f.labelFocused
      },
      noPoint: {
        borderColor: f.labelFocused
      }
    }
  }
});

export default muiTheme;
