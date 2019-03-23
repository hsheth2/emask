import React from 'react';
import axios from "axios";

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loaded: false,
            loadedSuccess: false,
            data: [],
        }
    }

    componentDidMount() {
        this.refreshData();
    }

    refreshData() {
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
        } else if (!data) {
            content = <p>No masked emails yet.</p>
        } else {
            content = (<table className={"table is-striped is-fullwidth"}>
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
                {data.map((mask) =>
                    <tr key={mask._id}>
                        <td>{mask.description}</td>
                        <td>{mask.address}</td>
                        <td>{new Date(mask.createdAt).toString()}</td>
                        <td>{mask.blocked ? "Blocked" : "Forwarding"}</td>
                        <td>0</td>
                    </tr>
                )}
                </tbody>
            </table>)
        }

        return (
            <section className={"section"}>
                <div className={"container"}>
                    {content}
                </div>
            </section>
        );
    }
}

export default App;
