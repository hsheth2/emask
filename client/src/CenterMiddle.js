import React from 'react';
import {Grid} from "semantic-ui-react";

const limitedWidth = {
    maxWidth: '450px',
};

class CenterMiddle extends React.Component {
    render() {
        const height = {
            minHeight: this.props.minHeight || '100%'
        };

        return (
            <Grid container centered verticalAlign='middle' style={height}>
                <Grid.Column style={limitedWidth}>
                    {this.props.children}
                </Grid.Column>
            </Grid>
        )
    }
}

export default CenterMiddle;
