import React from 'react';
import {Table} from "semantic-ui-react";
import Moment from "react-moment";

class App extends React.Component {
    render() {
        let data = this.props.emails;
        let domain = this.props.domain;

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
                    {!data.length ? (
                        <Table.Row>
                            <Table.Cell rowSpan={5}>No masked emails yet.</Table.Cell>
                        </Table.Row>
                    ) : (
                        data.map((mask) =>
                            <Table.Row key={mask._id}>
                                <Table.Cell>{mask.description}</Table.Cell>
                                <Table.Cell>{mask.address}@{domain}</Table.Cell>
                                <Table.Cell><Moment fromNow date={mask.createdAt} /></Table.Cell>
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
