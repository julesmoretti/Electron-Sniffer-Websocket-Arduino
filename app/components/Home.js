// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import routes from '../constants/routes';
import styles from './Home.css';

const ipc = require('electron').ipcRenderer;
// const openSocket = require('socket.io-client');

// type Props = {};

const URL = 'ws://localhost:8080'
const ws = new WebSocket(URL);

const activeWin = require('active-win');

export default class Home extends React.Component {
  // props: Props;

  constructor(props) {
    super(props);
    this.state = {
      currentWindow: "",
      theme: "innerEnergy",
    };
  }

  componentDidMount() {
	  ws.onopen = () => {
	    // on connecting, do nothing but log it to the console
	    console.log('connected')
	  }

    ws.onmessage = (message) => {
      console.log(message);

	  	switch (message.data) {
  			case "innerEnergySet":
  				this.setState({ theme: 'innerEnergy' });
	  			break;

  			case "energyTransferSet":
  				this.setState({ theme: 'energyTransfer' });
	  			break;
	  	};
    };

	  // ws.onmessage = evt => {
	  //   // on receiving a message, add it to the list of messages
	  //   // const message = JSON.parse(evt.data)
	  //   if (evt.data) {
	  //   	console.log(evt.data);
	  //   }
	  // }

	  // log if elecctron app is blurred or focus (not needed)
		ipc.on('message', (event, message) => {
		  // console.log(message); // logs out "Hello second window!" from main.dev.js
		  // ws.send(message);
		})

		setInterval(() => {
			(async () => {
				const activeWindow = await activeWin();
			    /*
			    {
			        title: 'Unicorns - Google Search',
			        id: 5762,
			        bounds: {
			            x: 0,
			            y: 0,
			            height: 900,
			            width: 1440
			        },
			        owner: {
			            name: 'Google Chrome',
			            processId: 310,
			            bundleId: 'com.google.Chrome',
			            path: '/Applications/Google Chrome.app'
			        },
			        memoryUsage: 11015432
			    }
			    */
			    // console.log("activeWindow");
			    // console.log(activeWindow);
			    // console.log(activeWindow.owner);
			    if (activeWindow
			    	&& activeWindow.owner
			    	&& activeWindow.owner.name
			    	&& this.state.currentWindow !== activeWindow.owner.name
			    ) {
				    console.log(activeWindow.owner.name);
				  	this.setState({ currentWindow: activeWindow.owner.name});
				  	switch (activeWindow.owner.name) {
				  		case "Electron":
				  			ws.send("trigger-on-animation");
				  			break;
				  		case "Terminal":
				  			ws.send("trigger-active-animation");
				  			break;
				  		case "Sublime Text":
				  			ws.send("trigger-passive-animation");
				  			break;
				  		case "Arduino":
				  			ws.send("trigger-off-animation");
				  			break;

			  			case "Sonos":
				  			ws.send("trigger-wtye-animation");
				  			break;

			  			case "Photoshop CC":
				  			ws.send("trigger-etc-animation");
				  			break;

			  			case "Google Chrome":
				  			ws.send("trigger-cynt-animation");
				  			break;

			  			case "Logitech G HUB":
				  			ws.send("black-out");
				  			break;
				  	};
			    }
			})();
		}, 50);
  }

  render() {
    return (
      <div className={styles.container} data-tid="container">
      	<span>{this.state.theme}</span>
      	<span>{this.state.activeWindow}</span>
        <button
        	onClick={() => ws.send("innerEnergy")}
        >Inner Energy</button>
        <br />
        <button
        	onClick={() => ws.send("energyTransfer")}
        >Energy Transfer</button>
      </div>
    );
  }
}
