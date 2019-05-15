import React from 'react';
import AddMaskedEmailModal from "./AddMaskedEmailModal";
import MaskedEmailList from "./MaskedEmailList";
import axios from "axios";

class EMask extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isAddModalOpen: false,
            loaded: false,
            loadedSuccess: false,
            data: [],
        };
    }

    componentDidMount() {
        this.refreshData();
    }

    refreshData() {
        this.setState({
            loaded: false,
            loadedSuccess: false,
        });

        axios.get('/api/masks')
            .then((response) => {
                const data = response.data;
                console.log(data);
                this.setState({
                    loaded: true,
                    loadedSuccess: true,
                    data: data,
                })
            })
            .catch((err) => {
                console.log(err);
                this.setState({
                    loaded: true,
                    loadedSuccess: false,
                })
            })
    }

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
        console.log(data);

        let content;
        if (loading) {
            content = <p>Loading...</p>
        } else if (loadingFailed) {
            content = <p>Failed to load masked emails.</p>
        } else {
            content = <MaskedEmailList emails={data} />
        }

        return (
            <div>
                <section className="section">
                    <div className="container">
                        <h1 className="title">
                            EMask
                        </h1>
                        <p className="subtitle">
                            Set up email forwarders to mask your real email address.
                        </p>
                    </div>
                </section>

                <section className={"section"}>
                    <div className={"container"}>
                        <AddMaskedEmailModal isOpen={this.state.isAddModalOpen} onClose={this.closeAddModal} refresh={this.refreshData}/>

                        <button className="button is-primary" onClick={this.openAddModal}>Add Masked Email</button>

                        {content}
                    </div>
                </section>
            </div>
        );
    }
}

export default EMask;
