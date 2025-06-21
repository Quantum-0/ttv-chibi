console.log("Debugging into div is enabled");
const oldConsoleLog = console.log;
const oldConsoleError = console.error;

console.log = function(message) {
    oldConsoleLog.apply(console, arguments);

    const logDiv = document.getElementById('debug-log');
    const logMessage = document.createElement('div');
    logMessage.textContent = message;
    logMessage.style.marginTop = "-4px";
    logMessage.style.marginBottom = "-4px";
    logDiv.appendChild(logMessage);
    if (logDiv.childElementCount > 25)
        logDiv.removeChild(logDiv.children[0]);
};

console.error = function(message) {
    oldConsoleError.apply(console, arguments);

    const logDiv = document.getElementById('debug-log');
    const logMessage = document.createElement('div');
    logMessage.classList.add('w3-red');
    logMessage.textContent = message;
    logMessage.style.marginTop = "-4px";
    logMessage.style.marginBottom = "-4px";
    logDiv.appendChild(logMessage);
    if (logDiv.childElementCount > 25)
        logDiv.removeChild(logDiv.children[0]);
};

function debug_chibi_state(state) {
    document.getElementById('debug_status').innerText = state;
}

function upd_state_timer() {
    const ms = Date.now() - last_state_update;
    document.getElementById('state_timer').innerText = `${ms}ms`;
}

setInterval(upd_state_timer, 50);