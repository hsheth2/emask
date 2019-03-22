import React from 'react';
import AddMaskedEmailModal from "./AddMaskedEmailModal";

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            addModalOpen: false,
        }
    }

    addModalOpen = () => {
        this.setState({
            addModalOpen: true,
        })
    };

    addModalClose = () => {
        this.setState({
            addModalOpen: false,
        })
    };

    render() {
        return (
            <section className="section">
                <div className="container">
                    <h1 className="title">
                        Hello World
                    </h1>
                    <p className="subtitle">
                        My first website with <strong>Bulma</strong>!
                    </p>

                    <button className="button is-primary" onClick={this.addModalOpen}>Add Masked Email</button>
                </div>

                <AddMaskedEmailModal open={this.state.addModalOpen} onClose={this.addModalClose}/>
            </section>
        );
    }
}

export default App;
