/**
 * This File is for the FullScreen Support of each Card
 * 
 * @author Anton Beck
 */

function fullscreen(obj) {
  //with ID
  var card = document.getElementById(obj);

  //get ID myself
  /*
  var div = obj.parentNode.parentNode.parentNode.id;
  console.log("Resize: DIV -> " + div.id);
  */
  card.classList.toggle("fullscreen");
  resizeChart(card);
}

function resizeChart(card) {
  try {
    console.log("Resize: CARD -> " + card.id);
    var chart = card.getElementsByClassName("js-plotly-plot")[0];
    console.log("Resize: CHART -> " + chart.id);
    //var chart = document.getElementById("barChart");

    if (chart.classList.contains("max") == true) {
      chart.classList.remove("max");
      chart.classList.add("normal");
    } else {
      chart.classList.remove("normal");
      chart.classList.add("max");
    }

    Plotly.Plots.resize(chart);
  } catch (err) {
    console.log("ERROR: This Fullscreen card has no chart!");
  }
}
