import { h, Component } from 'preact';
import Button from 'preact-material-components/Button';
import 'preact-material-components/Button/style.css';
import style from './style';
import * as d3 from "d3";
import {Config} from '../../config';

export default class Profile extends Component {
	state = {
		time: Date.now(),
		count: 10
	};

	// gets called when this route is navigated to
	componentDidMount() {
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

	// gets called just before navigating away from the route
	componentWillUnmount() {

	}

	// update the current time
	updateTime = () => {
		this.setState({ time: Date.now() });
	};

	increment = () => {
		this.setState({ count: this.state.count+1 });
	};

	transition = () => {
		console.log('transition');
		var t;
		d3.selectAll("path")
			.data((t = this.layers1, this.layers1 = this.layers0, this.layers0 = t))
			.transition()
			.duration(2500)
			.attr("d", this.area);
	}

	// Note: `user` comes from the URL, courtesy of our router
	render({ user }, { time, count }) {
		return (
			<div class={style.profile}>
				<h1>Profile: {user}</h1>
				<svg width="960" height="500"></svg>
				<p>This is the user profile for a user named { user }.</p>

				<div>Current time: {new Date(time).toLocaleString()}</div>

				<p>
					<Button raised ripple onClick={this.transition}>Click Me</Button>
					{' '}
					Clicked {count} times.
				</p>
			</div>
		);
	}

	fetchActivitiesStatsData(callback){
		fetch(`${Config.SERVER_HOST}/api/activitiesstats`,
			{credentials: "same-origin"} // use the cookie of the page's request)
		).then(response => {
			response.json().then(data => {
				callback(data);
			});
		}).catch(reason => {
			console.error(`could not fetch activities stats. reason: ${reason}`);
		});
	}

}
