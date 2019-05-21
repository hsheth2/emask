import React from 'react';
import axios from "axios";
import {Button, Container, Form, Header} from "semantic-ui-react";
import {toast} from "react-toastify";

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

        axios.post('/auth/signup', this.state)
            .then((data) => {
                this.props.recheckAuth();
            })
            .catch((err) => {
                if (err.response.status === 400) {
                    toast.error(err.response.data.message);
                } else {
                    console.error(err);
                    toast.error("Failed to sign up. " + err);
                }
                this.setState({
                    loading: false,
                })
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

                    <Button floated={'right'} type={'submit'} primary onClick={this.signup}>Signup</Button>
                    <Button floated={'left'} basic secondary onClick={this.props.showLogin}>Login</Button>
                </Form>
            </Container>
        )
    }
}

export default SignupPage;
