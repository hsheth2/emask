import React from 'react';
import EMask from "./EMask";

import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import withEnsuredLogin from "./withEnsuredLogin";

const EnsureLoginEMask = withEnsuredLogin(EMask);

class App extends React.Component {
    render() {
        return (
            <div>
                <EnsureLoginEMask/>

                <ToastContainer/>
            </div>
        );
    }
}

export default App;
