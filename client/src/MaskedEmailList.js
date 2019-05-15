import React from 'react';

class App extends React.Component {
    render() {
        let data = this.props.emails;

        return (
            <table className={"table is-striped is-fullwidth"}>
                <thead>
                <tr>
                    <th>Description</th>
                    <th>Email Address</th>
                    <th>Created</th>
                    <th>Status</th>
                    <th>Emails Forwarded</th>
                </tr>
                </thead>
                <tbody>
                {!data ?
                    <tr><td>No masked emails yet.</td></tr>
                    :
                    data.map((mask) =>
                        <tr key={mask._id}>
                            <td>{mask.description}</td>
                            <td>{mask.address}</td>
                            <td>{new Date(mask.createdAt).toString()}</td>
                            <td>{mask.blocked ? "Blocked" : "Forwarding"}</td>
                            <td>0</td>
                        </tr>
                    )}
                </tbody>
            </table>
        );
    }
}

export default App;
