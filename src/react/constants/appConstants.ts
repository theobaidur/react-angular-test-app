interface AppConstants {
  DATE_FORMAT: string;
  TIME_FORMAT: string;
  FORMAT: string;
  EXTENSION: string;
  NUMBER_REPLACE_REGEX: RegExp;
  NUMBER_REPLACE_CHARACTER: string;
  PHONE_SHORT_FORMAT_MASK: Array<RegExp | string>;
  PHONE_LONG_FORMAT_MASK: Array<RegExp | string>;
}

const AppConstants: AppConstants = {
  DATE_FORMAT: 'DD.MM.YYYY',
  TIME_FORMAT: 'HH:mm',
  FORMAT: 'image/jpeg',
  EXTENSION: 'jpeg',
  NUMBER_REPLACE_REGEX: /\B(?=(\d{3})+(?!\d))/g,
  NUMBER_REPLACE_CHARACTER: '`',
  PHONE_LONG_FORMAT_MASK: [
    /\+/,
    /[4]/,
    /[1]/,
    ' ',
    /\d/,
    /\d/,
    ' ',
    /\d/,
    /\d/,
    /\d/,
    ' ',
    /\d/,
    /\d/,
    ' ',
    /\d/,
    /\d/
  ],
  PHONE_SHORT_FORMAT_MASK: [/\d|\+/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, ' ', /\d/, /\d/]
};

export default AppConstants;
