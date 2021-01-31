import React, { useState, useCallback } from 'react';
import moment from 'moment';
import { useTranslation } from 'react-i18next';

export default class SimpleValidator {
  validationResults: any;
  visibleFields: Array<Object>;
  errorMessages: any;
  messagesShown: boolean;
  rules: Object;
  element: any;
  messages: any;
  autoForceUpdate: boolean;
  className: string;
  setMessageShown: Function;
  forceUpdate: Function;
  onValidationResult?: Function;

  constructor(options: any = {}) {
    this.validationResults = {};
    this.visibleFields = [];
    this.errorMessages = {};
    [this.messagesShown, this.setMessageShown] = useState(false);
    this.messagesShown = false;
    const [, updateState] = React.useState<any>();
    this.forceUpdate = useCallback(() => updateState({}), []);
    const { t } = useTranslation('validator');

    this.rules = {
      accepted: { message: t('message.accepted'), rule: (val: boolean) => val === true, required: true },
      after: {
        message: t('message.after'),
        rule: (val: string, params: Array<any>) =>
          this.helpers.momentInstalled() &&
          moment.isMoment(moment(val, params[1])) &&
          moment(val, params[1]).isAfter(moment(params[0], params[1]), 'day'),
        messageReplace: (message: string, params: Array<any>) => message.replace(':date', params[0])
      },
      after_or_equal: {
        message: t('message.after_or_equal'),
        rule: (val: string, params: Array<any>) =>
          this.helpers.momentInstalled() &&
          moment.isMoment(moment(val, params[1])) &&
          moment(val, params[1]).isSameOrAfter(moment(params[0], params[1]), 'day'),
        messageReplace: (message: string, params: Array<any>) => message.replace(':date', params[0])
      },
      alpha: {
        message: t('message.alpha'),
        rule: (val: any) => this.helpers.testRegex(val, /^[A-Z]*$/i)
      },
      alpha_space: {
        message: t('message.alpha_space'),
        rule: (val: any) => this.helpers.testRegex(val, /^[A-Z\s]*$/i)
      },
      alpha_num: {
        message: t('message.alpha_num'),
        rule: (val: any) => this.helpers.testRegex(val, /^[A-Z0-9]*$/i)
      },
      alpha_num_space: {
        message: t('message.alpha_num_space'),
        rule: (val: any) => this.helpers.testRegex(val, /^[A-Z0-9\s]*$/i)
      },
      alpha_num_dash: {
        message: t('message.alpha_num_dash'),
        rule: (val: any) => this.helpers.testRegex(val, /^[A-Z0-9_-]*$/i)
      },
      alpha_num_dash_space: {
        message: t('message.alpha_num_dash_space'),
        rule: (val: any) => this.helpers.testRegex(val, /^[A-Z0-9_-\s]*$/i)
      },
      array: { message: t('message.array'), rule: (val: any) => Array.isArray(val) },
      before: {
        message: t('message.before'),
        rule: (val: string, params: Array<any>) =>
          this.helpers.momentInstalled() &&
          moment.isMoment(moment(val, params[1])) &&
          moment(val, params[1]).isBefore(moment(params[0], params[1]), params[2]),
        messageReplace: (message: string, params: Array<any>) => message.replace(':date', params[0])
      },
      before_or_equal: {
        message: t('message.before_or_equal'),
        rule: (val: string, params: Array<any>) =>
          this.helpers.momentInstalled() &&
          moment.isMoment(moment(val, params[1])) &&
          moment(val, params[1]).isSameOrBefore(moment(params[0], params[1]), params[2]),
        messageReplace: (message: string, params: Array<any>) => message.replace(':date', params[0])
      },
      between: {
        message: t('message.between'),
        rule: (val: number, params: Array<any>) =>
          this.helpers.size(val.toString(), params[2]) >= parseFloat(params[0]) &&
          this.helpers.size(val.toString(), params[2]) <= parseFloat(params[1]),
        messageReplace: (message: string, params: Array<any>) =>
          message
            .replace(':min', params[0])
            .replace(':max', params[1])
            .replace(':type', this.helpers.sizeText(params[2]))
      },
      boolean: { message: t('message.boolean'), rule: (val: any) => val === false || val === true },
      card_exp: {
        message: t('message.card_exp'),
        rule: (val: any) => this.helpers.testRegex(val, /^(([0]?[1-9]{1})|([1]{1}[0-2]{1}))\s?\/\s?(\d{2}|\d{4})$/)
      },
      card_num: {
        message: t('message.card_num'),
        rule: (val: any) => this.helpers.testRegex(val, /^\d{4}\s?\d{4,6}\s?\d{4,5}\s?\d{0,8}$/)
      },
      currency: {
        message: t('message.currency'),
        rule: (val: any) => this.helpers.testRegex(val, /^\$?(\d{1,3})(,?\d{3})*\.?\d{0,2}$/)
      },
      date: {
        message: t('message.date'),
        rule: (val: string, params: Array<any>) =>
          this.helpers.momentInstalled() && moment.isMoment(moment(val, params[0]))
      },
      date_equals: {
        message: t('message.date_equals'),
        rule: (val: string, params: Array<any>) =>
          this.helpers.momentInstalled() &&
          moment.isMoment(moment(val, params[1])) &&
          moment(val, params[1]).isSame(moment(params[0], params[1]), 'day'),
        messageReplace: (message: string, params: Array<any>) => message.replace(':date', params[0])
      },
      email: {
        message: t('message.email'),
        rule: (val: any) => this.helpers.testRegex(val, /^[A-Z0-9.!#$%&'*+-/=?^_`{|}~]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i)
      },
      in: {
        message: t('message.in'),
        rule: (val: any, params: Array<any>) => params.indexOf(val.toString()) > -1,
        messageReplace: (message: string, params: Array<any>) =>
          message.replace(':values', this.helpers.toSentence(params))
      },
      integer: {
        message: t('message.integer'),
        rule: (val: number) => this.helpers.testRegex(val, /^\d*$/)
      },
      max: {
        message: t('message.max'),
        rule: (val: any, params: Array<any>) => this.helpers.size(val, params[1]) <= parseFloat(params[0]),
        messageReplace: (message: any, params: Array<any>) =>
          message.replace(':max', params[0]).replace(':type', this.helpers.sizeText(params[1]))
      },
      min: {
        message: t('message.min'),
        rule: (val: any, params: Array<any>) => this.helpers.size(val, params[1]) >= parseFloat(params[0]),
        messageReplace: (message: string, params: Array<any>) =>
          message.replace(':min', params[0]).replace(':type', this.helpers.sizeText(params[1]))
      },
      not_in: {
        message: t('message.not_in'),
        rule: (val: any, params: Array<any>) => params.indexOf(val) === -1,
        messageReplace: (message: string, params: Array<any>) =>
          message.replace(':values', this.helpers.toSentence(params))
      },
      not_regex: {
        message: t('message.not_regex'),
        rule: (val: string, params: Array<any>) =>
          !this.helpers.testRegex(
            val,
            typeof params[0] === 'string' || params[0] instanceof String ? new RegExp(params[0] as string) : params[0]
          )
      },
      numeric: { message: t('message.numeric'), rule: (val: any) => this.helpers.numeric(val) },
      phone: {
        message: t('message.phone'),
        rule: (val: any) =>
          this.helpers.testRegex(val, /^(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)?$/)
      },
      regex: {
        message: t('message.regex'),
        rule: (val: any, params: Array<any>) =>
          this.helpers.testRegex(
            val,
            typeof params[0] === 'string' || params[0] instanceof String ? new RegExp(params[0] as string) : params[0]
          )
      },
      required: {
        message: t('message.required'),
        rule: (val: any) => {
          return !this.helpers.isBlank(val);
        },
        required: true
      },
      size: {
        message: t('message.size'),
        rule: (val: any, params: Array<any>) => this.helpers.size(val, params[1]) === parseFloat(params[0]),
        messageReplace: (message: string, params: Array<any>) =>
          message.replace(':size', params[0]).replace(':type', this.helpers.sizeText(params[1]))
      },
      string: { message: t('message.string'), rule: (val: any) => typeof val === typeof 'string' },
      typeof: {
        message: t('message.typeof'),
        rule: (val: any, params: Array<any>) => typeof val === typeof params[0],
        messageReplace: (message: string, params: Array<any>) => message.replace(':type', typeof params[0])
      },
      valid_date: {
        message: t('message.date_valid'),
        rule: (val: any, params: Array<any>) => !val || moment(val, params[0]).isValid()
      },
      url: {
        message: t('message.url'),
        rule: (val: any) => this.helpers.testRegex(val, /^(https?|ftp):\/\/(-\.)?([^\s/?.#-]+\.?)+(\/[^\s]*)?$/i)
      },
      password: {
        message: t('message.password'),
        rule: (val: any) => this.helpers.testRegex(val, /^((?=.*\d)(?=.*[a-z])(?=.*[A-Z])).{8,}$/),
        required: true
      },
      required_or_zero: {
        message: t('message.required_or_zero'),
        rule: (val: any) => {
          return !this.helpers.isBlank(val) && !isNaN(Number(val));
        },
        required: true
      },
      ...(options && options.validators ? options.validators : {})
    };

    // apply default options
    this.messages = options && options.messages ? options.messages : {};
    this.className = options && options.className ? options.className : '';
    this.autoForceUpdate = (options && options.autoForceUpdate) || false;

    // apply default element
    this.element = (message: string) =>
      React.createElement('div', { className: this.className || 'srv-validation-message' }, message);
  }

  getErrorMessages() {
    return this.errorMessages;
  }

  showMessages() {
    this.setMessageShown(true);
    this.helpers.forceUpdateIfNeeded();
  }

  hideMessages() {
    this.messagesShown = false;
    this.helpers.forceUpdateIfNeeded();
  }

  showMessageFor(field: string) {
    this.visibleFields.push(field);
    this.helpers.forceUpdateIfNeeded();
  }

  hideMessageFor = (field: string) => {
    const index = this.visibleFields.indexOf(field);
    if (index > -1) {
      this.visibleFields.splice(index, 1);
    }
    this.helpers.forceUpdateIfNeeded();
  };

  allValid() {
    for (let key in this.validationResults) {
      if (this.fieldValid(key) === false) {
        return false;
      }
    }
    return true;
  }

  fieldValid(field: string) {
    return this.validationResults.hasOwnProperty(field) && this.validationResults[field] === true;
  }

  purgeFields() {
    this.validationResults = {};
    this.errorMessages = {};
  }

  messageWhenPresent(message: string, options?: any) {
    if (!this.helpers.isBlank(message) && this.messagesShown) {
      return this.helpers.element(message, options);
    }
  }

  message(field: string, fieldName: string, inputValue: any, validations: string | Array<string>, options: any = {}) {
    this.errorMessages[field] = null;
    this.validationResults[fieldName] = true;
    if (!Array.isArray(validations)) {
      validations = validations.split('|');
    }
    var rules = options && options.validators ? { ...this.rules, ...options.validators } : this.rules;
    for (let validation of validations) {
      let [value, rule, params] = this.helpers.normalizeValues(inputValue, validation);
      if (!this.helpers.passes(rule, value, params, rules)) {
        this.validationResults[fieldName] = false;
        let message = this.helpers.message(rule, field, options, rules);

        if (params.length > 0 && rules[rule].hasOwnProperty('messageReplace')) {
          message = rules[rule].messageReplace(message, params);
        }

        this.errorMessages[field] = message;
        if (this.messagesShown || this.visibleFields.includes(field)) {
          if (this.onValidationResult) {
            this.onValidationResult(this.allValid());
          }
          return this.helpers.element(message, options);
        }
      }
    }
    if (this.onValidationResult) {
      this.onValidationResult(this.allValid());
    }
  }

  helpers = {
    parent: this,

    passes(rule: string, value: any, params: Array<any>, rules: any) {
      if (!rules.hasOwnProperty(rule)) {
        console.error(`Rule Not Found: There is no rule with the name ${rule}.`);
        return true;
      }
      if (!this.isRequired(rule, rules) && this.isBlank(value)) {
        return true;
      }
      return rules[rule].rule(value, params, this.parent) !== false;
    },

    isRequired(rule: string, rules: any) {
      return rules[rule].hasOwnProperty('required') && rules[rule].required;
    },

    isBlank(value: any) {
      return typeof value === 'undefined' || value === null || value === '' || value.length === 0;
    },

    normalizeValues(value: any, validation: any) {
      return [this.valueOrEmptyString(value), this.getValidation(validation), this.getOptions(validation)];
    },

    getValidation(validation: string) {
      if (validation === Object(validation) && !!Object.keys(validation).length) {
        return Object.keys(validation)[0];
      } else {
        return validation.split(':')[0];
      }
    },

    getOptions(validation: string) {
      if (validation === Object(validation) && !!Object.values(validation).length) {
        let params = Object.values(validation)[0];
        return Array.isArray(params) ? params : [params];
      } else {
        let parms = validation.split(':');
        return parms.length > 1 ? parms[1].split(',') : [];
      }
    },

    valueOrEmptyString(value: any) {
      return typeof value === 'undefined' || value === null ? '' : value;
    },

    toSentence(arr: Array<any>) {
      return (
        arr.slice(0, -2).join(', ') +
        (arr.slice(0, -2).length ? ', ' : '') +
        arr.slice(-2).join(arr.length > 2 ? ', or ' : ' or ')
      );
    },

    testRegex(value: any, regex: RegExp) {
      return value.toString().match(regex) !== null;
    },

    forceUpdateIfNeeded() {
      if (this.parent.autoForceUpdate) {
      }
    },

    message(rule: any, field: string, options: any = {}, rules: any) {
      options.messages = options && options.messages ? options.messages : {};
      let message =
        options.messages[rule] ||
        options.messages.default ||
        this.parent.messages[rule] ||
        this.parent.messages.default ||
        rules[rule].message;
      return message.replace(':attribute', this.humanizeFieldName(field));
    },

    humanizeFieldName(field: string) {
      // supports snake_case or camelCase
      return field
        .replace(/([A-Z])/g, ' $1')
        .replace(/_/g, ' ')
        .toLowerCase();
    },

    element(message: string, options: any = {}) {
      var element = options.element || this.parent.element;
      let msg = message.trim();
      return element(msg[0].toUpperCase() + msg.slice(1), options.className);
    },

    numeric(val: any) {
      return this.testRegex(val, /^(\d+.?\d*)?$/);
    },

    momentInstalled() {
      return true;
    },

    size(val: any, type: any) {
      // if an array or string get the length, else return the value.
      if (type === 'string' || type === undefined || type === 'array') {
        return val.length;
      } else if (type === 'num') {
        return parseFloat(val);
      }
    },

    sizeText(type: any) {
      if (type === 'string' || type === undefined) {
        return ' characters';
      } else if (type === 'array') {
        return ' elements';
      } else {
        return '';
      }
    }
  };
}
