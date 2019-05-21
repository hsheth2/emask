import React from 'react';
import axios from "axios";
import SignupPage from "./SignupPage";
import LoginPage from "./LoginPage";
import {Container, Loader} from "semantic-ui-react";

class EnsureLogin extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            checking: false,
            loggedIn: false,
            showingLogin: true,
        }
    }

    componentDidMount() {
        this.checkLogin();
    }

    checkLogin = () => {
        this.setState({
            checking: true,
        });

        axios.get('/api/ping')
            .then((response) => {
                this.setState({
                    checking: false,
                    loggedIn: true,
                })
            })
            .catch((err) => {
                if (err.response.status >= 500)
                    console.error(err);

                this.setState({
                    checking: false,
                    loggedIn: false,
                })
            })
    };

    showLogin = (event) => {
        if (event)
            event.preventDefault();
        this.setState({
            showingLogin: true,
        })
    };
    showSignup = (event) => {
        if (event)
            event.preventDefault();
        this.setState({
            showingLogin: false,
        })
    };

    render() {
        if (this.state.checking) {
            return (
                <Container>
                    <Loader active inline='centered' content={'Loading'} />
                </Container>
            )
        }

        if (!this.state.loggedIn) {
            if (this.state.showingLogin) {
                return (
                    <LoginPage recheckAuth={this.checkLogin} showSignup={this.showSignup}/>
                )
            } else {
                return (
                    <SignupPage recheckAuth={this.checkLogin} showLogin={this.showLogin}/>
                )
            }
        }

        return this.props.children;
    }
}

export default EnsureLogin;
