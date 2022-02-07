import React from 'react';
import { Redirect, Route } from "react-router-dom";
import { ACCESS_TOKEN_NAME } from '../constants/apiContants';


function PrivateRoute({ children, ...rest }) {
    return (
        <Route
            {...rest}
            render={({ location }) =>
            //checking if access-token is present in the browser’s local storage
                localStorage.getItem(ACCESS_TOKEN_NAME) ? (
            //if token is present then access to requested Component/Route is granted
                    children
                ) : (
            //else redirect user to the login page
                    <Redirect
                        to={{
                            pathname: "/login",
                            state: { from: location }
                        }}
                    />
                )
            }
        />
    );
}

export default PrivateRoute;