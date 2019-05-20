import React from 'react';
import EMask from "./EMask";

import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class App extends React.Component {
    render() {
        return (
            <div>
                <EMask/>
                TODO: check if user is logged in, and present a login screen if needed
                <ToastContainer/>
            </div>
        );
    }
}

export default App;
