document.addEventListener('click', function(event) {
    // Your code to execute when the background is clicked
    console.log('Background was clicked!');
    // Example: Change background color
    document.body.style.backgroundColor = 'lightblue';

    // const clientX = event.clientX;
    // const clientY = event.clientY;
    const pageX = event.pageX;
    const pageY = event.pageY;

    // console.log(`Viewport coordinates: X=${clientX}, Y=${clientY}`);
    console.log(`Document coordinates: X=${pageX}, Y=${pageY}`);
    target_handler(pageX / window.innerWidth, 1 - (pageY / window.innerHeight));
});

let ws = new WebSocket(`wss://heat-api.j38.net/channel/187855891`);
ws.addEventListener('message', (message) => {
    // Parse message data.
    let data = JSON.parse(message.data);

    // Write to console.
    console.log(data);
    // data.x, data.y
    target_handler(data.x, data.y);
});

function target_handler(x, y) {
    x = Math.round(x * 100) / 100;
    y = Math.round(y * 100) / 100;
    const new_target = {x, y}
    target_list.push(new_target);
    console.log(`Add new target: {${new_target.x}, ${new_target.y}}`);
}