/**
 * File:        okta.js
 * 
 * Description: 
 */
import store from '../store/js/index';
import { setSession, expiringSession, expireRedirect, cancelSession } from '../store/actions/index';
import OktaAuth from '@okta/okta-auth-js';
// let OktaAuth = require('@okta/okta-auth-js');



console.log("running auth client..");
// Okta browser SDK AuthClient
var config = {
    issuer: "https://dev-236245.okta.com/oauth2/default",
    clientId: "0oa4lqivbsKPbAtfs4x6", 
    // cleintId: "0oae1w86zaoTFYPr54x6",
    redirectUri: "https://foodcommune.com",
    responseMode: "fragment",
    tokenManager: {
        storage: "sessionStorage"
    },
    // onSessionExpired: function () {
    //     console.log("re-authorization is required");
    //     // authClient.getWithRedirect();
    // }
};

// AUTH CLIENT
let authClient = new OktaAuth(config);


export const session = async () => {
    let options = {
        method: "POST",
        mode: "same-origin",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json"
        }
    };

    fetch("/site/usersession", options)
        .then(res => {
            if (res) return res.json();
        })
        .then(res => {
            if (res.success) {
                tokenExpHandler(res.tokenExpiresAt);
                store.dispatch(setSession({ token: res.token, user: res.user, tokenExpiresAt: res.tokenExpiresAt }));
            }
        })
        .catch(err => {
            console.log(err);
        })
}

export const getToken = async (session) => {
    console.log("GETTOKEN")
    // Check for user session
    if (session) {

        // Request token for API access
        let options = {
            method: "POST",
            mode: "same-origin",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ entity: { login: session.user.profile.login, request: "test" } })
        };

        fetch("/secure", options)
            .then(res => {
                if (res) return res.json();
            })
            .then(res => {
                console.log(res);
                if (res.success) {
                    tokenExpHandler(res.tokenExpiresAt);
                    store.dispatch(setSession({ token: res.token, user: res.user }));
                }
            })
            .catch(err => {
                console.log(err);
            });
    } else {

        // Get provisional site access
        let options = {
            method: "POST",
            mode: "same-origin",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({})
        };
        fetch("/secure/provisional", options)
            .then(res => {
                return res.json();
            })
            .then(res => {
                store.dispatch(setSession({ provisional: res.token }));
            })
            .catch(err => {
                console.log(err)
                store.dispatch(setSession({ provisional: "test token" }));
            })
    }
};

export const signInAuthenticate = async (email, password) => {
    return await authClient
        .signIn({
            username: email,
            password: password
        })
        .catch(err => {
            // this.setState({ errMsg: "Email or password is incorrect!" });
            console.log(err);
            return false;
        })
        .then(res => {
            console.log(res);
            if (res.status === 'SUCCESS') {
                getToken(res);
                return true;
            } else {
                return false;
            }
        })
}

export const signOut = () => {
    // authClient.signOut();
    store.dispatch(cancelSession());
}

function tokenExpHandler(tokenExpiresAt) {
    let currentTime = new Date().getTime() / 1000;
    let expireMin = (tokenExpiresAt - currentTime); // Time token expires

    // Set warning timeout - convert to millisecods
    let expWarning = setTimeout(() => {
        store.dispatch(expiringSession(true));
    }, (expireMin - 60) * 1000);

    // Set timeout for redirect if user doesn't choose to stay signed in
    let logOut = setTimeout(() => {
        window.location.href = "https://foodcommune.com";
    }, expireMin * 1000);

    // Send handler for redirect to store - cancels if user continues session
    store.dispatch(expireRedirect(logOut));
}