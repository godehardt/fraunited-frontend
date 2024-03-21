/**
 * Plotly Horizontal Bar Chart class
 */
class M_HorizontalBar extends IChart {
  element_id = "match_HorizontalBar";

  layout = {
    font: { size: 16 },
    margin: { t: 70, b: 100, l: 50, r: 30 },
    barmode: "stack",
    showlegend: true,
    legend: { orientation: "h", traceorder: "normal" },
    hovermode: false,
    xaxis: { visible: false },
  };

  prepareData(data, property) {
    //set up reference
    let property_name_l = property + "_l";
    let property_name_r = property + "_r";

    //shorten the values
    let values = [data[property_name_l], data[property_name_r]];

    var team_l = {
      x: [values[0]],
      y: [""],
      name: data.team_l,
      orientation: "h",
      type: "bar",
      text: [values[0] + "% "],
      textposition: "auto",
      marker: {
        color: PLOTLY_CONFIG.color.opponent,
        width: 1,
        line: {
          width: PLOTLY_CONFIG.data.line_width,
        },
      },
    };

    var team_r = {
      x: [values[1]],
      y: [""],
      name: data.team_r,
      orientation: "h",
      type: "bar",
      text: [values[1] + "% "],
      textposition: "auto",
      marker: {
        color: PLOTLY_CONFIG.color.fra_uas,
        width: 1,
        line: {
          width: PLOTLY_CONFIG.data.line_width,
        },
      },
    };

    this.plotData = [team_r, team_l];
  }

  constructor(commitData, propertyName) {
    super();
    this.create(commitData, propertyName);
  }
}
