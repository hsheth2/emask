import React from 'react';
import axios from "axios";
import {Container, Form, Header, Message} from "semantic-ui-react";

class SignupPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: "",
            password: "",
            email: "",
            loading: false,
        }
    }

    handleUsernameChange = (event) => {
        this.setState({
            username: event.target.value,
        })
    };

    handlePasswordChange = (event) => {
        this.setState({
            password: event.target.value,
        })
    };

    handleEmailChange = (event) => {
        this.setState({
            email: event.target.value,
        })
    };

    signup = () => {
        this.setState({
            loading: true,
        });

        axios.post('/api/auth/signup', this.state)
            .then((data) => {
                // TODO signup success
            })
            .catch((err) => {
                // TODO signup failed
            })
    };

    render() {
        const loading = this.state.loading;

        return (
            <Container>
                <Header as="h2">
                    Sign Up
                </Header>

                <Form loading={loading}>
                    <Form.Input label={"Username"} value={this.state.username} onChange={this.handleUsernameChange} />
                    <Form.Input label={"Email"} value={this.state.email} onChange={this.handleEmailChange} />
                    <Form.Input label={"Password"} value={this.state.password} onChange={this.handlePasswordChange} type={"password"} />

                    <Form.Button primary onClick={this.signup}>Sign Up</Form.Button>
                </Form>

                <Message>
                    Already have an account? <a href="#" onClick={this.props.showLogin}>Login</a>
                </Message>
            </Container>
        )
    }
}

export default SignupPage;