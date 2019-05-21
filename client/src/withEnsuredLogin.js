import React from 'react';
import axios from "axios";
import SignupPage from "./SignupPage";
import LoginPage from "./LoginPage";
import {Container, Loader} from "semantic-ui-react";

const withEnsuredLogin = (WrappedComponent) => {
    // noinspection JSPotentiallyInvalidUsageOfThis
    class EnsureLogin extends React.Component {
        constructor(props) {
            super(props);

            this.state = {
                checking: false,
                loggedIn: false,
                showingLogin: true,
            }
        }

        checkAuth = () => {
            this.setState({
                checking: true,
            });

            axios.get('/auth/check')
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

        logout = (event) => {
            if (event)
                event.preventDefault();

            this.setState({
                checking: true,
            });

            axios.post('/auth/logout')
                .catch((err) => {
                    console.error(err);
                })
                .finally(() => {
                    this.checkAuth();
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

        componentDidMount() {
            // noinspection JSPotentiallyInvalidUsageOfThis
            this.checkAuth();
        }

        render() {
            if (this.state.checking) {
                return (
                    <Container>
                        <Loader active inline='centered' content={'Loading'}/>
                    </Container>
                )
            }

            if (!this.state.loggedIn) {
                if (this.state.showingLogin) {
                    // noinspection JSPotentiallyInvalidUsageOfThis
                    return (
                        <LoginPage recheckAuth={this.checkAuth} showSignup={this.showSignup}/>
                    )
                } else {
                    // noinspection JSPotentiallyInvalidUsageOfThis
                    return (
                        <SignupPage recheckAuth={this.checkAuth} showLogin={this.showLogin}/>
                    )
                }
            }

            return (
                <WrappedComponent logout={this.logout} {...this.props}/>
            )
        }
    }

    return EnsureLogin;
};

export default withEnsuredLogin;
