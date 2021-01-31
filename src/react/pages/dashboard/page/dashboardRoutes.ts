import boat from '../assets/symb_Boat.svg';
import ahvPk from '../assets/symb_AHV-PK.svg';
import candle from '../assets/symb_Candle.svg';
import ivKtg from '../assets/symb_IV-KTG.svg';
import doctor from '../assets/symb_Doctor.svg';
import q from '../assets/symb_Q.svg';
import i18next from 'i18next';

class Application {
  constructor(name: string, chart: any, img: any, url: string) {
    this.chartImg = chart;
    this.name = name;
    this.logoImg = img;
    this.url = url;
  }
  name: string = 'name';
  description: string = 'description';
  done: string = 'done';
  buttonText: string = 'buttonText';
  progress: string = 'progress';
  url: string = '';
  chartImg: any;
  logoImg: any;
}

class DashboardRoute {
  constructor(applications: Array<Application>) {
    this.applications = applications;
  }
  menuName: string = 'menuName';
  fullName: string = 'fullName';
  description: string = 'description';
  applications: Array<Application> = [];
}

export const routes = [
  new DashboardRoute([
    new Application('pensionPlaning', ahvPk, boat, i18next.t('routes:pension-plan')),
    new Application('disabilityPlaning', ivKtg, doctor, i18next.t('routes:disability-plan')),
    new Application('leftBehindPlaning', q, candle, i18next.t('routes:leftbehind-plan'))
  ]),
  new DashboardRoute([
    new Application('pensionPlaning', ahvPk, boat, i18next.t('routes:pension-plan')),
    new Application('disabilityPlaning', ivKtg, doctor, i18next.t('routes:disability-plan')),
    new Application('leftBehindPlaning', q, candle, i18next.t('routes:leftbehind-plan'))
  ])
];
