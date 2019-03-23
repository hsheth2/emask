import React from 'react';
import AddMaskedEmailModal from "./AddMaskedEmailModal";
import MaskedEmailList from "./MaskedEmailList";

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
            <div>
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
                </section>

                <AddMaskedEmailModal open={this.state.addModalOpen} onClose={this.addModalClose}/>

                <MaskedEmailList/>
            </div>
        );
    }
}

export default App;
