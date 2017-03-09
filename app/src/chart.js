import React from 'react';
import 'whatwg-fetch';
import d3 from './d3';
import MOCK from './MOCK';

export default class Chart extends React.Component {
    constructor() {
        super();
        this.state = {
            data : MOCK
        };



        // this.getPongStats();
        // this.pollPongStats(5000);





        // d3.select('.chart')
        //     .append('g')
        //     .call(axis);
    }

    componentDidMount() {
        var points = MOCK.length;
        var width = 1000;
        var height = 500;
        var scale = d3.scaleLinear()
            .domain([0,1000])
            .range([0,1000]);
        this.chart = d3.line()
            .x( (d, i) => { return i * (width / points) } )
            .y( d =>  d.value * 100);

        var axis = d3.axisBottom(scale).ticks(5);

        this.svg = d3.select('.chart')
            .append('svg')
            .attr('width', width)
            .attr('height', height);
        this.svg.append('path')
            .attr('stroke', 'red')
            .attr('fill', 'none')
            .attr('d', this.chart(MOCK));
        this.svg.append('g')
            .attr('stroke', 'black')
            .call(axis);
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
