import React from 'react';
import ReactDOM from 'react-dom';
import Chart from './chart';
import styles from './styles.css';
import bootstrap from '../../node_modules/bootstrap/dist/css/bootstrap.css';

class Main extends React.Component {
    render() {
        return (
            <div className="app-container">
                <h1>DATA</h1>
                <div className="row">
                    <Chart></Chart>
                </div>
            </div>

        );
    }
}
const app = document.getElementById('app');
ReactDOM.render(<Main/>, app);