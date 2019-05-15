import React from 'react';
import {Table} from "semantic-ui-react";

class App extends React.Component {
    render() {
        let data = this.props.emails;

        return (
            <Table striped>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Description</Table.HeaderCell>
                        <Table.HeaderCell>Email Address</Table.HeaderCell>
                        <Table.HeaderCell>Created</Table.HeaderCell>
                        <Table.HeaderCell>Status</Table.HeaderCell>
                        <Table.HeaderCell>Emails Forwarded</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {!data ? (
                        <Table.Row><Table.Cell>No masked emails yet.</Table.Cell></Table.Row>
                    ) : (
                        data.map((mask) =>
                            <Table.Row key={mask._id}>
                                <Table.Cell>{mask.description}</Table.Cell>
                                <Table.Cell>{mask.address}</Table.Cell>
                                <Table.Cell>{new Date(mask.createdAt).toString()}</Table.Cell>
                                <Table.Cell>{mask.blocked ? "Blocked" : "Forwarding"}</Table.Cell>
                                <Table.Cell>0</Table.Cell>
                            </Table.Row>
                        )
                    )}
                </Table.Body>
            </Table>
        );
    }
}

export default App;
