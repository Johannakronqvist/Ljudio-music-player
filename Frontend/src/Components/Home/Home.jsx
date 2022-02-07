import React, { useEffect } from 'react';
import { ACCESS_TOKEN_NAME, API_BASE_URL } from '../../constants/apiContants';
import axios from 'axios'

function Home(props) {
    useEffect(() => {
        //making sure that the access token has not expired in future API calls within the private routes
        axios.get(API_BASE_URL + '/user/me', { headers: { 'token': localStorage.getItem(ACCESS_TOKEN_NAME) } })
            .then(function (response) {
                if (response.status !== 200) {
                    redirectToLogin()
                }
            })
            //if token is invalid user should be redirected to the login page
            .catch(function (error) {
                redirectToLogin()
            });
    })
    //function to redirect to login page
    function redirectToLogin() {
        props.history.push('/login');
    }

    return (
        <div className="mt-2">

        </div>
    )
}

export default Home;