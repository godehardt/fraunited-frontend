/**
 * This File is for the Status LED inside the index.html HEAD
 * 
 * @author Robin Diemar
 */

$('#status-led').tooltip();
async function checkStatus() {
    statusLED = $('#status-led')[0];
    LED_yellow = '#FF0';
    LED_green = '#69DD00';
    LED_red = '#FF0420';

    statusLED.style['background-color'] = LED_yellow;
    statusLED.title = 'Serverstatus wird überprüft...';
    await fetch(GLOBAL_CONFIG.commit_url)
    .then(() => {
        statusLED.style['background-color'] = LED_green;
        statusLED.title = 'Server verfügbar.';
    }).catch(() => {
        statusLED.style['background-color'] = LED_red;
        statusLED.title = 'Server offline!';
    });
}