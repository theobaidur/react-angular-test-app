export interface SubRoute {
  keyName: string;
  description: string;
}
export interface Route {
  keyName: string;
  isHighlighted?: boolean;
  subRoutes?: Array<SubRoute>;
}

export const helpRoutes: Array<Route> = [
  {
    keyName: 'about',
    isHighlighted: false
  },
  {
    keyName: 'partner',
    isHighlighted: false
  },
  {
    keyName: 'support',
    isHighlighted: false
  },
  {
    keyName: 'imprint',
    isHighlighted: false
  }
];

export const unAuthorizedRoutes: Array<Route> = [
  {
    keyName: 'login'
  },
  {
    keyName: 'register'
  }
];

export const authorizedRoutes: Array<Route> = [
  {
    keyName: 'preventivePlan',
    subRoutes: [
      { keyName: 'pension-plan', description: 'AHV- & Pensionskassen-Renten berechnen' },
      { keyName: 'disability-plan', description: 'IV-Rente & Lohnfortzahlung berechen' },
      { keyName: 'leftbehind-plan', description: 'Wie ist meine Familie abgesichert' }
    ]
  },
  {
    keyName: 'more'
  }
  /*{
    to: '/versicherung',
    keyName: 'versicherung'
  },
  {
    to: '/immobilien',
    keyName: 'immobilien'
  },
  {
    to: '/profil',
    keyName: 'profile'
  },
  {
    to: '/account',
    keyName: 'account'
  }
  */
];
