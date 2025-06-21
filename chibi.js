let chibi_state = "sit";
let chibi_x = 0.85;
let chibi_y = 0;
let chibi_align = "bottom";
let chibi_look = "left";

let chibi_goto_x = null;
let chibi_goto_y = null;
let fly_speed = 0;
let fly_rotation = 0;

const chibi_width = 100;
const chibi_height = 100;
const imageContainer = document.getElementById('imageContainer');

function change_state(state) {
    if (state === chibi_state)
        return;
    console.log(`Changing chibi state to '${state}'`);
    if (!["sit", "sleep", "stay", "walk", "fall", "climb"].includes(state)) {
        console.error(`Unknown state: ${state}`);
        return;
    }
    debug_chibi_state(state);
    switch (state) {
        case "sit":
            chibi_state = "sit";
            // todo: change image
            break;
        case "sleep":
            chibi_state = "sleep";
            break;
        case "stay":
            chibi_state = "stay";
            break;
        case "walk":
            chibi_state = "walk";
            break;
        case "fall":
            chibi_state = "fall";
            break;
        case "climb":
            chibi_state = "climb";
            break;
        default:
            console.error(`Unknown state: ${state}`);
    }
}

function chibiGoto(x, y, continue_moving=false) {
    if (!continue_moving) {
        console.log(`request chibi go to: ${x}, ${y}`);
        x = Math.min(1, Math.max(0, x));
        y = Math.min(1, Math.max(0, y));
    }
    chibi_goto_x = x;
    chibi_goto_y = y;
}


function continue_moving() {
    if (Math.abs(chibi_x - chibi_goto_x) < 0.002)
        chibi_x = chibi_goto_x;
    if (Math.abs(chibi_y - chibi_goto_y) < 0.002)
        chibi_y = chibi_goto_y;
    if (chibi_y < 0)
        chibi_y = 0;
    if (chibi_y > 1)
        chibi_y = 1;
    if (chibi_x < 0)
        chibi_x = 0;
    if (chibi_x > 1)
        chibi_x = 1;
    if ((chibi_goto_x === chibi_x || chibi_goto_x === null) && (chibi_goto_y === chibi_y || chibi_goto_y === null)) {
        // chibi_goto_x = null;
        // chibi_goto_y = null;
        // change_state("stay");
        // return;
        requestAnimationFrame(continue_moving);
        return;
    }
    if (chibi_goto_y === chibi_y) {
        if (chibi_y === 1) {
            chibi_align = "top";
        }
        else if (chibi_y === 0) {
            chibi_align = "bottom";
        }
        if (chibi_goto_x < chibi_x) {
            chibi_look = "left";
            chibi_x -= 0.001;
        }
        else if (chibi_goto_x > chibi_x) {
            chibi_look = "right";
            chibi_x += 0.001;
        }
        change_state("walk");
    }
    if (chibi_goto_x === chibi_x) {
        if (chibi_x === 1) {
            chibi_align = "right";
        }
        else if (chibi_x === 0) {
            chibi_align = "left";
        }
        if (chibi_goto_y < chibi_y) {
            chibi_look = "down";
            chibi_y -= 0.001;
        }
        if (chibi_goto_y > chibi_y) {
            chibi_look = "up";
            chibi_y += 0.001;
        }
        change_state("walk");
    }
    if (chibi_y < 1 && chibi_y > 0 && chibi_x !== 0 && chibi_x !== 1) {
        change_state("fall");
        chibi_y -= fly_speed;
        fly_speed += 0.0003;
    }
    // else {
    //     fly_speed = 0;
    // }
    else if (chibi_state === "fall" && chibi_y <= 0)
    {
        fly_rotation = 0;
        fly_speed = 0;
        change_state("walk");
        console.log(`Finish falling`);
    }
    // console.log(123);
    requestAnimationFrame(continue_moving);
}
requestAnimationFrame(continue_moving);

function updateImage() {
    // Обновляем позицию
    imageContainer.style.left = `${chibi_x*(window.innerWidth-chibi_width)}px`;
    imageContainer.style.bottom = `${chibi_y*(window.innerHeight-chibi_height)}px`;

    if (chibi_state !== "fall") {
        fly_rotation = 0;
    }
    if (chibi_state === "fall") {
        imageContainer.style.transform = `scale(1, -1) rotate(${fly_rotation}deg)`;
        fly_rotation += 5;
    }
    else if (chibi_align === "left") {
        if (chibi_look === "up")
            imageContainer.style.transform = 'scale(1, -1) rotate(90deg)';
        else if (chibi_look === "down")
            imageContainer.style.transform = 'scale(1, 1) rotate(90deg)';
        else
            console.error(`Unknown chibi_look: ${chibi_look}`);
    }
    else if (chibi_align === "right") {
        if (chibi_look === "up")
            imageContainer.style.transform = 'scale(1, 1) rotate(270deg)';
        else if (chibi_look === "down")
            imageContainer.style.transform = 'scale(1, -1) rotate(270deg)';
        else
            console.error(`Unknown chibi_look: ${chibi_look}`);
    }
    else if (chibi_align === "bottom") {
        if (chibi_look === "right")
            imageContainer.style.transform = 'scale(1, 1) rotate(0deg)';
        else if (chibi_look === "left")
            imageContainer.style.transform = 'scale(-1, 1) rotate(0deg)';
        else
            console.error(`Unknown chibi_look: ${chibi_look}`);
    }
    else if (chibi_align === "top") {
        if (chibi_look === "right")
            imageContainer.style.transform = 'scale(1, -1) rotate(0deg)';
        else if (chibi_look === "left")
            imageContainer.style.transform = 'scale(-1, -1) rotate(0deg)';
        else
            console.error(`Unknown chibi_look: ${chibi_look}`);
    }
    else
        console.error(`Unknown chibi_align: ${chibi_align}`);

    requestAnimationFrame(updateImage);
}
requestAnimationFrame(updateImage);