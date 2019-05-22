import React from 'react';
import {Checkbox, Table} from "semantic-ui-react";
import Moment from "react-moment";
import axios from "axios";
import {toast} from "react-toastify";

class App extends React.Component {
    toggleMask = (mask, event) => {
        axios.patch(`/api/masks/${mask._id}`, {
            blocked: !mask.blocked,
        })
            .catch((err) => {
                console.error(err);
                toast.error('Could not update mask. ' + err);
            })
            .finally(() => {
                this.props.refresh({noReload: true})
            })
    };

    render() {
        const masks = this.props.masks;
        const domain = this.props.domain;

        return (
            <Table striped>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Description</Table.HeaderCell>
                        <Table.HeaderCell>Email Address</Table.HeaderCell>
                        <Table.HeaderCell>Enabled</Table.HeaderCell>
                        <Table.HeaderCell>Created</Table.HeaderCell>
                        <Table.HeaderCell>Updated</Table.HeaderCell>
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
                                <Table.Cell>
                                    <Checkbox toggle
                                              checked={!mask.blocked}
                                              onChange={(event) => this.toggleMask(mask, event)}/>
                                </Table.Cell>
                                <Table.Cell><Moment fromNow date={mask.createdAt}/></Table.Cell>
                                <Table.Cell><Moment fromNow date={mask.updatedAt}/></Table.Cell>
                            </Table.Row>
                        )
                    )}
                </Table.Body>
            </Table>
        );
    }
}

export default App;
