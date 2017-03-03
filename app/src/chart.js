import React from 'react';
import 'whatwg-fetch';
import * as d3 from 'd3';
import MOCK from './MOCK';

export default class Chart extends React.Component {
    constructor() {
        super();
        this.state = {
            data : MOCK
        };
        this.getPongStats();
        this.pollPongStats(5000);
    }

    componentDidMount() {
        this.svg= d3.select('#chart')
            .append('svg')
            .attr('width', '100%')
            .attr('height', '100%');
        this.updateChart(this.state.data);
    }

    updateChart(data){
        this.svg.selectAll('rect')
            .data(data)
            .enter()
            .append('rect')
            .attr('width', 5)
            .attr('height', (datum) => {
                return 100 * datum.value;
            })
            .attr('x', (datum, i) => {
                return i * 6;
            });
    }

    getPongStats() {
        fetch('./data').then( (response) => {
            response.json().then( (d) => {
                this.setState({ data : d});
            });
        }).catch( (err) => {
            console.error(err);
        });
    }

    pollPongStats(period) {
        setTimeout( () => {
           this.getPongStats();
           this.updateChart(this.state.data);
           this.pollPongStats(period);
        }, period);
    }

    render() {
        return (
            <div id="chart"/>
        );
    }
}
