import React, { useState } from 'react';
import axios from 'axios';
import './LoginForm.css';
import { API_BASE_URL, ACCESS_TOKEN_NAME } from '../../constants/apiContants';
import { withRouter } from "react-router-dom";

function LoginForm(props) {
  //using state hook to handle values entered by the user
  //state object contains the user values
  //setState method is responsible for updating user values
  const [state, setState] = useState({
    username: "",
    password: "",
    successMessage: null
  })
  //handleChange updates the values
  const handleChange = (e) => {
    const { id, value } = e.target
    setState(prevState => ({
      ...prevState,
      [id]: value
    }))
  }

  //adding a click event handler to login button for sending a request to backend
  const handleSubmitClick = (e) => {
    e.preventDefault();
    const payload = {
      "username": state.username,
      "password": state.password,
    }
    //using axios npm module to make API request to the backend (npm i --save axios)
    //making a post request to the server
    axios.post(API_BASE_URL + 'auth', payload)
      .then(function (response) {
        //if everything is in order, login is sucessful
        if (response.status === 200) {
          setState(prevState => ({
            ...prevState,
            'successMessage': 'Login successful. Redirecting to home page..'
          }))
          //storing the token received from backend API to browser’s local storage
          localStorage.setItem(ACCESS_TOKEN_NAME, response.data.token);
          redirectToHome();
          props.showError(null)
        }
        //else show an error to user that username and password do not match
        else if (response.status === 204) {
          props.showError("Username and password do not match");
        }
        //else show an error to user that username does not exist
        else {
          props.showError("Username does not exists");
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  //funtion to redirect to homepage
  const redirectToHome = () => {
    props.updateTitle('Home')
    props.history.push('/home');
  }

  //function to redirect to register page
  const redirectToRegister = () => {
    props.history.push('/register');
    props.updateTitle('Register');
  }
  return (
    <div className="login-card">
      <form>
        <div className="wrapper">
          <label htmlFor="Username1">Username</label>
          <input
            type="username"
            className="form-control"
            id="username"
            aria-describedby="usernameHelp"
            placeholder="Enter username"
            value={state.username}
            onChange={handleChange}
          />
        </div>

        <label htmlFor="Password1">Password</label>
        <input
          type="password"
          className="form-control"
          id="password"
          placeholder="Password"
          value={state.password}
          onChange={handleChange}
        />

        <button
          type="submit"
          className="button"
          onClick={handleSubmitClick}
        >
          Login
        </button>
      </form>
      <div
        className="alert alert-success mt-2"
        style={{ display: state.successMessage ? "block" : "none" }}
        role="alert"
      >
        {state.successMessage}
      </div>
      <div className="registerMessage">
        <span>Dont have an account? </span>
        <span className="loginText" onClick={() => redirectToRegister()}>
          Register
        </span>
      </div>
    </div>
  );
}

export default withRouter(LoginForm);