async function preparecommitcomparisonchart(values, selector) {
  var db_object_name = "AllCommits";
  var data = {};

  if (localData.get(db_object_name) == null) {
    // If we do not have data in the database
    //console.log(`No data stored in local_storage for commit_id: ${commitId}`);
    data = await getAllCommitData(); // Receive the data for the specified CID, property and bin Size
    //console.log(`Data<${typeof data}> saved to local_storage.\nData:\n${data}`);
  } else {
    data = localData.get(db_object_name);
  } // The data is already inside our localStorage -> get it -> map it to data

  let x = [];
  let y_right = [];
  let y_left = [];
  let ttinfo_right = [];
  let ttinfo_left = [];
  let y_max_r = [];
  let y_max_l = [];
  let y_min_r = [];
  let y_min_l = [];

  for (var commit in data) {
    let time = new Date(data[commit]["dateCreated"]).toLocaleDateString(
      "de-DE"
    );
    x.push(time);
    y_right.push(data[commit][`${values}_r`]);
    y_left.push(data[commit][`${values}_l`]);
    y_max_r.push(data[commit][`${values}_r`]["q75"].toFixed(2));
    y_max_l.push(data[commit][`${values}_l`]["q75"].toFixed(2));
    y_min_r.push(data[commit][`${values}_r`]["q25"].toFixed(2));
    y_min_l.push(data[commit][`${values}_l`]["q25"].toFixed(2));
    ttinfo_right.push(
      "CID: " +
        commit +
        " <br>TeamName: " +
        data[commit]["team_r"] +
        ` <br>${values}_r ${selector} Value: ` +
        data[commit][`${values}_r`][selector].toFixed(2) +
        ` <br>${values}_r q75 Value: ` +
        data[commit][`${values}_r`]["q75"].toFixed(2) +
        ` <br>${values}_r q25 Value: ` +
        data[commit][`${values}_r`]["q25"].toFixed(2)
    );
    ttinfo_left.push(
      "CID: " +
        commit +
        " <br>TeamName: " +
        data[commit]["team_l"] +
        ` <br>${values}_l ${selector} Value: ` +
        data[commit][`${values}_l`][selector].toFixed(2) +
        ` <br>${values}_l q75 Value: ` +
        data[commit][`${values}_l`]["q75"].toFixed(2) +
        ` <br>${values}_l q25 Value: ` +
        data[commit][`${values}_l`]["q25"].toFixed(2)
    );
  }

  buildComparisonLineChart(
    x,
    y_right,
    y_left,
    ttinfo_right,
    ttinfo_left,
    selector,
    values,
    y_max_r,
    y_max_l,
    y_min_r,
    y_min_l
  );
}

function buildComparisonLineChart(
  datax,
  y_right,
  y_left,
  ttinfo_right,
  ttinfo_left,
  selector,
  property,
  y_max_r,
  y_max_l,
  y_min_r,
  y_min_l
) {
  let element_id = "commitComparisonChart";

  let val_r = y_right.map((el) => {
    return el[`${selector}`].toFixed(2);
  });

  let upper_r = {
    x: datax,
    y: y_max_r,
    line: {
      width: 2,
      color: PLOTLY_CONFIG.color.fra_uas,
    },
    mode: "markers",
    marker: {
      symbol: "diamond",
      opacity: "0.75",
    },
    showlegend: false,
    type: "scatter",
    hoverinfo: "none",
    type: "scatter",
  };

  let upper_l = {
    x: datax,
    y: y_max_l,
    line: {
      width: 2,
      color: PLOTLY_CONFIG.color.opponent,
    },
    marker: {
      opacity: 0.75,
    },
    hoverinfo: "none",
    mode: "markers",
    type: "scatter",
  };

  let lower_r = {
    x: datax,
    y: y_min_r,
    line: {
      width: 2,
      color: PLOTLY_CONFIG.color.fra_uas,
    },
    marker: {
      symbol: "diamond",
      opacity: "0.75",
    },
    hoverinfo: "none",
    mode: "markers",
    type: "scatter",
  };

  let lower_l = {
    x: datax,
    y: y_min_l,
    line: {
      width: 2,
      color: PLOTLY_CONFIG.color.opponent,
    },
    marker: {
      opacity: 0.75,
    },
    hoverinfo: "none",
    mode: "markers",
    type: "scatter",
  };

  let dataset_r = {
    type: "line",
    x: datax,
    y: val_r,
    // error_y: {
    //   type: "data",
    //   symmetric: false,
    //   array: y_max_r,
    //   arrayminus: y_min_r,
    // },
    line: {
      width: 2,
      color: PLOTLY_CONFIG.color.fra_uas,
    },
    marker: {
      symbol: "diamond",
      opacity: "0.75",
    },
    hovertext: ttinfo_right,
    text: y_right,
    textposition: "auto",
    hoverinfo: "text",
  };

  let val_l = y_left.map((el) => {
    return el[`${selector}`].toFixed(2);
  });

  //console.log(y_max_l);
  //console.log(y_min_l);
  let dataset_l = {
    type: "line",
    x: datax,
    y: val_l,
    // error_y: {
    //   type: "data",
    //   symmetric: false,
    //   array: y_max_l,
    //   arrayminus: y_min_l,
    // },
    line: {
      width: 2,
      color: PLOTLY_CONFIG.color.opponent,
    },
    hovertext: ttinfo_left,
    text: y_left,
    textposition: "auto",
    hoverinfo: "text",
  };

  let plotData = [lower_r, dataset_r, upper_r, lower_l, dataset_l, upper_l];
  // let plotData = [dataset_r, dataset_l];
  //console.log(plotData);

  let layout = {
    yaxis: {
      title: `${selector} value of ${property}`,
      titlefont: {
        size: 16,
        color: "rgb(107, 107, 107)",
      },
    },
    autosize: true,
    showlegend: false,
    font: { size: 16 },
    margin: { t: 10, b: 50, l: 50, r: 10 },
    barmode: "group",
    bargap: 0.15,
    bargroupgap: 0.1,
  };

  Plotly.newPlot(
    element_id,
    plotData,
    $.extend(layout, PLOTLY_CONFIG.layout),
    PLOTLY_CONFIG.config
  );
}

/**
 * This method supports the UI Input for our Histogram, should probably be sorted out of this File later on
 */
function requestCommitComparisonChart() {
  //load the selector Values
  var propertyIn = $("#propertySelectorAllCommitsLine")
    .children("option:selected")
    .val();
  var selector = $("#valueSelectorAllCommitsLine")
    .children("option:selected")
    .val();
  preparecommitcomparisonchart(propertyIn, selector);
}
