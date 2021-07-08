import React, { useState } from "react";
import { withAuthenticator } from "@aws-amplify/ui-react";
import Amplify, { Auth } from "aws-amplify";
import "./App.css";
import { BrowserRouter, Route, Switch, NavLink } from "react-router-dom";
import location from "./location.js";
import home from "./home.js";
import Location from "aws-sdk/clients/location";
import awsconfig from "./aws-exports";

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
        <Switch>
          <Route component={home} path="/" exact />
          <Route component={location} path="/locateuser" exact />
        </Switch>
      </div>
    </BrowserRouter>
  );
};

export default withAuthenticator(App);
