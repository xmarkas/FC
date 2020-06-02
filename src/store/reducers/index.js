/**
 *  FOOD COMMUNE REDUX STORE - REDUCER
 * 
 */
import { session, getToken } from '../../util/okta';

const initialState = {
    user: null,
    provisional: null,
    token: null,
    sessionExists: null,
    tokenExpiresAt: null,
    expiringSession: false,
    expireRedirect: null

};

function rootReducer(state = initialState, action) {
    if (Object.keys(reducers).includes(action.type)) {
        return reducers[action.type](state, action.payload);
    } else {
        return state;
    }
};

let reducers = {};

reducers.SET_SESSION = (state, tokenInfo) => {
    if (tokenInfo.provisional) {
        return { ...state, provisional: tokenInfo.provisional };
    } else {
        return { ...state, user: tokenInfo.user, token: tokenInfo.token, tokenExpiresAt: tokenInfo.tokenExpiresAt, expiringSession: false };
    }
}

reducers.EXPIRING_SESSION = (state, payload) => {
    return { ...state, expiringSession: payload };
}

reducers.EXPIRE_REDIRECT = (state, payload) => {
    if (state.expireRedirect) clearTimeout(state.expireRedirect);
    return { ...state, expireRedirect: payload };
}

reducers.CANCEL_SESSION = (state, payload) => {
    if (state.expireRedirect) clearTimeout(state.expireRedirect);
    return { ...state, user: null, token: null, sessionExists: null, expiringSession: false };
}

reducers.DIALPAD_SHOW = (state, payload) => {
    let toggle = state.UI.dialPadShow ? false : true;
    let dialPadShow = payload === "toggle" ? toggle : payload;
    let UI = { ...state.UI, dialPadShow: dialPadShow };
    return { ...state, UI }
}


export default rootReducer;