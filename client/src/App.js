import React, {Component} from 'react';
import AddMaskedEmailModal from "./AddMaskedEmailModal";

class App extends Component {
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

                    <button className="button is-primary">Add Masked Email</button>
                </div>

                <AddMaskedEmailModal/>
            </section>
        );
    }
}

export default App;
