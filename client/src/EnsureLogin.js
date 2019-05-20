import React from 'react';

class EnsureLogin extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loggedIn: false,
        }
    }

    render() {
        // TODO: check if user is logged in, and present a login screen if needed
        if (!this.state.loggedIn) {
            return (
                <div>
                    You are not logged in.
                </div>
            )
        }

        return this.props.children;
    }
}

export default EnsureLogin;
