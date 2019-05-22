import React from 'react';
import {Checkbox, Table} from "semantic-ui-react";
import Moment from "react-moment";

class App extends React.Component {
    toggleMask = (mask, event) => {
        // TODO allow toggle onClick
        this.props.refresh({noReload: true})
    };

    render() {
        let masks = this.props.masks;
        let domain = this.props.domain;

        return (
            <Table striped>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Description</Table.HeaderCell>
                        <Table.HeaderCell>Email Address</Table.HeaderCell>
                        <Table.HeaderCell>Created</Table.HeaderCell>
                        <Table.HeaderCell>Enabled</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {!masks.length ? (
                        <Table.Row>
                            <Table.Cell rowSpan={5}>No masked emails yet.</Table.Cell>
                        </Table.Row>
                    ) : (
                        masks.map((mask) =>
                            <Table.Row key={mask._id}>
                                <Table.Cell>{mask.description}</Table.Cell>
                                <Table.Cell>{mask.address}@{domain}</Table.Cell>
                                <Table.Cell><Moment fromNow date={mask.createdAt} /></Table.Cell>
                                <Table.Cell>
                                    <Checkbox toggle checked={!mask.blocked}/>
                                </Table.Cell>
                            </Table.Row>
                        )
                    )}
                </Table.Body>
            </Table>
        );
    }
}

export default App;
