/**
 * Plotly mirrored bar chart
 */
class ComparisonChart extends IChart {
  element_id = "comparisonChart";

  layout = {
    font: { size: 16 },
    margin: { t: 0, b: 0, l: 130, r: 30 },
    barmode: "stack",
    showlegend: true,
    legend: { orientation: "h" },
    hovermode: true,
    xaxis: { side: "top" },
  };

  prepareData(commitData, propertyName) {
    //TODO: make labels and colums dynamic (or let it be static)

    const labels = [
      "Goals",
      "Possession",
      "Passes",
      "Ball on Side",
      "Corners",
      "Fouls",
      "Free Kicks",
      "Offside",
      "Pass chains",
      "Red cards",
      "Yellow cards",
      "Tackles",
      "Shots on Target",
    ];

    const chartColumns = [
      "goals",
      "possession",
      "passes",
      "ball_on_side",
      "corners",
      "fouls",
      "free_kicks",
      "offsides",
      "pass_chains",
      "red_cards",
      "yellow_cards",
      "tackles",
      "shots_on_target",
    ];

    //fill the arrays with data
    let base_l = [];
    let data_l = [];
    let data_r = [];

    let leftItem = 0;
    let rightItem = 0;
    let normalizationFactor = 0;

    for (var i = 0; i < chartColumns.length; i++) {
      try {
        leftItem = commitData[chartColumns[i] + "_l"].avg;
        rightItem = commitData[chartColumns[i] + "_r"].avg;

        if (leftItem + rightItem > 0) {
          normalizationFactor = 100 / (leftItem + rightItem);
          data_l.push(normalizationFactor * leftItem);
          base_l.push(-normalizationFactor * leftItem);
          data_r.push(normalizationFactor * rightItem);
        } else {
          data_l.push(0);
          base_l.push(0);
          data_r.push(0);
        }
      } catch (e) {
        console.log("ERROR: i:" + i + " " + chartColumns[i] + e);
      }
    }

    var team_l = {
      x: data_l,
      y: labels,
      base: base_l,
      name: commitData.team_l,
      orientation: "h",
      type: "bar",
      marker: {
        color: PLOTLY_CONFIG.color.opponent,
        width: 1,
        line: {
          width: PLOTLY_CONFIG.data.line_width,
        },
      },
    };

    var team_r = {
      x: data_r,
      y: labels,
      base: 0,
      name: commitData.team_r,
      orientation: "h",
      type: "bar",
      marker: {
        color: PLOTLY_CONFIG.color.fra_uas,
        width: 1,
        line: {
          width: PLOTLY_CONFIG.data.line_width,
        },
      },
    };

    this.plotData = [team_l, team_r];
  }

  constructor(commitData, propertyName) {
    super();
    this.create(commitData, propertyName);
  }
}
