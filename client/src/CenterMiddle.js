import React from 'react';
import {Grid} from "semantic-ui-react";

class CenterMiddle extends React.Component {
    render() {
        const height = {
            minHeight: this.props.minHeight || '100%'
        };
        const width = {
            maxWidth: this.props.maxWidth || undefined,
        };

        return (
            <Grid container centered verticalAlign='middle' style={height}>
                <Grid.Column style={width}>
                    {this.props.children}
                </Grid.Column>
            </Grid>
        )
    }
}

export default CenterMiddle;
