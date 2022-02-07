import React, { useState } from 'react';
import MusicPlayer from "./components/MusicPlayer";
import './App.css';
import Header from './Components/Header/Header';
import LoginForm from './Components/LoginForm/LoginForm';
import RegistrationForm from './Components/RegistrationForm/RegistrationForm';
import Home from './Components/Home/Home';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
//showing errors with alert component while handling user inputs
import AlertComponent from './Components/AlertComponent/AlertComponent';
import PrivateRoute from './utils/PrivateRoute';


function App() {
  const [title, updateTitle] = useState(null);
  const [errorMessage, updateErrorMessage] = useState(null);
  return (
    //setting up react-router for displaying pages at different address paths
    <Router>
      <div className="App">
        <Header title={title} />
        <div className="container d-flex align-items-center flex-column">
          <Switch>
            <Route path="/" exact={true}>
            <MusicPlayer />
            </Route>
            <Route path="/register">
              <RegistrationForm showError={updateErrorMessage} updateTitle={updateTitle} />
            </Route>
            <Route path="/login">
              <LoginForm showError={updateErrorMessage} updateTitle={updateTitle} />
            </Route>
    {/* using PrivateRoute to make sure that the homepage is only accessible when a token is present on client-side */}
            <PrivateRoute path="/home">
              <Home />
            <MusicPlayer />
            </PrivateRoute>
          </Switch>
          <AlertComponent errorMessage={errorMessage} hideError={updateErrorMessage} />
        </div>
      </div>
    </Router>
  );
}

export default App;