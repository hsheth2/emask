import React from 'react';
import axios from "axios";
import {Button, Container, Form, Header} from "semantic-ui-react";
import {toast} from "react-toastify";

class LoginPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: "",
            password: "",
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

    login = () => {
        this.setState({
            loading: true,
        });

        axios.post('/auth/login', this.state)
            .then((data) => {
                this.props.recheckAuth();
            })
            .catch((err) => {
                if (err.response.status === 400) {
                    toast.error(err.response.data.message);
                } else {
                    console.error(err);
                    toast.error("Failed to login. " + err);
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
                    Login
                </Header>

                <Form loading={loading}>
                    <Form.Input label={"Username"} value={this.state.username} onChange={this.handleUsernameChange} />
                    <Form.Input label={"Password"} value={this.state.password} onChange={this.handlePasswordChange} type={"password"} />

                    <Button floated={'right'} type={'submit'} primary onClick={this.login}>Login</Button>
                    <Button floated={'left'} basic secondary onClick={this.props.showSignup}>Signup</Button>
                </Form>
            </Container>
        )
    }
}

export default LoginPage;
