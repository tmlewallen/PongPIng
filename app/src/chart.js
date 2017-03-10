import React from 'react';
import 'whatwg-fetch';
import d3 from './d3';
import MOCK from './MOCK';
import * as _ from 'lodash';

export default class Chart extends React.Component {
    constructor() {
        super();
        this.state = {
            data : MOCK,
            width: 0,
            height : 0
        };

        // this.getPongStats();
        // this.pollPongStats(5000);
    }

    componentDidMount() {
        this.div = d3.select('.chart');

        d3.select(window).on('resize', this.resize);

        var points = MOCK.length;

        var scale = d3.scaleLinear()
            .domain([0,1000])
            .range([0,1000]);

        var graph = d3.line()
            .x( (d, i) => { return i * (this.state.width / points) } )
            .y( d =>  d.value * 100);

        var axis = d3.axisBottom(scale).ticks(5);

        this.svg = this.div
            .append('svg')
            .attr('width', this.state.width)
            .attr('height', this.state.height);
        this.svg.append('path')
            .attr('stroke', 'red')
            .attr('fill', 'none')
            .attr('d', graph(this.state.data));
        this.svg.append('g')
            .attr('stroke', 'black')
            .call(axis);

        this.resize();
    }

    resize(){
        let width = Number.parseFloat(_.trim(this.tyle('width'), 'px'));
        let height = Number.parseFloat(_.trim(this.div.style('height'), 'px'));
        this.setState({
            data : this.state.data,
            height : height,
            width : width
        });
        console.debug('Resized... state is ');
        console.debug(this.state);

        var graph = d3.line()
            .x( (d, i) => { return i * (this.state.width / this.state.data.length) } )
            .y( d =>  d.value * 100);

        this.svg
            .attr('width', this.state.width)
            .attr('height', this.state.height)
            .select('path')
            .attr('d', graph(this.state.data));
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
           this.pollPongStats(period);
        }, period);
    }

    render() {
        return (
            <div className="chart">
            {/*<svg className="chart" width="100%" height="100%">*/}
                {/*<path stroke={'red'} fill={'none'} d={this.chart(this.state.data)}/>*/}
            {/*</svg>*/}
            </div>
        );
    }
}
