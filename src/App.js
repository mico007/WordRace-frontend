import React, { Suspense } from 'react';
import {
    BrowserRouter as Router,
    Route,
    Redirect,
    Switch
} from 'react-router-dom';


import { useAuth } from './Word-Race/hooks/auth-hook';
import { AuthContext } from './Word-Race/context/auth-context';

import LoadingSpinner from './Word-Race/components/LoadingSpinner';

import PrivateRoute from './Word-Race/utils/PrivateRoute';


// I used react lazy for code splitting to reduce the size of chunk files in the browser 

const Game = React.lazy(() => import('./Word-Race/pages/Game'))
const RegisterPlayer = React.lazy(() => import('./Word-Race/pages/register'))
const Instructions = React.lazy(() => import('./Word-Race/pages/instructions'))

const App = () => {

    const { token, login, logout, playerId } = useAuth();

    return (
        <AuthContext.Provider
            value={{
                isLoggedIn: !!token,
                token: token,
                playerId: playerId,
                login: login,
                logout: logout
            }}
        >
            <Router>
                <Suspense fallback={
                    <LoadingSpinner asOverlay />
                }>
                    <Switch>
                        <Route path="/" exact>
                            <Instructions />
                        </Route>
                        <PrivateRoute path="/game" component={Game} />
                        <Route path="/register" exact>
                            <RegisterPlayer />
                        </Route>
                        <Redirect to="/" />
                    </Switch>
                </Suspense>
            </Router>
        </AuthContext.Provider>
    );
}

export default App;