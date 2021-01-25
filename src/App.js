import React from 'react';
import GroupsView from './components/GroupsView';
import MyGroupPage from './components/MyGroupPage';
import Catalog from './components/CatalogView';
import Home from './components/Home';
import NavView from './components/NavView';
import DashboardView from './components/DashboardView';
import SignIn from './components/SignIn';
import PasswordReset from './components/PasswordReset';
import { Provider } from "react-redux";
import store from "./store/js/index";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useHistory,
  useParams, HashRouter
} from "react-router-dom";

function App() {
  return (
    <HashRouter>
      <Provider store={store}>

        <div className="" id="nav-view">
          <NavView />
        </div>
        <Switch>
          <Route path="/catalog"><Catalog /></Route>
          <PrivateRoute path="/grouppage/:testa?" testQ="dontgimmi"><MyGroupPage test="gimmi"/></PrivateRoute>
          <PrivateRoute path="/groups"><GroupsView /></PrivateRoute>
          <PrivateRoute path="/dashboard">
            <DashboardView />
          </PrivateRoute>
          <Route path="/signin"><SignIn /></Route>
          <Route path="/passwordreset"><PasswordReset style={{ backgroundColor: "#f7f7f7" }} /></Route>
          <Route path="/"><Home /></Route>
        </Switch>

      </Provider>

    </HashRouter>
  );
}

export default App;

// If user is not signed in redired to home page
function PrivateRoute({ children, path, ref }) {
  let state = store.getState();
  let auth = state.token && state.user ? true : false;

  return auth ? (children) : (<Route>
    <Redirect to={{ pathname: "/signin" }} />
  </Route>)
}