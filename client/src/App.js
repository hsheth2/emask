import React from 'react';
import EMask from "./EMask";

import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class App extends React.Component {
    render() {
        return (
            <div>
                <EMask/>
                <ToastContainer/>
            </div>
        );
    }
}

export default App;
