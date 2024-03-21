var localDataset = null;

let domain = "";

if(process.env.REACT_APP === "development"){   
    domain = 'http://localhost:8080/';

} else {
  domain = 'https://jenkins.informatik.fb2.hs-intern.de/';
}

function buildLineChart(data) {
  localDataset = data;
  //console.log("LINECHART" + typeof data);
  var ctxL = document.getElementById("lineChart").getContext("2d");
  window.myLineChart = new Chart(ctxL, {
    type: "line",
    data: {
      labels: Object.values(data).map((element) => element.id),
      datasets: [
        {
          label: "total_shots_l",
          backgroundColor: ["rgba(105, 0, 132, .2)"],
          borderColor: ["rgba(200, 99, 132, .7)"],
          borderWidth: 2,
          data: Object.values(data).map((element) => element.total_shots_l),
        },
        {
          label: "total_shots_r",
          backgroundColor: ["rgba(0, 137, 132, .2)"],
          borderColor: ["rgba(0, 10, 130, .7)"],
          data: Object.values(data).map((element) => element.total_shots_r),
        },
      ],
    },
    options: {
      onClick: clickEvent2,
      responsive: true,
    },
  });
}

function clickEvent2(evt, item) {
  var left = Object.values(localDataset).map(
    (element) => element.total_shots_l
  );

  var right = Object.values(localDataset).map(
    (element) => element.total_shots_r
  );

  //console.log("EVENT: chart clicked", evt);
  if (item[0]) {
    var index = item[0]._index;
    console.log("EVENT: Item Index", item[0]._index);

    console.log("VALUE: Left Team: " + left[index]);
    console.log("VALUE: Right Team: " + right[index]);

    click_specific_commit(index);
  }
}

/**
 *
 */
async function loadnmatches() {
  let urls = [];
  var amount_of_matches =
    document.getElementById("amount-of-matches").value || 100;
  for (let i = 1; i <= amount_of_matches; i++){

    urls.push(`${domain}/robocup/match/${i}`);
  }
  try {
    $(".lineChartLoadingSpinner").show();
    console.time("fetch");
    var result = await Promise.all(urls.map((url) => getMatch(url)));
    //console.timeEnd("fetch");
    //console.log("Linechart DATASET: ");
    //console.log(result);
    result = result.map(({ id, total_shots_l, total_shots_r }) => ({
      id,
      total_shots_l,
      total_shots_r,
    }));
    if (window.myLineChart && window.myLineChart != null) {
      console.log("Window is destroyed. ");
      window.myLineChart.destroy();
    }
    buildLineChart(result);
    $(".lineChartLoadingSpinner").hide();
  } catch (error) {
    console.error(error);
  }
}

/**
 * Sends a get request to the match endpoint
 * @param {String} url containing the respective match id
 */
async function getMatch(url) {
  try {
    return await (await fetch(url)).json();
  } catch (error) {
    console.error(error);
  }
}
