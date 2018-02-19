import { h, Component } from 'preact';
import style from './style';
import * as d3 from "d3";
import Button from 'preact-material-components/Button';
import 'preact-material-components/Button/style.css';

/**
 * https://bl.ocks.org/mbostock/4060954
 */
export default class Streamgraph extends Component {

	render(){
		return (
			<div class={style.profile}>
				<svg width="960" height="500"></svg>
				<Button raised ripple onClick={this.transition}>Click Me</Button>
			</div>
		);
	}

	componentDidMount(){
		this.drawChart();
	}

	drawChart(){
		var n = 20, // number of layers
			m = 200, // number of samples per layer
			k = 10; // number of bumps per layer

		let stack = d3.stack().keys(d3.range(n)).offset(d3.stackOffsetWiggle)
		this.layers0 = stack(d3.transpose(d3.range(n).map(function() { return bumps(m, k); })))
		this.layers1 = stack(d3.transpose(d3.range(n).map(function() { return bumps(m, k); })))
		this.layers = this.layers0.concat(this.layers1);

		var svg = d3.select("svg"),
			width = +svg.attr("width"),
			height = +svg.attr("height");

		var x = d3.scaleLinear()
			.domain([0, m - 1])
			.range([0, width]);

		var y = d3.scaleLinear()
			.domain([d3.min(this.layers, stackMin), d3.max(this.layers, stackMax)])
			.range([height, 0]);

		var z = d3.interpolateCool;

		this.area = d3.area()
			.x(function(d, i) { return x(i); })
			.y0(function(d) { return y(d[0]); })
			.y1(function(d) { return y(d[1]); });

		svg.selectAll("path")
			.data(this.layers0)
			.enter().append("path")
			.attr("d", this.area)
			.attr("fill", function() { return z(Math.random()); });

		function stackMax(layer) {
			return d3.max(layer, function(d) { return d[1]; });
		}

		function stackMin(layer) {
			return d3.min(layer, function(d) { return d[0]; });
		}

// Inspired by Lee Byron’s test data generator.
		function bumps(n, m) {
			var a = [], i;
			for (i = 0; i < n; ++i) a[i] = 0;
			for (i = 0; i < m; ++i) bump(a, n);
			return a;
		}

		function bump(a, n) {
			var x = 1 / (0.1 + Math.random()),
				y = 2 * Math.random() - 0.5,
				z = 10 / (0.1 + Math.random());
			for (var i = 0; i < n; i++) {
				var w = (i / n - y) * z;
				a[i] += x * Math.exp(-w * w);
			}
		}
	}

	transition = () => {
		console.log('transition');
		var t;
		d3.selectAll("path")
			.data((t = this.layers1, this.layers1 = this.layers0, this.layers0 = t))
			.transition()
			.duration(2500)
			.attr("d", this.area);
	}
}