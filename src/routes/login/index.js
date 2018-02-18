import { h, Component } from 'preact';
import style from './style';
import Button from 'preact-material-components/Button';
import 'preact-material-components/Button/style.css';
import { route } from 'preact-router';
import {Config} from '../../config';


export default class Login extends Component {

	render() {
		return (
			<div class={style.login}>
				{this.state.displayName ? <h1>Hello ${this.state.displayName}</h1> : ''}
				<Button raised ripple onClick={this.onLoginClick}>Login With Strava</Button>
			</div>
		);
	}

	onLoginClick(){
		fetch(`${Config.SERVER_HOST}/auth/strava/login/do`).then(response => {
			response.json().then(data => {
				if (data && data.displayName) {
					this.setState({displayName: data.displayName});
					route('/profile'); // go to dashboard
				} else {
					console.error(`something failed concerning the login`);
				}
			});
		}).catch(reason => {
			console.error(`performing login click failed. reason: ${reason}`);
		});
	}
}
