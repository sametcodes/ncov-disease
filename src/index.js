import React, { Component } from "react";
import ReactDOM from "react-dom";
import ReactTooltip from "react-tooltip";

import "./styles.css";

import MapChart from "./MapChart";

class App extends Component {
  state = {
    day: "1/22/20",
    confirmeds_data: [],
    confirmeds: [],
    tooltipContent: ""
  };
  getTomorrow = strDate => {
    let today = new Date(strDate);
    let tomorrow = new Date(today.setDate(today.getDate() + 1));
    return (
      tomorrow.getMonth() +
      1 +
      "/" +
      tomorrow.getDate() +
      "/" +
      String(tomorrow.getFullYear()).slice(0, 2)
    );
  };
  runDisease = () => {
    this.disease = setInterval(() => {
      let tomorrow = this.getTomorrow(this.state.day);
	  this.setState({ day: tomorrow });
	  if(tomorrow === this.state.last_date){
		clearInterval(this.disease);
		return;
	  }
    }, 150);
  }
  componentDidMount() {
    fetch("https://api.opencovid19.com/v1/confirmed")
	  .then(res => res.json())
	  .then(res => {
		  this.setState({ confirmeds_data: res, day: "1/22/20", last_date: Object.keys(res[0]).slice(-1)[0] });
		  this.runDisease();
	  });
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.day !== this.state.day) {
      let confs = this.state.confirmeds_data.map((confirmed, key) => {
        const state = confirmed.province_State;
        const count = confirmed[this.state.day];
        const { lat, long } = confirmed;
        return {
          key,
          name: state,
          count,
          coordinates: [long, lat]
        };
      }).filter(Boolean);
      this.setState({ confirmeds: confs });
    }
  }
  setTooltipContent(content) {
    this.setState({ tooltipContent: content });
  }
  render() {
    return (
      <div>
        <MapChart
          date={this.state.day}
          confirmeds={this.state.confirmeds}
          setTooltipContent={this.setTooltipContent.bind(this)}
        />
        <ReactTooltip>{this.state.tooltipContent}</ReactTooltip>
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
