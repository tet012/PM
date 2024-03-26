const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
let R = new Random();

const W = 550;
const H = 900;

canvas.width = W;
canvas.height = H;

const middleX = canvas.width / 2;
const middleY = canvas.height / 2;

const selectedPalette = R.random_int(0, 10);
const SP = pals[selectedPalette].map(val => `hsl(${val})`);

let mode = R.random_int(0, 2);
let numSides = R.random_int(3, 6);

let h_factor
let wOff = R.random_num(0.1, 0.4)
let startY = H * 0.9;

function animate() {
    if (R.random_bool(0.5)) {
        color_1 = R_Col(SP)
        color_2 = R_Col(SP)
    } else {
        color_1 = color_2 = R_Col(SP)
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, color_1);
    gradient.addColorStop(1, color_2);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const smooth_factor = R.random_int(0, 4);

    const resolution = 30;
    const noiseScale = 0.0001;
    const noiseStrength = 1.5;
    const angleOffset = -Math.PI / 4;

    const flowField = flowfield(W, H, resolution, noiseScale, noiseStrength, angleOffset);

    const totalFlowers = R.random_num(1, 50);
    // const totalFlowers = Math.random() * 50 + 1;
    h_factor = R.random_num(1, 50)

    const sunX = W * R.random_num(0, 1);
    const sunY = H * R.random_num(0, .7);
    const sunRadius = R.random_num(125, 250)
    drawSun(sunX, sunY, sunRadius);


    const angleType = R.random_choice(['straight', 'curvy', 'random']);
    for (let f = 0; f < totalFlowers; f++) {
        const fc_1 = R_Col(SP);
        const fc_2 = R_Col(SP);
        const core_color = R_Col(SP);
        const p = Math.floor(R.random_num(5, 10));
        startX = W / 3 + R.random_num(0, 1) * (W / 3);
        const flower = new Flower(startX, startY, p, h_factor, smooth_factor, flowField, resolution, f, totalFlowers, angleType, fc_1, fc_2, core_color);
        flower.draw();
    }

    drawGround();
}

function drawGround() {
    const xOff = W * 0.3;
    ctx.save();
    for (let i = xOff; i < W - xOff; i += 1) {
        const p_size = 2
        ctx.fillStyle = 'black';
        ctx.fillRect(i, H * 0.9 - p_size / 2, p_size, p_size);
    }
    ctx.restore();
}

function drawSun(x, y, radius) {
    ctx.save();

    ctx.shadowColor = 'rgba(255, 255, 0, 0.5)';
    ctx.shadowBlur = 160;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, 'rgba(255, 255, 0, 0.9)');
    gradient.addColorStop(1, 'rgba(255, 255, 0, 0.6)');
    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.restore();
}


animate();