import { assetColors as c } from './assets';
import { assetFonts as f } from './assets';
import { Theme_Props } from '../../theming';

export const theme : Theme_Props = {
    fonts: {
        header: f.condensed,
        heading1: f.normal,
        heading2: f.condensed,
        heading3: f.normal,
        text: f.condensed,	  
        button: f.condensed,
        tabs: f.condensed,
        input: f.condensed,
    },
    general: {
        text: c.spaceGray,
        textStrong: c.black,
        textLink: c.activeBlue
    },
    help: {
        text: c.spaceGray,
        textStrong: c.vaderGray
    },
    
    button: {
        primary: c.activeBlue,		
        special: c.mGradient,
        disabled: c.platinGray,
        text: c.white
    },
        
    header: {
        background: c.vaderGray,
        foreground: c.iceWhite,
        active: c.activeBlue,
        soft: c.spaceGray
    },
    
    footer: {
        background: c.vaderGray,
        foreground: c.spaceGray,
        active: c.iceWhite
    },
        
    landing: {
        hero: {
            heading: c.white,
        },
        main: {
            background: c.monetoWhite,
            heading: c.vaderGray,
            text: c.vaderGray,
            boxHeading: c.activeBlue,
            boxBorder: c.silverGray,		
            boxSoft: c.monetoWhite,
            boxStrong: c.white
        },
        info: {
            background: c.white,
            heading: c.activeBlue,			
            icon: c.activeBlue,
        }
    },

    dashboard: {
        hero: {
            heading: c.white,
            text: c.white,
            icon: c.white,
            iconBackground: c.activeBlue,
            iconBackgroundAlarm: c.volcanoRed,
            IconBackgroundFallback: c.white,			
        },
        tab: {
            focusBackground: c.miamiBlue,
            focusForeground: c.white,
            activeBackground: c.miamiBlueSoft,
            activeForeground: c.white,
            primaryBackground: c.monetoWhite,
            primaryForeground: c.miamiBlue,
            disabledBackground: c.monetoWhite,
            disabledForeground: c.platinGray
        },
        tabArea: {
            heading: c.vaderGray,
            description: c.miamiBlue,
            background: c.monetoWhite,
            appStarterHeading: c.vaderGray,
            appStarterBackground: c.white,
            appStarterBorder: c.silverGray,
            progressPrimary: c.miamiBlue,
            progressSecondary: c.iceBlue,
            progressTertiary: c.white
        }
    },
    module: {
        background: c.monetoWhite, 
        heading: c.vaderGray,
    },
    
    bullet: {
        active: c.mGradient,
        primary: c.silverGray,
        valid: c.checkGreen,
        invalid: c.volcanoRed
    },
    
    card: {
        background: c.white,
        border: c.silverGray,
        blockBorder: c.iceBlue,
        alternativeBackground: c.miamiBlue,
        indicatorBackground: c.volcanoRed,
        indicatorForeground: c.white,			
        helpBarBackground: c.activeBlue,
        helpBarForeground: c.babyBlue			
    },
    
    card_valid: {
        border: c.checkGreen,
        indicatorBackground: c.checkGreen,
        indicatorForeground: c.white,			
    },
    
    card_approved_invalid: {
        indicatorBackground: c.volcanoRed,			
        indicatorForeground: c.volcanoRed,			
    },
    
    card_approved_valid: {
        text: c.platinGray,
        editIcon: c.activeBlue,
        indicatorBackground: c.checkGreen,
        indicatorForeground: c.white,			
    },

    analyzer:{
        diagramBackground: c.iceWhite,
        diagramBorder: c.silverGray,
        diagramYAxis: c.platinGray,
        diagramXAxis: c.vaderGray,
        diagramLabel: c.white,
        diagramCheck: c.checkGreen,
        diagramIncome: c.platinGray,
        diagramNeed: c.needRed,
        diagramPillarFirst: c.pillarFirst,
        diagramPillarFirstChild: c.pillarFirstChild,
        diagramPillarSecond: c.pillarSecond,
        diagramPillarSecondChild: c.pillarSecondChild,
        diagramPillarThird: c.white    

    }
};


export default theme;