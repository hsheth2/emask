import React from 'react';

class App extends React.Component {
    render() {
        const open = this.props.open;

        return (
            <div className={"modal " + (open ? "is-active" : "")}>
                <div className="modal-background" onClick={this.props.onClose}></div>
                <div className="modal-card">
                    <header className="modal-card-head">
                        <p className="modal-card-title">Add Masked Email</p>
                        <button className="delete" aria-label="close" onClick={this.props.onClose}></button>
                    </header>
                    <section className="modal-card-body">
                        TODO form goes here
                    </section>
                    <footer className="modal-card-foot">
                        <button className="button is-success">Add</button>
                        <button className="button" onClick={this.props.onClose}>Cancel</button>
                    </footer>
                </div>
            </div>
        );
    }
}

export default App;
