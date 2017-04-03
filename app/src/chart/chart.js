import React from 'react';
import 'whatwg-fetch';
import d3 from './d3';
import moment from 'moment';
import * as _ from 'lodash';

export default class Chart extends React.Component {
    constructor() {
        super();
        this.state = {
            data: [],
            maxPoints : 5000,
            pollPeriod : 2
        };

        this.getPongStats(moment().subtract(20,'minutes'));
        // this.pollPongStats(this.state.pollPeriod * 1000);
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
        console.info(`Num of Points : ${this.state.data.length}`)
        let width = Number.parseFloat(_.trim(this.svg.style('width'), 'px'));
        let height = Number.parseFloat(_.trim(this.svg.style('height'), 'px'));
        let paddingRight = Number.parseFloat(_.trim(this.svg.style('padding-right'), 'px'));
        let paddingLeft = Number.parseFloat(_.trim(this.svg.style('padding-left'), 'px'));
        let paddingTop = Number.parseFloat(_.trim(this.svg.style('padding-top'), 'px'));
        let paddingBottom = Number.parseFloat(_.trim(this.svg.style('padding-bottom'), 'px'));

        width = width - paddingRight - paddingLeft;
        height = height - paddingTop - paddingBottom;

        let timeFormat = d3.timeFormat('%b %d %I:%M:%S %p')

        let x = d3.scaleLinear()
            .domain([d3.min(this.state.data, (d) => d.timestamp * 1000), d3.max(this.state.data, (d) => d.timestamp * 1000)])
            .range([0, width]);

        let y = d3.scaleLinear()
            .domain([d3.min(this.state.data, (d) => d.delta), d3.max(this.state.data, (d) => d.delta)])
            .range([height - 20, 0]);

        let graph = d3.line()
            .x((d) => x(new Date(d.timestamp * 1000)))
            .y((d) => y(d.delta));

        let xAxis = d3.axisBottom(x)
            .ticks(25)
            .tickSizeInner(-height)
            .tickFormat(timeFormat);
            // .tickPadding(5);

        let yAxis = d3.axisLeft(y)
            .tickSizeInner(-width)
            .tickPadding(5);

        let p = this.svg.select('path')
            .datum(this.state.data)
            .attr('stroke', '#F96302')
            .attr('stroke-width', 3)
            .attr('fill', 'none');
            // .transition()

        if (this.state.data.length < this.state.maxPoints){
            p = p.transition();
        }
        p.attr('d', graph);

        this.svg.select('.x-axis')
            .attr('transform', 'translate(0,' + (height - 20) + ')')
            .call(xAxis)
            .selectAll('text')
            .attr("transform", "rotate(-45)")
            .style("text-anchor", "end");

        this.svg.select('.y-axis')
            .call(yAxis);
    }

    getPongStats(d) {
        let dt = d ? d : moment().subtract(this.state.pollPeriod, 'seconds');
        console.log(dt.format());
        fetch(`./data/list/${dt.format()}`).then((response) => {
            response.json().then((d) => {
                let newSize = this.state.data.length + d.length;
                if (this.state.data.length === 0 && d.length > this.state.maxPoints){
                    d = d.splice(d.length - this.state.maxPoints);
                }
                else if (newSize > this.state.maxPoints){
                    this.state.data = this.state.data.splice(newSize - this.state.maxPoints);
                }
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
