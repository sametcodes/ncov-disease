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
    today: new Date()
      .toLocaleString()
      .split(" ")[0]
      .slice(0, -3),
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
  runDisease() {
    this.disease = setInterval(() => {
      let tomorrow = this.getTomorrow(this.state.day);
      console.log(tomorrow);
      if (tomorrow === this.state.today) {
        clearInterval(this.disease);
        return;
      }
      this.setState({ day: tomorrow });
    }, 100);
  }
  componentDidMount() {
    fetch("https://quixotic-elf-256313.appspot.com/api/confirmed")
      .then(res => res.json())
      .then(res => {
        this.setState({ confirmeds_data: res, day: "1/22/20" });
        this.runDisease();
      });
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.day !== this.state.day) {
      let confs = this.state.confirmeds_data.map((confirmed, key) => {
        const state = confirmed["Province/State"];
		if(!(this.state.day in confirmed)){
			return null;
		}
        const count = confirmed[this.state.day];
        const { Lat: lat, Long: long } = confirmed;
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
