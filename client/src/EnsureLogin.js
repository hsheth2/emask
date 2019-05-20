import React from 'react';
import SignupPage from "./SignupPage";

class EnsureLogin extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            checking: false,
            loggedIn: false,
            showingLogin: false,
        }
    }

    componentDidMount() {
        this.checkLogin();
    }

    checkLogin = () => {
        this.setState({
            checking: true,
        });

        this.setState({
            checking: false,
        })
        // TODO actually check if the user is logged in already
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
        // TODO: check if user is logged in, and present a login screen if needed
        if (!this.state.loggedIn) {
            if (this.state.showingLogin) {
                return (
                    <p>A login page goes here.</p>
                )
            } else {
                return (
                    <SignupPage showLogin={this.showLogin}/>
                )
            }
        }

        return this.props.children;
    }
}

export default EnsureLogin;
