console.log("Debugging into div is enabled");
const oldConsoleLog = console.log;
const oldConsoleError = console.error;

console.log = function(message) {
    oldConsoleLog.apply(console, arguments);

    const logDiv = document.getElementById('debug-log');
    const logMessage = document.createElement('div');
    logMessage.textContent = message;
    logDiv.appendChild(logMessage);
    if (logDiv.childElementCount > 10)
        logDiv.removeChild(logDiv.children[0]);
};

console.error = function(message) {
    oldConsoleError.apply(console, arguments);

    const logDiv = document.getElementById('debug-log');
    const logMessage = document.createElement('div');
    logMessage.classList.add('w3-red');
    logMessage.textContent = message;
    logDiv.appendChild(logMessage);
    if (logDiv.childElementCount > 10)
        logDiv.removeChild(logDiv.children[0]);
};

function debug_chibi_state(state) {
    document.getElementById('debug_status').innerText = state;
}