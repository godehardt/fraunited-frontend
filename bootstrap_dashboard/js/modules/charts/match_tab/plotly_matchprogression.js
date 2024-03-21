/**
 * Plotly Bar Chart class
 */
class M_Progression extends IChart {
  element_id = "match_Matchprogression";
  labels = [
    "Corners",
    "Fouls",
    "Free Kicks",
    "Goals",
    "Offside",
    "Red cards",
    "Tackles",
    "Yellow cards",
  ];

  chartColumns = [
    "corners",
    "fouls",
    "free_kicks",
    "goals",
    "offsides",
    "red_cards",
    "tackles",
    "yellow_cards",
  ];
  layout = {
    xaxis: {
      range: [ 0, 6000 ]
    },
    yaxis: {
      autorange: false,
      type: 'category',
      categoryorder: 'array',
      categoryarray: this.labels
    },
  };


  prepareData(commitData, propertyName) {
    console.log("Loading data for progression chart");
    console.log(commitData);

    this.plotData = [];
    let x_l = [];
    let x_r = [];
    let y_l = [];
    let y_r = [];
    for (let i = 0; i < this.chartColumns.length; i++) {
      console.log(this.chartColumns[i]);
      x_l = x_l.concat(commitData[this.chartColumns[i] + "_l"]);
      x_r = x_r.concat(commitData[this.chartColumns[i] + "_r"]);
      y_l = y_l.concat((this.labels[i] + "#").repeat(commitData[this.chartColumns[i] + "_l"].length).split("#"));
      y_l.pop();
      y_r = y_r.concat((this.labels[i] + "#").repeat(commitData[this.chartColumns[i] + "_r"].length).split("#"));
      y_r.pop();
    }

    this.data_l = {
      type: "scatter",
      x: x_l,
      y: y_l,
      mode: 'markers',
      name: commitData["team_l"],
      marker: {
        color: PLOTLY_CONFIG.color.opponent,
        symbol: 'circle',
        size: 8,
        line: {
          color: 'rgba(217, 217, 217, 1.0)',
          width: 1,
        },
      }
    };
    this.data_r = {
      type: "scatter",
      x: x_r,
      y: y_r,
      mode: 'markers',
      name: commitData["team_r"],
      marker: {
        color: PLOTLY_CONFIG.color.fra_uas,
        symbol: 'circle',
        size: 8,
        line: {
          color: 'rgba(217, 217, 217, 1.0)',
          width: 1,
        },
      }
    };
    this.plotData.push(this.data_l);
    this.plotData.push(this.data_r);
    console.log(this.plotData);
  }

  constructor(commitData, propertyName) {
    super();
    this.create(commitData, propertyName);
  }
}
