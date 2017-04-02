import React from 'react';
import fetch from 'isomorphic-fetch';
import { polyfill } from 'es6-promise';

const defaultHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

export function loadAuthToken() {
  return localStorage.getItem('phoenixAuthToken');
}

export function removeAuthToken() {
  localStorage.removeItem('phoenixAuthToken');
}

export function setAuthToken(token) {
  localStorage.setItem('phoenixAuthToken', token);
}

export function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

function buildHeaders() {
  return { ...defaultHeaders, Authorization: loadAuthToken() };
}

export function parseJSON(response) {
  return response.json();
}

export function httpDelete(url) {
  return fetch(url, {
    method: 'delete',
    headers: buildHeaders(),
  })
  .then(checkStatus)
  .then(parseJSON);
}

export function httpGet(url) {
  return fetch(url, {
    method: 'get',
    headers: buildHeaders(),
  })
  .then(checkStatus)
  .then(parseJSON);
}

export function httpPostFormData(url, data) {
  const headers = {
    Authorization: loadAuthToken(),
    Accept: 'application/json',
  };

  const formData = new FormData();
  for (const key in data) {
    formData.append(key, data[key]);
  }

  return fetch(url, {
    method: 'post',
    headers,
    body: formData,
  })
  .then(checkStatus)
  .then(parseJSON);
}

export function httpPost(url, data) {
  const headers = {
    Authorization: loadAuthToken(),
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  const body = JSON.stringify(data);

  return fetch(url, {
    method: 'post',
    headers,
    body,
  })
  .then(checkStatus)
  .then(parseJSON);
}

export function setDocumentTitle(title) {
  document.title = `${title}`;
}

export function renderErrorsFor(errors, ref) {
  if (!errors) return false;

  return errors.map((error, i) => {
    if (error[ref]) {
      return (
        <div key={i} className="error">
          {error[ref]}
        </div>
      );
    }
  });
}

export function absoluteUrlForPost(post) {
  return `${window.location.origin}/${post.slug}`;
}

export function requestLocation() {
  const options = {
    enableHighAccuracy: true,
    timeout: 1000,
    maximumAge: 0,
  };

  return new Promise((resolve, reject) => {
    const success = coords => resolve(coords);
    const error = error => reject(error);
    navigator.geolocation.getCurrentPosition(success, error, options);
  });
}
