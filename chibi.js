let chibi_state = "";
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

const target_list = [];
let current_target = null;
let last_state_update = Date.now()

function change_state(state) {
    if (state === chibi_state)
        return;
    console.log(`Changing chibi state to '${state}'`);
    if (!["sit", "sit_down", "fall_asleep", "sleep", "wake_up", "get_up", "stay", "walk", "fall", "climb"].includes(state)) {
        console.error(`Unknown state: ${state}`);
        return;
    }
    last_state_update = Date.now()
    debug_chibi_state(state);
    for (let i = 0; i < imageContainer.children.length; i++) {
        imageContainer.children[i].style.display = 'none';
    }

    let imgElement;
    switch (state) {
        case "sit":
            chibi_state = "sit";
            imgElement = document.getElementById('img_sit');
            break;
        case "sit_down":
            chibi_state = "sit_down";
            imgElement =  document.getElementById('img_sit_down');
            // document.getElementById('img_sit_down').src = document.getElementById('img_sit_down').src.split('?')[0] + '?' + new Date().getTime();
            setTimeout(() => change_state("sit"), 1000);
            break;
        case "fall_asleep":
            chibi_state = "fall_asleep";
            imgElement = document.getElementById('img_fall_asleep');
            // document.getElementById('img_sit_down').src = document.getElementById('img_sit_down').src.split('?')[0] + '?' + new Date().getTime();
            setTimeout(() => change_state("sleep"), 2000);
            break;
        case "sleep":
            chibi_state = "sleep";
            imgElement = document.getElementById('img_sleep');
            break;
        case "wake_up":
            chibi_state = "wake_up";
            imgElement = document.getElementById('img_wake_up');
            setTimeout(() => change_state("sit"), 1000);
            break;
        case "get_up":
            chibi_state = "get_up"
            imgElement = document.getElementById('img_get_up');
            setTimeout(() => change_state("stay"), 1000);
            break;
        case "stay":
            chibi_state = "stay";
            imgElement = document.getElementById('img_stay');
            break;
        case "walk":
            chibi_state = "walk";
            imgElement = document.getElementById('img_walk');
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
    imgElement.style.display = 'block';
    imgElement.src = imgElement.src.split('?')[0] + '?' + new Date().getTime();
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

function chibiGotoSmart() {
    if (chibi_state === "sleep") {
        change_state("wake_up");
        setTimeout(chibiGotoSmart, 1000+30);
        return;
    }

    if (chibi_state === "sit") {
        change_state("get_up");
        setTimeout(chibiGotoSmart, 1000+30);
        return;
    }

    if (current_target.y < 1/16) {
        chibiGoto(current_target.x, 0);
    }

    // Определяем как дойти до точки
    // chibiGoto по порядку
    //  не высоко - доходим снизу и прыгаем
    //  на земле - доходим и достаём
    //  у стены - доходим до стены, залезаем, хватаем
    //  другое место - залезаем на потолок, оттуда прыгаем, хватаем

    setTimeout(() => check_catch_target(chibiGotoSmart));
}

function check_catch_target(callback) {
    if (current_target === null)
        return;

    const delta_x = Math.abs(chibi_x - current_target.x);
    const delta_y = Math.abs(chibi_y - current_target.y);
    if (delta_x < 1/16 && delta_y < 1/16) {
        current_target = null;
        console.log("Target was caught");
        callback();
    }
    else
    {
        setTimeout(() => check_catch_target(callback), 10);
    }
}

function timer_update() {
    const now = Date.now();

    if ((chibi_state === "stay") && (now - last_state_update) > 10000) {
        change_state("sit_down");
    }
    if ((chibi_state === "sit") && (now - last_state_update) > 20000) {
        change_state("fall_asleep");
    }
    if ((chibi_state === "sleep") && (now - last_state_update) > 30000 && Math.random() < 0.05) {
        change_state("wake_up");
    }

    if (target_list.length === 0)
        return;

    current_target = target_list.pop();
    console.log("Got new target");
    chibiGotoSmart();
}


setInterval(timer_update, 1000);
change_state("stay");