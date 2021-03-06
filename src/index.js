import React, {
  Component
} from "react";

import keen from "keen-js";

export default class Chart extends React.Component {

  constructor(props){
    super(props);

    this.initChart = this.initChart.bind(this);
  }

  initChart() {
    this._chart = new Keen.Dataviz()
      .el(this._chartRef)
      .chartType(this.props.chartType)
      .title(this.props.title)
      .library(this.props.library)
      .height(this.props.height)
      .width(this.props.width)
      .colors(this.props.colors)
      .colorMapping(this.props.colorMapping)
      .chartOptions(this.props.chartOptions)
      .prepare();
  }
  componentDidMount(){
    this.initChart();
    this.props.client.run(this.props.query, (err, res) => {
      if (err) {
        // Display the API error
        this._chart.error(err.message);
	console.log(err)
      }
      else {
        const customParse = this.props.customFunction;
        let data = res;

        // Handle the response
        if (customParse) {
          data = customParse(data);
        }

	// make sure that we're passing an object with a result
	// key into parseRawData	
        this._chart
          .parseRawData(data instanceof Array ? { result: data } : data)
          .labelMapping(this.props.labelMapping)
          .labels(this.props.labels)
          .render();
      }
    });
  }

  render(){
    return(<div ref={(c) => this._chartRef = c}></div>);
  }

}

Chart.propTypes = {
  client: React.PropTypes.object.isRequired,
  query: React.PropTypes.object.isRequired,
  chartType: React.PropTypes.string.isRequired,
  title: React.PropTypes.string,
  library: React.PropTypes.string,
  height: React.PropTypes.number,
  width: React.PropTypes.number,
  colors: React.PropTypes.array,
  colorMapping: React.PropTypes.object,
  labelMapping: React.PropTypes.object,
  labels: React.PropTypes.array,
  chartOptions: React.PropTypes.object,
  customFunction: React.PropTypes.func,
};

Chart.defaultProps = {
  title: "",
  library: "",
  height: 400,
  width: 600,
  colors: [],
  colorMapping: {},
  labelMapping: {},
  labels: [],
  chartOptions: {},
};
