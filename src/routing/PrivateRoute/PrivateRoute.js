import React from "react";
import { Route, Redirect } from "react-router-dom";

const PrivateRoute = ({
    component: Component,
    layout: Layout,
    path,
    cprops,
    ...rest
  }) => {

  const ProtectedRoutes = {
    ISSUE_TICKET: "/issueticket",
    MMS_SCHEDULING: "/adCampaign",
    MANUAL_SCHEDULE: "/mschedule",
    CREATE_AD: "/createAd",
    DASHBOARD: "/dashboard",
    PRODUCTS: "/products",
    SETTINGS: "/settings",
    SIGN_UP: "/sign-up",
    SIGN_IN: "/sign-in",
    ACCOUNT: "/account",
    RELAY_HISTORY: "/relay",
    NOT_FOUND: "/not-found",
  };

  return (
    <Route
      path={path}
      {...rest}
      render={props => (
        <Layout>
          <Component {...cprops} />
        </Layout>
      )}
    />
  );
};

export default PrivateRoute;
