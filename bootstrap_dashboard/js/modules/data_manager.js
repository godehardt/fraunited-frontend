class PlotData {
  constructor() {}

  /**
   * Chart Factory
   * @param {JSON} data
   * @param {what to display} property
   */
  static get(data, property) {
    if (variable == "all") {
      return new MultiVariable(plot_data);
    }

    if (stat_type == "wins") {
      return new TripleVariable(plot_data);
    }

    if (stat_type == "shots_on_target") {
      return new DualVariable(plot_data);
    }

    if (stat_type == "ball_on_site") return new HorizontalBar(plot_data);
    if (stat_type == "ball_possession") return new PieChart(plot_data);

    if (stat_type == "radarChart") return new RadarChart(plot_data);
  }

  /**
   * Returns array with left and right values ready to plot
   * @param {json} data
   * @param {json.property} property
   */
  static getDualProperty(data, property) {
    let finished_data = [];

    //set up reference
    let property_name_l = property + "_l";
    let property_name_r = property + "_r";

    let property_data_l = "";
    let property_data_r = "";

    try {
      //get corresponding data
      property_data_l = data[property_name_l];
      property_data_r = data[property_name_r];

      //feed more data to it
      property_data_l.label = data.team_l;
      property_data_r.label = data.team_r;

      property_data_l.color = PLOTLY_CONFIG.color.opponent;
      property_data_r.color = PLOTLY_CONFIG.color.fra_uas;

      finished_data = [property_data_r, property_data_l];
    } catch (error) {
      /*
      console.log(
        "ERROR: Could not get property: '" + property + "' from data:"
      );
      //console.log(data);
      console.log(error);
      */
    }

    return finished_data;
  }

  /**
   * Returns array with left, right and third value ready to plot
   * @param {json} data
   * @param {json.property} property
   */
  static getTripleProperty(data, property) {
    //ex. wins and ties
    let finished_data = [];

    finished_data = [data[property].r, data[property].l, data[property].tie];
    return finished_data;
  }
}
