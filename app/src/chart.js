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
        this.svg = d3.select('.chart');
        let width = Number.parseFloat(_.trim(this.svg.style('width'), 'px'));
        let height = Number.parseFloat(_.trim(this.svg.style('height'), 'px'));
        let paddingRight = Number.parseFloat(_.trim(this.svg.style('padding-right'), 'px'));
        let paddingLeft = Number.parseFloat(_.trim(this.svg.style('padding-left'), 'px'));

        width = width - paddingRight - paddingLeft;

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

        var axis = d3.axisBottom(x);


        this.svg.append('g')
            .attr('class', 'path-container')
            .append('path')
            .datum(this.state.data)
            .attr('stroke', 'red')
            .attr('fill', 'none')
            .attr('d', graph)

        this.svg.append('g')
            .attr('class', 'axis')
            .attr('transform', 'translate(0,' + height + ')')
            .call(axis);
    }

    rebuildChart(){
        let width = Number.parseFloat(_.trim(this.svg.style('width'), 'px'));
        let height = Number.parseFloat(_.trim(this.svg.style('height'), 'px'));
        let paddingRight = Number.parseFloat(_.trim(this.svg.style('padding-right'), 'px'));
        let paddingLeft = Number.parseFloat(_.trim(this.svg.style('padding-left'), 'px'));

        width = width - paddingRight - paddingLeft;

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

        var axis = d3.axisBottom(x);

        this.svg.select('path')
            .datum(this.state.data)
            .attr('d', graph);

        this.svg.select('.axis')
            .attr('transform', 'translate(0,' + height + ')')
            .call(axis);

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
            <div id="chart-container" className="col-md-12">
                <svg className="chart"/>
            </div>
        );
    }
}
