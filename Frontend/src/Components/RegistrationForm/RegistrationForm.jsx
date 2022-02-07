import React, { useState } from 'react';
import axios from 'axios';
import './RegistrationForm.css';
import { API_BASE_URL, ACCESS_TOKEN_NAME } from '../../Constants/apiContants';
import { withRouter } from "react-router-dom";

function RegistrationForm(props) {
    //using state hook to handle values entered by the user
    //state object contains the user values
    //setState method is responsible for updating user values
    const [state, setState] = useState({
        FullName: "",
        Username: "",
        Email: "",
        Password: "",
        confirmPassword: "",
        successMessage: null,
    });
    //handleChange updates the values
    const handleChange = (e) => {
        const { id, value } = e.target
        setState(prevState => ({
            ...prevState,
            [id]: value
        }))
        console.log(state)
    }
    //sending details to backend server
    const sendDetailsToServer = () => {
        if (state.FullName.length && state.Username && state.Email.length && state.Password.length) {
            props.showError(null);
            const payload = {
                "FullName": state.FullName,
                "Username": state.Username,
                "Email": state.Email,
                "Password": state.Password,
            }
            //using axios npm module to make API request to the backend (npm i --save axios)
            //making a post request to the server
            axios.post(API_BASE_URL + 'user', payload)
                .then(function (response) {
                    console.log(response)
                    if (response.status === 200) {
                        setState(prevState => ({
                            ...prevState,
                            'successMessage': 'Registration successful. Redirecting to home page..'
                        }))
                        //storing the token received from backend API to browser’s local storage
                        localStorage.setItem(ACCESS_TOKEN_NAME, response.data.token);
                        redirectToHome();
                        props.showError(null)
                    } else {
                        props.showError("Some error ocurred");
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        } else {
            props.showError('Please enter valid username and password')
        }

    }
    //funtion to redirect to homepage
    const redirectToHome = () => {
        props.updateTitle('Home')
        props.history.push('/home');
    }
    //function to redirect to login page
    const redirectToLogin = () => {
        props.updateTitle('Login')
        props.history.push('/login');
    }
    //adding a click event handler to register button for sending a request to backend
    const handleSubmitClick = (e) => {
        e.preventDefault();
        //first checking if password inputs match
        if (state.Password === state.confirmPassword) {
            //calling sendDetailsToServer function to make a backend API request
            sendDetailsToServer()
        } else {
            //else show an error to user that passwords do not match
            props.showError('Passwords do not match');
        }
    }
    return (
        <div className="login-card">
            <form>
                <div className="wrapper">
                    <label htmlFor="Name1">Full name</label>
                    <input type="name"
                        className="form-control"
                        id="FullName"
                        placeholder="Enter full name"
                        value={state.FullName}
                        onChange={handleChange}
                    />

                    <label htmlFor="Username1">Username</label>
                    <input type="username"
                        className="form-control"
                        id="Username"
                        placeholder="Enter username"
                        value={state.Username}
                        onChange={handleChange}
                    />

                    <label htmlFor="Email1">Email address</label>
                    <input type="email"
                        className="form-control"
                        id="Email"
                        aria-describedby="emailHelp"
                        placeholder="Enter email"
                        value={state.Email}
                        onChange={handleChange}
                    />

                    <label htmlFor="Password1">Password</label>
                    <input type="password"
                        className="form-control"
                        id="Password"
                        placeholder="Password"
                        value={state.Password}
                        onChange={handleChange}
                    />

                    <label htmlFor="Password1">Confirm Password</label>
                    <input type="password"
                        className="form-control"
                        id="confirmPassword"
                        placeholder="Confirm Password"
                        value={state.confirmPassword}
                        onChange={handleChange}
                    />
                </div>

                <button
                    type="submit"
                    className="button"
                    onClick={handleSubmitClick}
                >
                    Register
                </button>
            </form>
            <div className="alert alert-success mt-2" style={{ display: state.successMessage ? 'block' : 'none' }} role="alert">
                {state.successMessage}
            </div>
            <div className="redirect">
                <span>Already have an account? </span>
                <span className="loginText" onClick={() => redirectToLogin()}>Login here</span>
            </div>

        </div>
    )
}

export default withRouter(RegistrationForm);