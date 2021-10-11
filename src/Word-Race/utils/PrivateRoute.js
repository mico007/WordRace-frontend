import React from 'react';
import { Redirect, Route } from "react-router-dom";

function ProtectedRoute({ component: Component, ...restOfProps }) {

    const storedData = JSON.parse(localStorage.getItem('playerData'));
    return (
        <Route
            {...restOfProps}
            render={(props) =>
                storedData && storedData.token ? <Component {...props} /> : <Redirect to="/register" />
            }
        />
    );
}

export default ProtectedRoute;