interface IkSystemNameKeys {
  AHV_NUMBER: string;
  BIRTHDATE: string;
  DATE_OF_ISSUE: string;
  FULLNAME: string;
  IK_STATIC_TABLE: string;
  TOTAL: string;
}

export const ikSystemNames: IkSystemNameKeys = {
  AHV_NUMBER: 'AHV_NUMBER',
  BIRTHDATE: 'BIRTHDATE',
  DATE_OF_ISSUE: 'DATE_OF_ISSUE',
  FULLNAME: 'FULLNAME',
  IK_STATIC_TABLE: 'IK_STATIC_TABLE',
  TOTAL: 'TOTAL'
};

interface IkStaticTableKeys {
  SVA_NUMBER: string;
  ACCOUNTING: string;
  INCOME_CODE: string;
  CREDIT_NOTE: string;
  MONTH: string;
  YEAR: string;
  INCOME: string;
  EMPLOYER: string;
  AMMOUNT: string;
}

export const ikStaticTable: IkStaticTableKeys = {
  SVA_NUMBER: 'SVA_NUMBER',
  ACCOUNTING: 'ACCOUNTING',
  INCOME_CODE: 'INCOME_CODE',
  CREDIT_NOTE: 'CREDIT_NODE',
  MONTH: 'MONTH',
  YEAR: 'YEAR',
  INCOME: 'INCOME',
  EMPLOYER: 'EMPLOYER',
  AMMOUNT: 'AMMOUNT'
};

interface PkStaticNameKeys {
  QUALIFYING_DATE: string;
  FULLNAME: string;
  CONTRACT_NUMBER: string;
  AHV_NUMBER: string;
  BIRTHDATE: string;
  LEVEL_OF_EMPLOYMENT: string;
  ANNUAL_SALARY: string;
  INSURED_ANNUAL_SALARY: string;
  INSURED_RISK_SALARY: string;
  INSURED_ANNUAL_SALARY_SAVING: string;
  EXISTING_PENSION_ASSETS: string;
  POSSIBLE_WITHDRAWAL_HOME_OWNERSHIP: string;
  WITHDRAWAL_HOME_OWNERSHIP: string;
  INTEREST_RATE: string;
  POSSIBLE_BUYIN_AMOUNT: string;
  PROJECTED_PENSION_ASSETS_AT_AGE: string;
  PROJECTED_PENSION_ASSETS_AT_ENDAGE: string;
  PROJECTED_ANNUAL_RENT_AT_AGE: string;
  PROJECTED_ANNUAL_RENT_AT_ENDAGE: string;
  DIS_RENT: string;
  DIS_CHILD_RENT: string;
  DIS_WAITING_DURATION: string;
  WIDOW_RENT: string;
  ORPHAN_RENT: string;
  DEATH_CAPITAL: string;
  DEATH_CAPITAL_NO_WIDOW: string;
  GENDER: string;
  RETIREMENT_AGE: string;
}

export const pkStaticName: PkStaticNameKeys = {
  QUALIFYING_DATE: 'QUALIFYING_DATE',
  FULLNAME: 'FULLNAME',
  CONTRACT_NUMBER: 'CONTRACT_NUMBER',
  INSURED_ANNUAL_SALARY_SAVING: 'INSURED_ANNUAL_SALARY_SAVING',
  AHV_NUMBER: 'AHV_NUMBER',
  BIRTHDATE: 'BIRTHDATE',
  LEVEL_OF_EMPLOYMENT: 'LEVEL_OF_EMPLOYMENT',
  ANNUAL_SALARY: 'ANNUAL_SALARY',
  INSURED_ANNUAL_SALARY: 'INSURED_ANNUAL_SALARY',
  INSURED_RISK_SALARY: 'INSURED_RISK_SALARY',
  EXISTING_PENSION_ASSETS: 'EXISTING_PENSION_ASSETS',
  INTEREST_RATE: 'INTEREST_RATE',
  POSSIBLE_BUYIN_AMOUNT: 'POSSIBLE_BUYIN_AMOUNT',
  WITHDRAWAL_HOME_OWNERSHIP: 'WITHDRAWAL_HOME_OWNERSHIP',
  POSSIBLE_WITHDRAWAL_HOME_OWNERSHIP: 'POSSIBLE_WITHDRAWAL_HOME_OWNERSHIP',
  PROJECTED_PENSION_ASSETS_AT_AGE: 'PROJECTED_PENSION_ASSETS_AT_AGE',
  PROJECTED_PENSION_ASSETS_AT_ENDAGE: 'PROJECTED_PENSION_ASSETS_AT_ENDAGE',
  PROJECTED_ANNUAL_RENT_AT_AGE: 'PROJECTED_ANNUAL_RENT_AT_AGE',
  PROJECTED_ANNUAL_RENT_AT_ENDAGE: 'PROJECTED_ANNUAL_RENT_AT_ENDAGE',
  DIS_RENT: 'DIS_RENT',
  DIS_CHILD_RENT: 'DIS_CHILD_RENT',
  DIS_WAITING_DURATION: 'DIS_WAITING_DURATION',
  WIDOW_RENT: 'WIDOW_RENT',
  ORPHAN_RENT: 'ORPHAN_RENT',
  DEATH_CAPITAL: 'DEATH_CAPITAL',
  DEATH_CAPITAL_NO_WIDOW: 'DEATH_CAPITAL_NO_WIDOW',
  GENDER: 'GENDER',
  RETIREMENT_AGE: 'RETIREMENT_AGE'
};

interface PkStaticValueNameKeys {
  ABOVE_BVG: string;
  ACCIDENT: string;
  AGE: string;
  ANNUAL_ACCIDENT: string;
  ANNUAL_ILLNESS: string;
  ANNUAL_RENT: string;
  ANNUAL_RENT_WITH_INT: string;
  ANNUAL_RENT_WITHOUT_INT: string;
  ANNUAL_TOTAL: string;
  BVG: string;
  CHILD_XX: string;
  DATE: string;
  DAYS: string;
  DEFAULT: string;
  ILLNESS: string;
  NUMBER: string;
  PERCENT: string;
  SICKNESS: string;
  TOTAL: string;
  TOTAL_NO_INT: string;
  TOTAL_WITH_INT: string;
  TOTAL_WITHOUT_INT: string;
  XX: string;
}

export const pkStaticValueKeys: PkStaticValueNameKeys = {
  ABOVE_BVG: 'ABOVE_BVG',
  ACCIDENT: 'ACCIDENT',
  AGE: 'AGE',
  ANNUAL_ACCIDENT: 'ANNUAL_ACCIDENT',
  ANNUAL_ILLNESS: 'ANNUAL_ILLNESS',
  ANNUAL_RENT: 'ANNUAL_RENT',
  ANNUAL_RENT_WITH_INT: 'ANNUAL_RENT_WITH_INT',
  ANNUAL_RENT_WITHOUT_INT: 'ANNUAL_RENT_WITHOUT_INT',
  ANNUAL_TOTAL: 'ANNUAL_TOTAL',
  BVG: 'BVG',
  CHILD_XX: 'CHILD_XX',
  DATE: 'DATE',
  DAYS: 'DAYS',
  DEFAULT: 'DEFAULT',
  ILLNESS: 'ILLNESS',
  NUMBER: 'NUMBER',
  PERCENT: 'PERCENT',
  SICKNESS: 'SICKNESS',
  TOTAL: 'TOTAL',
  TOTAL_NO_INT: 'TOTAL_NO_INT',
  TOTAL_WITH_INT: 'TOTAL_WITH_INT',
  TOTAL_WITHOUT_INT: 'TOTAL_WITHOUT_INT',
  XX: 'XX'
};

interface HttpActionsNames {
  GET_DOCSCAN_RESULT: string;
  GET_OPTIN_STATE: string;
  INIT_DOCSCAN: string;
  AWAIT_DOCSCAN_RESULT: string;
  CHECK_DOCSCAN: string;
  REQUEST_USER_DATA: string;
  LOGOUT: string;
  CHANGE_PASSWORD: string;
  CHANGE_EMAIL: string;
  CHANGE_AUTH_TYPE: string;
  LOGIN: string;
  LOGIN_2FA: string;
  RESET_PASSWORD: string;
  SET_NEW_PASSWORD: string;
  CREATE_ACCOUNT: string;
  ACTIVE_ACCOUNT: string;
  DROP_SPECIALIST: string;
  REQUEST_SPECIALIST: string;
  GET_DOSSIER: string;
  UPDATE_DOSSIER: string;
  CLOSE_DOSSIER: string;
  OPT_IN_SPECIALIST: string;
}

export const httpActions: HttpActionsNames = {
  GET_DOCSCAN_RESULT: 'getDocScanResult',
  GET_OPTIN_STATE: 'getOptInState',
  INIT_DOCSCAN: 'initDocScan',
  AWAIT_DOCSCAN_RESULT: 'awaitDocScanResult',
  CHECK_DOCSCAN: 'checkDocScan',
  REQUEST_USER_DATA: 'requestUserData',
  LOGOUT: 'logout',
  CHANGE_PASSWORD: 'changePass',
  CHANGE_EMAIL: 'changeMail',
  CHANGE_AUTH_TYPE: 'changePhoneAndAuth',
  LOGIN: 'login',
  LOGIN_2FA: 'login_2fa',
  RESET_PASSWORD: 'resetPassword',
  SET_NEW_PASSWORD: 'setNewPassword',
  CREATE_ACCOUNT: 'createAccount',
  ACTIVE_ACCOUNT: 'activateAccount',
  DROP_SPECIALIST: 'dropSpecialist',
  REQUEST_SPECIALIST: 'requestSpecialist',
  GET_DOSSIER: 'getDossier',
  UPDATE_DOSSIER: 'updateDossier',
  CLOSE_DOSSIER: 'closeDossier',
  OPT_IN_SPECIALIST: 'optInSpecialist'
};

interface DocumentTypeNames {
  IK: string;
  PK: string;
}

export const documentTypes: DocumentTypeNames = {
  IK: 'IK',
  PK: 'PK'
};

interface ScanSteps {
  SCAN_STEP: string;
  PREVIEW_STEP: string;
  PROCCESSING_STEP: string;
  INVALID_CODE_STEP: string;
  COMPLETE_STEP: string;
}

export const scanSteps: ScanSteps = {
  PREVIEW_STEP: 'preview',
  SCAN_STEP: 'scan',
  PROCCESSING_STEP: 'proccess',
  COMPLETE_STEP: 'complete',
  INVALID_CODE_STEP: 'invalid_code'
};