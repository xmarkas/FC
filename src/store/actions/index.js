import {
  OKTA_SESSION, SET_SESSION, EXPIRING_SESSION, EXPIRE_REDIRECT, CANCEL_SESSION
} from "../constants/action-types";


export function oktaSession() {
  return { type: OKTA_SESSION }
};

export function setSession(payload) {
  return { type: SET_SESSION, payload }
};

export function expiringSession(payload) {
  return { type: EXPIRING_SESSION, payload }
}

export function expireRedirect(payload) {
  return { type: EXPIRE_REDIRECT, payload }
}

export function cancelSession(payload) {
  return { type: CANCEL_SESSION, payload };
}