async function preparecommitlinechart(values) {
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
  let y_draws = [];
  let ttinfo_right = [];
  let ttinfo_left = [];
  let commitids = [];

  for (var commit in data) {
    let time = new Date(data[commit]["dateCreated"]).toLocaleDateString(
      "de-DE"
    );
    x.push(time);
    y_right.push(
      ((data[commit][values]["r"] / data[commit]["nmatches"]) * 100).toFixed(2)
    );
    y_left.push(
      ((data[commit][values]["l"] / data[commit]["nmatches"]) * 100).toFixed(2)
    );
    y_draws.push(
      ((data[commit][values]["tie"] / data[commit]["nmatches"]) * 100).toFixed(
        2
      )
    );
    ttinfo_right.push(
      "CID: " +
        commit +
        " <br>ID: " +
        data[commit]["id"] +
        " <br>nMatches: " +
        data[commit]["nmatches"] +
        " <br>TeamName: " +
        data[commit]["team_r"] +
        " <br>Wins: " +
        data[commit]["wins"]["r"]
    );
    ttinfo_left.push(
      "CID: " +
        commit +
        " <br>ID: " +
        data[commit]["id"] +
        " <br>nMatches: " +
        data[commit]["nmatches"] +
        " <br>TeamName: " +
        data[commit]["team_l"] +
        " <br>Wins: " +
        data[commit]["wins"]["l"]
    );
    commitids.push(commit);
  }

  buildCommitLineChart(
    x,
    y_right,
    y_left,
    y_draws,
    ttinfo_right,
    ttinfo_left,
    commitids
  );
}

function buildCommitLineChart(
  datax,
  y_right,
  y_left,
  y_draws,
  ttinfo_right,
  ttinfo_left,
  commitids,
) {
  let element_id = "commitLineChart";

  let dataset_r = {
    type: "bar",
    x: datax,
    y: y_right,
    line: {
      width: PLOTLY_CONFIG.data.line_width,
      color: PLOTLY_CONFIG.color.fra_uas,
    },
    hovertext: ttinfo_right,
    text: y_right,
    textposition: "auto",
    hoverinfo: "text",
  };

  let dataset_l = {
    type: "bar",
    x: datax,
    y: y_left,
    line: {
      width: PLOTLY_CONFIG.data.line_width,
      color: PLOTLY_CONFIG.color.opponent,
    },
    hovertext: ttinfo_left,
    text: y_left,
    textposition: "auto",
    hoverinfo: "text",
  };

  let dataset_draw = {
    type: "bar",
    x: datax,
    y: y_draws,
    marker: {
      color: PLOTLY_CONFIG.color.neutral,
      line: {
        width: PLOTLY_CONFIG.data.line_width,
        color: PLOTLY_CONFIG.color.neutral,
      },
    },
    text: y_draws.map(String),
    textposition: "auto",
    hoverinfo: "none",
  };

  let plotData = [dataset_r, dataset_l, dataset_draw];
  //console.log(plotData);

  let layout = {
    yaxis: {
      title: "% Wins/Loss/Ties",
      titlefont: {
        size: 16,
        color: "rgb(107, 107, 107)",
      },
    },
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


  document.getElementById(element_id).on("plotly_click", (plotData) => {
    let cid = "";
    for(var i=0; i < plotData.points.length; i++){
        cid = commitids[plotData.points[i].pointNumber];
    }
    click_specific_commit();
    setCurrentCommit(cid);
  });
}
