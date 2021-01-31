function dateFromString(str: string | Date) {
  if (str instanceof Date) return str;
  // Format ex. 01.01.1990 / 01.1990
  if (str && str.indexOf('.') > -1) {
    const arr = str.split('.');
    const newStr = (arr[2] ? arr[2] : '') + '-' + arr[1] + '-' + arr[0];
    return new Date(newStr);
  }
  // Format ex. 1990
  else {
    return new Date(str);
  }
}

export default dateFromString;
