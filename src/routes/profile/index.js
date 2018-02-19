import { h, Component } from 'preact';
import Button from 'preact-material-components/Button';
import 'preact-material-components/Button/style.css';
import style from './style';
import * as d3 from "d3";
import {Config} from '../../config';
import Streamgraph from "../streamgraph";

export default class Profile extends Component {
	state = {
		time: Date.now(),
		count: 10
	};

	// gets called when this route is navigated to
	componentDidMount() {
		this.fetchActivitiesStatsData(data => {
			console.log(data);
		});

	}


	// Note: `user` comes from the URL, courtesy of our router
	render({ user }, { time, count }) {
		return (
			<div class={style.profile}>
				<h1>Profile: {user}</h1>
				<Streamgraph/>
				<p>This is the user profile for a user named { user }.</p>

				<div>Current time: {new Date(time).toLocaleString()}</div>

				<p>

					{' '}
					Clicked {count} times.
				</p>
			</div>
		);
	}



	fetchActivitiesStatsData(callback){
		//const queryUrl = `${Config.SERVER_HOST}/api/activitiesstats`//?afterEpochTs=${this.getAfterDate()}
		const queryUrl = '/resources/demodata/api.activitiesstats.json'; //TODO change!!
		fetch(queryUrl,
			{credentials: "same-origin"} // use the cookie of the page's request)
		).then(response => {
			response.json().then(data => {
				callback(data);
			});
		}).catch(reason => {
			console.error(`could not fetch activities stats. reason: ${reason}`);
		});
	}

	getAfterDate(){
		let days = 90;
		let date = new Date(new Date()-(days*1000*60*60*24));
		return Math.floor(date.getTime() / 1000);
	}

}
