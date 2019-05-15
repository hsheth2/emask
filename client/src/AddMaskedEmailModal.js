import React from 'react';
import axios from "axios";
import {Button, Form, Icon, Modal} from "semantic-ui-react";

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
                this.props.refresh();
                this.props.onClose();
            })
            .catch((err) => {
                console.error(err);
                this.props.onClose();
                // TODO start using https://github.com/fkhadra/react-toastify
                throw err;
            })
    };

    render() {
        const loading = this.state.loading;

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
                            <input type="text" value={this.state.address} onChange={this.handleAddressChange}/>
                            <small>You can specify a custom email address. If empty, a random mask will be generated.</small>
                        </Form.Field>
                    </Form>
                </Modal.Content>

                <Modal.Actions>
                    <Button color='red' onClick={this.props.onClose}>
                        <Icon name='remove' /> Cancel
                    </Button>
                    <Button color='green' onClick={this.handleAdd} >
                        <Icon name='checkmark'/> Add
                    </Button>
                </Modal.Actions>
            </Modal>
        );
    }
}

export default App;
