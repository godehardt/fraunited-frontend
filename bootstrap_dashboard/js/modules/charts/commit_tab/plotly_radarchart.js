/**
 * Plotly Radar Chart class
 */
class RadarChart extends IChart {
  element_id = "radarChart";

  radius = 100;

  layout = {
    font: { size: 16 },
    showlegend: false,
    margin: { t: 25, b: 25, l: 30, r: 30 },
    polar: {
      radialaxis: {
        visible: true,
        range: [0, this.radius],
      },
    },
  };

  prepareData(commitData, propertyName) {
    //TODO: make labels and colums dynamic (or let it be static)

    //same as columns, but with no underscore
    let labels = [
      "goals",
      "total shots",
      "shots on target",
      "corners",
      "fouls",
      "tackles",
      "free kicks",
      "passes",
    ];

    //Normalizing part
    const radarColumns = [
      "goals",
      "total_shots",
      "shots_on_target",
      "corners",
      "fouls",
      "tackles",
      "free_kicks",
      "passes",
    ];
    // prepare datasets
    let data_l = [];
    let data_r = [];

    let leftItem = 0;
    let rightItem = 0;
    let normalizationFactor = 0;

    for (var i = 0; i < radarColumns.length; i++) {
      try {
        leftItem = commitData[radarColumns[i] + "_l"].avg;
        rightItem = commitData[radarColumns[i] + "_r"].avg;

        if (leftItem + rightItem > 0) {
          normalizationFactor = this.radius / (leftItem + rightItem);
          data_l.push(normalizationFactor * leftItem);
          data_r.push(normalizationFactor * rightItem);
        } else {
          data_l.push(0);
          data_r.push(0);
        }
      } catch (e) {
        console.log("ERROR: i:" + i + " " + radarColumns[i] + e);
      }
    }

    this.plotData = [
      {
        type: "scatterpolar",
        r: data_r,
        theta: labels,
        fill: "toself",
        name: commitData.team_r,
        marker: {
          color: PLOTLY_CONFIG.color.fra_uas,
          line: {
            width: 0,
          },
        },
      },
      {
        type: "scatterpolar",
        r: data_l,
        theta: labels,
        fill: "toself",
        name: commitData.team_l,
        marker: {
          color: PLOTLY_CONFIG.color.opponent,
          line: {
            width: 0,
          },
        },
      },
    ];
  }

  constructor(commitData, propertyName) {
    super();
    this.create(commitData, propertyName);
  }
}
