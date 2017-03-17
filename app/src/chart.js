import React from 'react';
import 'whatwg-fetch';
import d3 from './d3';
import MOCK from './MOCK';
import * as _ from 'lodash';

export default class Chart extends React.Component {
    constructor() {
        super();
        this.state = {
            data: [],
            maxPoints : 100
        };

        this.getPongStats();
        this.pollPongStats(2000);
    }

    componentDidMount() {
        this.svg = d3.select('.chart');

        d3.select(window).on('resize', this.rebuildChart.bind(this));

        this.svg.append('g')
            .attr('class', 'path-container')
            .append('path');


        this.svg.append('g')
            .attr('class', 'x-axis');

        this.svg.append('g')
            .attr('class', 'y-axis');

        this.rebuildChart();
    }

    rebuildChart() {
        let width = Number.parseFloat(_.trim(this.svg.style('width'), 'px'));
        let height = Number.parseFloat(_.trim(this.svg.style('height'), 'px'));
        let paddingRight = Number.parseFloat(_.trim(this.svg.style('padding-right'), 'px'));
        let paddingLeft = Number.parseFloat(_.trim(this.svg.style('padding-left'), 'px'));
        let paddingTop = Number.parseFloat(_.trim(this.svg.style('padding-top'), 'px'));
        let paddingBottom = Number.parseFloat(_.trim(this.svg.style('padding-bottom'), 'px'));

        width = width - paddingRight - paddingLeft;
        height = height - paddingTop - paddingBottom;

        var x = d3.scaleLinear()
            .domain([d3.min(this.state.data, (d) => d.id), d3.max(this.state.data, (d) => d.id)])
            .range([0, width]);

        var y = d3.scaleLinear()
            .domain([0, 1])
            .range([height - 20, 0]);

        var graph = d3.line()
            .x((d) => x(d.id))
            .y((d) => y(d.value));

        var xAxis = d3.axisBottom(x)
            .ticks(50)
            .tickSizeInner(-height)
            .tickPadding(5);

        var yAxis = d3.axisLeft(y)
            .tickSizeInner(-width)
            .tickPadding(5);


        this.svg.select('path')
            .datum(this.state.data)
            .attr('stroke', '#F96302')
            .attr('stroke-width', 3)
            .attr('fill', 'none')
            .transition()
            .attr('d', graph)

        this.svg.select('.x-axis')
            .attr('transform', 'translate(0,' + (height - 20) + ')')
            .call(xAxis);

        this.svg.select('.y-axis')
            .call(yAxis);
    }

    getPongStats() {
        fetch('./data').then((response) => {
            response.json().then((d) => {
                // this.setState({ data : d});
                d.forEach( (el) => {
                    this.state.data.shift();
                })
                d.forEach( (el) => {
                    this.state.data.push(el);
                });
                this.rebuildChart();
            });
        }).catch((err) => {
            console.error(err);
        });
    }

    pollPongStats(period) {
        setTimeout(() => {
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
