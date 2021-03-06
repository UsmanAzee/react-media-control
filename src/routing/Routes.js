import React from "react";
import { Switch, Redirect } from "react-router-dom";
import { PrivateRoute } from './PrivateRoute';
import { Main as MainLayout } from "../layout";

import {
  Test as TestView,
  PrinterDemo as PrinterDemoView,
  NotFound as NotFoundView
} from "../views";

const Routes = () => {
    return (
      <Switch>
        <Redirect exact from="/" to="/test" />

        <PrivateRoute
          component={TestView}
          exact
          layout={MainLayout}
          path="/test"
        />

        <PrivateRoute
          component={PrinterDemoView}
          exact
          layout={MainLayout}
          path="/printer-demo"
        />
        
        <PrivateRoute
          component={NotFoundView}
          exact
          layout={MainLayout}
          path="/not-found"
        />

        <Redirect to="/not-found" />
      </Switch>
    );
};

export default Routes;
