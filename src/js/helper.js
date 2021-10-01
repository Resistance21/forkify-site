import { async } from 'regenerator-runtime';
import { TIMEOUT_SEC } from './config';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async (url, uploadData = undefined) => {
  try {
    const fetchSetup = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    const res = await Promise.race([fetchSetup, timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message}, ${res.status}`);
    return data;
  } catch (err) {
    console.log('throwing error');
    throw err;
  }
};

export const getJSON = async url => {
  try {
    return await AJAX(url);
  } catch (err) {
    console.log('throwing error');
    throw err;
  }
};

export const sendJSON = async (url, uploadData) => {
  try {
    return await AJAX(url, uploadData);
  } catch (err) {
    throw err;
  }
};
