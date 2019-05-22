import React from 'react';
import axios from "axios";
import {Button, Form, Icon, Input, Modal} from "semantic-ui-react";
import {toast} from "react-toastify";

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            description: '',
            address: '',
        }
    }

    resetState = () => {
        this.setState({
            loading: false,
        })
    };

    handleDescriptionChange = (event) => {
        this.setState({
            description: event.target.value,
        })
    };

    handleAddressChange = (event) => {
        this.setState({
            address: event.target.value,
        })
    };

    handleAdd = (event) => {
        this.setState({
            loading: true,
        });
        axios.post('/api/masks', this.state)
            .then((response) => {
                console.log(response);
                toast.success("Added masked email!");
            })
            .catch((err) => {
                console.error(err);
                toast.error("Failed to add masked email.");
            })
            .finally(() => {
                this.props.refresh({noReload: true});
                this.props.onClose();
            })
    };

    render() {
        const loading = this.state.loading;
        const domain = this.props.domain;

        return (
            <Modal open={true} onClose={this.props.onClose}>
                <Modal.Header>Add Masked Email</Modal.Header>

                <Modal.Content>
                    <Form loading={loading}>
                        <Form.Field>
                            <label>Description *</label>
                            <input type="text" value={this.state.description} onChange={this.handleDescriptionChange}/>
                            <small>A note on where you'll use this masked email address.</small>
                        </Form.Field>

                        <Form.Field>
                            <label>Custom Email</label>
                            <Input type="text" value={this.state.address} onChange={this.handleAddressChange}
                                label={`@${domain}`} labelPosition={"right"}/>
                            <small>You can specify a custom email address. If empty, a random mask will be generated.</small>
                        </Form.Field>
                    </Form>
                </Modal.Content>

                <Modal.Actions>
                    <Button color='red' onClick={this.props.onClose}>
                        <Icon name='remove'/> Cancel
                    </Button>
                    <Button color='green' onClick={this.handleAdd}>
                        <Icon name='checkmark'/> Add
                    </Button>
                </Modal.Actions>
            </Modal>
        );
    }
}

export default App;
