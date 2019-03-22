import React from 'react';
import axios from "axios";

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            description: '',
            address: '',
        }
    }

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
        axios.post('/api/masks', this.state)
            .then((response) => {
                console.log(response);
                this.props.onClose();
            })
            .catch((err) => {
                console.error(err);
                throw err;
            })
    };

    render() {
        const open = this.props.open;

        return (
            <div className={"modal " + (open ? "is-active" : "")}>
                <div className="modal-background" onClick={this.props.onClose}/>
                <div className="modal-card">
                    <header className="modal-card-head">
                        <p className="modal-card-title">Add Masked Email</p>
                        <button className="delete" aria-label="close" onClick={this.props.onClose}/>
                    </header>
                    <section className="modal-card-body">
                        <div className="field">
                            <label className="label">Description *</label>
                            <div className="control">
                                <input className="input" type="text" value={this.state.description} onChange={this.handleDescriptionChange}/>
                            </div>
                            <p className="help">A note on where you'll use this masked email address.</p>
                        </div>

                        <div className="field">
                            <label className="label">Custom Email</label>
                            <div className="control">
                                <input className="input" type="text" value={this.state.address} onChange={this.handleAddressChange}/>
                            </div>
                            <p className="help">You can specify a custom email address. If empty, a random mask will be generated.</p>
                        </div>
                    </section>
                    <footer className="modal-card-foot">
                        <button className="button is-success" onClick={this.handleAdd}>Add</button>
                        <button className="button" onClick={this.props.onClose}>Cancel</button>
                    </footer>
                </div>
            </div>
        );
    }
}

export default App;
