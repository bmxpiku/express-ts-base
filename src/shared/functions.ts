import logger from './Logger';

export const pErr = (err: Error) => {
  if (err) {
    logger.error(err);
  }
};

export const getRandomInt = () => Math.floor(Math.random() * 1_000_000_000_000);

export const buildURLQuery = (obj: any) => Object.entries(obj)
// @ts-ignore
  .map((pair) => pair.map(encodeURIComponent).join('='))
  .join('&');

export function updatePath(path: string, options: { replaceItems: { [x: string]: string; }; }) {
  if (!options.replaceItems || Object.keys(options.replaceItems).length === 0) {
    return path;
  }
  return Object.keys(options.replaceItems).reduce((replacedUrl, key) => {
    const regExp = new RegExp(key, 'g');
    return replacedUrl.replace(regExp, options.replaceItems[key]);
  }, path);
}

export function normalizeUrl(originalStringsArray: string[]): string {
  const stringsArray = originalStringsArray;
  const resultArray = [];
  if (stringsArray.length === 0) {
    return '';
  }

  if (typeof stringsArray[0] !== 'string') {
    throw new TypeError(`Url must be a string. Received ${stringsArray[0]}`);
  }

  // If the first part is a plain protocol, we combine it with the next part.
  if (stringsArray[0].match(/^[^/:]+:\/*$/) && stringsArray.length > 1) {
    const first = stringsArray.shift();
    stringsArray[0] = first + stringsArray[0];
  }

  // There must be two or three slashes in the file protocol, two slashes in anything else.
  if (stringsArray[0].match(/^file:\/\/\//)) {
    stringsArray[0] = stringsArray[0].replace(/^([^/:]+):\/*/, '$1:///');
  } else {
    stringsArray[0] = stringsArray[0].replace(/^([^/:]+):\/*/, '$1://');
  }

  for (let i = 0; i < stringsArray.length; i += 1) {
    let component = stringsArray[i];

    if (typeof component !== 'string') {
      throw new TypeError(`Url must be a string. Received ${component}`);
    }

    if (component !== '') {
      if (i > 0) {
        // Removing the starting slashes for each component but the first.
        component = component.replace(/^[/]+/, '');
      }
      if (i < stringsArray.length - 1) {
        // Removing the ending slashes for each component but the last.
        component = component.replace(/[/]+$/, '');
      } else {
        // For the last component we will combine multiple slashes to a single one.
        component = component.replace(/[/]+$/, '/');
      }

      resultArray.push(component);
    }
  }

  let str = resultArray.join('/');
  // Each input component is now separated by a
  // single slash except the possible first plain protocol part.

  // remove trailing slash before parameters or hash
  str = str.replace(/\/(\?|&|#[^!])/g, '$1');

  // replace ? in parameters with &
  const parts = str.split('?');
  str = parts.shift() + (parts.length > 0 ? '?' : '') + parts.join('&');

  return str;
}
