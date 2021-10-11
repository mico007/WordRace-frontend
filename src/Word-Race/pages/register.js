import React, { useState, useContext } from 'react';

import WordRace from '../layout/WordRace';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorModal from '../components/ErrorModal';

import { useForm } from '../hooks/form-hook';
import { useHttpClient } from '../hooks/http-hook';
import { AuthContext } from '../context/auth-context';

import {
    VALIDATOR_MINLENGTH,
    VALIDATOR_REQUIRE
} from '../utils/validators';

const RegisterPlayer = () => {

    const auth = useContext(AuthContext);

    const [isLoginMode, setIsLoginMode] = useState(true);

    const { isLoading, error, sendRequest, clearError } = useHttpClient();

    const [formState, inputHandler, setFormData] = useForm(
        {
            username: {
                value: '',
                isValid: false
            }
        },
        false
    );

    const switchModeHandler = () => {
        if (!isLoginMode) {
            setFormData(
                {
                    ...formState.inputs,
                    username: undefined
                },
                formState.inputs.username.isValid
            );
        } else {
            setFormData(
                {
                    ...formState.inputs,
                    username: {
                        value: '',
                        isValid: false
                    }
                },
                false
            );
        }
        setIsLoginMode(prevMode => !prevMode);
    };

    const authSubmitHandler = async event => {
        event.preventDefault();

        if (isLoginMode) {
            try {
                const responseData = await sendRequest(
                    process.env.REACT_APP_BACKEND_URL + "/players/login",
                    'POST',
                    JSON.stringify({
                        username: formState.inputs.username.value
                    }),
                    {
                        'Content-Type': 'application/json'
                    }
                );
                auth.login(responseData.playerId, responseData.token);
                window.location.assign('/game');
            } catch (err) { }
        } else {
            try {
                const responseData = await sendRequest(
                    process.env.REACT_APP_BACKEND_URL + "/players/register",
                    'POST',
                    JSON.stringify({
                        username: formState.inputs.username.value
                    }),
                    {
                        'Content-Type': 'application/json'
                    }
                );
                auth.login(responseData.playerId, responseData.token);
                window.location.assign('/game');
            } catch (err) { }
        }
    };

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            <WordRace>
                <Card className="authentication">
                    {isLoading && <LoadingSpinner asOverlay />}
                    <h2>Username Required</h2>
                    <hr />
                    <form onSubmit={authSubmitHandler}>

                        <Input
                            element="input"
                            id="username"
                            type="text"
                            label="Username"
                            validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(4)]}
                            errorText="Please enter a valid username (4 characters at least )."
                            onInput={inputHandler}
                        />
                        <Button type="submit" disabled={!formState.isValid}>
                            {isLoginMode ? 'LOGIN' : 'REGISTER'}
                        </Button>
                    </form>
                    <Button inverse onClick={switchModeHandler}>
                        SWITCH TO {isLoginMode ? 'REGISTER' : 'LOGIN'}
                    </Button>
                </Card>
            </WordRace>
        </React.Fragment>
    )
}

export default RegisterPlayer;