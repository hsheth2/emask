import React from 'react';
import AddMaskedEmailModal from "./AddMaskedEmailModal";
import MaskedEmailList from "./MaskedEmailList";
import axios from "axios";
import {Button, Container, Header, Placeholder, Segment} from "semantic-ui-react";
import {toast} from "react-toastify";

class EMask extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isAddModalOpen: false,
            loaded: false,
            loadedSuccess: false,
            data: [],
            domain: "",
        };
    }

    componentDidMount() {
        this.refreshData();
    }

    refreshData = () => {
        this.setState({
            loaded: false,
            loadedSuccess: false,
        });

        axios.get('/api/masks')
            .then((response) => {
                const data = response.data;
                this.setState({
                    loaded: true,
                    loadedSuccess: true,
                    data: data.masks,
                    domain: data.domain,
                });
            })
            .catch((err) => {
                console.log(err);
                this.setState({
                    loaded: true,
                    loadedSuccess: false,
                });
                toast.error("Failed to load masked emails.");
            })
    };

    openAddModal = () => {
        this.setState({
            isAddModalOpen: true,
        })
    };

    closeAddModal = () => {
        this.setState({
            isAddModalOpen: false,
        })
    };

    render() {
        const loading = !this.state.loaded;
        const loadingFailed = !this.state.loadedSuccess;
        const data = this.state.data;
        const domain = this.state.domain;

        let content;
        if (loading) {
            content = (
                <Segment loading>
                    <Placeholder fluid>
                        <Placeholder.Line/>
                        <Placeholder.Line/>
                        <Placeholder.Line/>
                    </Placeholder>
                </Segment>
            )
        } else if (loadingFailed) {
            content = (
                <Segment>
                    Failed to load masked emails.
                    {/*<Button onClick={this.refreshData}>Retry</Button>*/}
                </Segment>
            )
        } else {
            content = <MaskedEmailList emails={data} domain={domain}/>
        }

        return (
            <div>
                <Container>
                    <Header as={"h1"}
                            content={"EMask"}
                            subheader={"Set up email forwarders to avoid giving out your real email address."}
                    />
                </Container>

                <Container>
                    {this.state.isAddModalOpen &&
                    <AddMaskedEmailModal onClose={this.closeAddModal}
                                         refresh={this.refreshData}
                                         domain={domain}
                    />
                    }

                    <Button onClick={this.openAddModal}>Add Masked Email</Button>

                    <Button basic secondary onClick={this.props.logout}>Logout</Button>

                    {content}
                </Container>
            </div>
        );
    }
}

export default EMask;
