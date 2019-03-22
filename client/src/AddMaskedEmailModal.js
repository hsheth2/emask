import React, {Component} from 'react';

class App extends Component {
    render() {
        return (
            <div className="modal is-active">
                <div className="modal-background"></div>
                <div className="modal-card">
                    <header className="modal-card-head">
                        <p className="modal-card-title">Add Masked Email</p>
                        <button className="delete" aria-label="close"></button>
                    </header>
                    <section className="modal-card-body">
                        TODO form goes here
                    </section>
                    <footer className="modal-card-foot">
                        <button className="button is-success">Add</button>
                        <button className="button">Cancel</button>
                    </footer>
                </div>
            </div>
        );
    }
}

export default App;
