/**
 * Plotly Boxplot class
 */
class Boxplot extends IChart {
  element_id = "boxplot";

  layout = {
    //displayModeBar: false,
    font: { size: 16 },
    showlegend: false,
    margin: { t: 0, b: 30, l: 40, r: 10 },
  };

  prepareData(commitData, propertyName) {
    let shots_on_target_l = commitData.shots_on_target_l;
    let shots_on_target_r = commitData.shots_on_target_r;

    shots_on_target_l.label = commitData.team_l;
    shots_on_target_r.label = commitData.team_r;

    shots_on_target_l.color = PLOTLY_CONFIG.color.opponent;
    shots_on_target_r.color = PLOTLY_CONFIG.color.fra_uas;

    //let values = [shots_on_target_r, shots_on_target_l];
    let values = PlotData.getDualProperty(commitData, propertyName);

    this.plotData = [];
    values.forEach((boxplot) => {
      this.plotData.push({
        type: "box",
        lowerfence: [boxplot.min],
        q1: [boxplot.q25],
        median: [boxplot.avg],
        q3: [boxplot.q75],
        upperfence: [boxplot.max],
        fillcolor: boxplot.color,
        line: {
          width: PLOTLY_CONFIG.data.line_width,
          color: "#000000",
        },
        name: boxplot.label,
        x0: boxplot.label,
      });
    });
  }

  constructor(commitData, propertyName) {
    super();
    this.create(commitData, propertyName);
  }
}
