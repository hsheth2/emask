import React from 'react';
import axios from "axios";
import SignupPage from "./SignupPage";
import LoginPage from "./LoginPage";
import {Container, Loader} from "semantic-ui-react";
import CenterMiddle from "./CenterMiddle";

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
                    <CenterMiddle minHeight='100vh'>
                        <Loader active inline='centered' content={'Loading'}/>
                    </CenterMiddle>
                )
            }

            if (!this.state.loggedIn) {
                if (this.state.showingLogin) {
                    // noinspection JSPotentiallyInvalidUsageOfThis
                    return (
                        <CenterMiddle minHeight='100vh' maxWidth='450px'>
                            <LoginPage recheckAuth={this.checkAuth} showSignup={this.showSignup}/>
                        </CenterMiddle>
                    )
                } else {
                    // noinspection JSPotentiallyInvalidUsageOfThis
                    return (
                        <CenterMiddle minHeight='100vh' maxWidth='450px'>
                            <SignupPage recheckAuth={this.checkAuth} showLogin={this.showLogin}/>
                        </CenterMiddle>
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
