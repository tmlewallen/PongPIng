import React from 'react';
import 'whatwg-fetch';
import d3 from './d3';
import MOCK from './MOCK';
import * as _ from 'lodash';

export default class Chart extends React.Component {
    constructor() {
        super();
        this.state = {
            data : []
        };

        this.getPongStats();
        this.pollPongStats(2000);
    }

    componentDidMount() {
        this.div = d3.select('#chart-container');
        let width = Number.parseFloat(_.trim(this.div.style('width'), 'px'));
        let height = Number.parseFloat(_.trim(this.div.style('height'), 'px'));

        d3.select(window).on('resize', this.rebuildChart.bind(this));

        var x = d3.scaleLinear()
            .domain([0, this.state.data.length])
            .range([0, width]);

        var y = d3.scaleLinear()
            .domain([0,1])
            .range([0, height]);

        var graph = d3.line()
            .x( (d) => x(d.id) )
            .y( (d) => y(d.value)  );

        this.svg = d3.select('.chart');

        this.svg.append('path')
            .datum(this.state.data)
            .attr('stroke', 'red')
            .attr('fill', 'none')
            .attr('d', graph);

    }

    rebuildChart(){
        let width = Number.parseFloat(_.trim(this.div.style('width'), 'px'));
        let height = Number.parseFloat(_.trim(this.div.style('height'), 'px'));

        // console.debug('Resized... dimensions are');
        // console.debug('\tWidth : ' + width + ', Height : ' + height);

        var x = d3.scaleLinear()
            .domain([0, this.state.data.length])
            .range([0, width]);

        var y = d3.scaleLinear()
            .domain([0,1])
            .range([0, height]);

        var graph = d3.line()
            .x( (d) => x(d.id) )
            .y( (d) => y(d.value)  );

        this.svg.select('path')
            .datum(this.state.data)
            .attr('d', graph);

    }

    getPongStats() {
        fetch('./data').then( (response) => {
            response.json().then( (d) => {
                this.setState({ data : d});
                this.rebuildChart();
            });
        }).catch( (err) => {
            console.error(err);
        });
    }

    pollPongStats(period) {
        setTimeout( () => {
           this.getPongStats();
           this.pollPongStats(period);
        }, period);
    }

    render() {
        return (
            <div>
                <button onClick={this.rebuildChart.bind(this)}>Click Me</button>
                <div id="chart-container">
                    <svg className="chart" width="100%" height="100%"/>
                </div>
            </div>

        );
    }
}
