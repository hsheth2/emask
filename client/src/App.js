import React from 'react';
import EMask from "./EMask";

import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EnsureLogin from "./EnsureLogin";

class App extends React.Component {
    render() {
        return (
            <div>
                <EnsureLogin>
                    <EMask/>
                </EnsureLogin>

                <ToastContainer/>
            </div>
        );
    }
}

export default App;
