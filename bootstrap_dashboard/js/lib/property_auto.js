/**
 * Properties for Autocompletion, without right left side index as i dont need this currently
 * not used ATM!!!
 * 
 */
var props= [
    "offsides",
    "total_shots",
    "yellow_cards",
    "goal_differences",
    "shots_on_target",
    "total_shots",
    "passes",
    "possession",
    "red_cards",
    "free_kicks",
    "goals",
    "tackles",
    "pass_chains",
]

$('#properties-autocomplete').mdbAutocomplete({
    data: props
    });