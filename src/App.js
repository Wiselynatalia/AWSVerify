import React from "react";
import { withAuthenticator } from "@aws-amplify/ui-react";
import Amplify from "aws-amplify";
import "./App.css";
import { BrowserRouter, Route, Switch, NavLink } from "react-router-dom";
import location from "./location.js";
import home from "./home.js";
import result from "./success.js";
import awsconfig from "./aws-exports";
import fail from "./fail.js";

Amplify.configure(awsconfig);
const App = () => {
  return (
    <BrowserRouter>
      <div className="Background">
        <div className="Header">
          <div className="H1">AWS </div>
          <div className="H2">Verify</div>
        </div>
        <div className="bar"> </div>
        <NavLink to="/" exact></NavLink>
        <NavLink to="/locateuser"></NavLink>
        <NavLink to="/success"></NavLink>
        <Switch>
          <Route component={home} path="/" exact />
          <Route component={location} path="/locateuser" exact />
          <Route component={result} path="/success" exact />
          <Route component={fail} path="/fail" exact />
        </Switch>
      </div>
    </BrowserRouter>
  );
};

export default withAuthenticator(App);
