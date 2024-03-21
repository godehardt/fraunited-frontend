/**
 * Method is used on the Match Tab Get Match Button
 *
 * @see GLOBAL_CONFIG.match_id
 * @fires loadCharts, click_specific_match
 */
async function setMatch() {
  var matchInput = $("#matchForm");

  GLOBAL_CONFIG.match_id = matchInput.val();
  // We have to wait for our charts to be initialized
  loadCharts().then(() => {
    click_specific_match();
    activeTab("tab-specific-match");
  });
}
