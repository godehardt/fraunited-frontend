/**
 * This File is necessary to provide initialized CSS.
 *
 * Other dynamically changed CSS can be inserted here.
 *
 * @author Nils Jorek.
 * @since  01.04.2020
 */

/**
 * This method adds Shadow to all Cards in our HTML on Hover
 */
function addShadow() {
  $(document).ready(function () {
    if (GLOBAL_CONFIG.html_modules_loaded) {
      $(".card").hover(
        function () {
          $(this).addClass("shadow-lg").css("cursor", "pointer");
        },
        function () {
          $(this).removeClass("shadow-lg");
        }
      );
    }
  });
}
