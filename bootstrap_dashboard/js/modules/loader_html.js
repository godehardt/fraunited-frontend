/**
 * This File is necessary to initialize all the HTML Cards and Modules, File must be loaded in index.html HEAD.
 *
 * Changes here may affect a lot of other files such as loader_chart and all plots.
 *
 * @author Nils Jorek, Anton Beck, Gianni Pasqual
 * @since  01.04.2020
 */

/**
 * Method loads all HTML elements into their according index.html spot.
 *
 * @see GLOBAL_CONFIG.modules, GLOBAL_CONFIG.charts
 */
function loadHtmlElements() {
  GLOBAL_CONFIG.modules.forEach((element) => {
    $(`#${element}`).load(
      `${GLOBAL_CONFIG.html_path_to_modules + element}.html`
    );
  });

  GLOBAL_CONFIG.charts.forEach((chart) => {
    let div_element = `#${chart}_card`;
    let path = `${GLOBAL_CONFIG.html_path_to_charts + "card_" + chart}.html`;
    $.get(path)
      .done(() => {
        // path/ file exists
        $(div_element).load(path);
      })
      .fail(() => {
        // path/ file does not exist
        console.log("LOADERHTML: Did not find -> " + path);
      });
  });
}

/**
 * Method triggers as soon as the HTML DOM is ready.
 *
 * Changes here affect a lot of stuff.
 *
 * @link https://www.w3schools.com/jquery/event_ready.asp
 */
$(document).ready(() => {
  loadHtmlElements();
  loadCharts().then(() => {
    getMetaData();
  });
  $("body").tooltip({
    selector: '[data-toggle="tooltip"]',
  });
});

// TODO FIGURE OUT IF WE CAN DELETE THIS STUFF
jQuery.event.special.touchstart = {
  setup: function (_, ns, handle) {
    if (ns.includes("noPreventDefault")) {
      this.addEventListener("touchstart", handle, { passive: false });
    } else {
      this.addEventListener("touchstart", handle, { passive: true });
    }
  },
};

jQuery.event.special.touchmove = {
  setup: function (_, ns, handle) {
    if (ns.includes("noPreventDefault")) {
      this.addEventListener("touchmove", handle, { passive: false });
    } else {
      this.addEventListener("touchmove", handle, { passive: true });
    }
  },
};
