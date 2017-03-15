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
            width: 1000,
            height : 1000
        };

        // this.getPongStats();
        // this.pollPongStats(5000);
    }

    componentDidMount() {
        this.div = d3.select('.chart');
        let width = Number.parseFloat(_.trim(this.div.style('width'), 'px'));
        let height = Number.parseFloat(_.trim(this.div.style('height'), 'px'));
        this.setState({
            data : this.state.data,
            height : height,
            width : width
        });


        d3.select(window).on('resize', this.resize.bind(this));


        var points = MOCK.length;



        var graph = d3.line()
            .x( (d, i) => { return i * (this.state.width / points) } )
            .y( d =>  d.value * 100);




        this.svg = this.div
            .append('svg')
            .attr('width', this.state.width)
            .attr('height', this.state.height);
        this.svg.append('path')
            .attr('stroke', 'red')
            .attr('fill', 'none')
            .attr('d', graph(this.state.data));

        // this.scale = d3.scaleLinear()
        //     .domain([0,1000])
        //     .range([0,this.state.width]);
        // var axis = d3.axisBottom(this.scale).ticks(5);
        // this.svg.append('g')
        //     .attr('stroke', 'black')
        //     .call(axis);

        this.resize();
    }

    resize(){
        let width = Number.parseFloat(_.trim(this.div.style('width'), 'px'));
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
            <div>
                <button onClick={this.resize.bind(this)}>Click Me</button>
                <div className="chart">
                    {/*<svg className="chart" width="100%" height="100%">*/}
                    {/*<path stroke={'red'} fill={'none'} d={this.chart(this.state.data)}/>*/}
                    {/*</svg>*/}
                </div>
            </div>

        );
    }
}
