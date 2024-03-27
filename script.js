const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
let R = new Random();

// Global
const W = 700;
const H = 1080;
canvas.width = W;
canvas.height = H;

// Colors
const selectedPalette = R.random_int(0, 10);
const SP = pals[selectedPalette].map(val => `hsl(${val})`);

// Ground
let wOff = R.random_num(0.1, 0.4)
let startY = H * 0.9;

// Background
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


// Flow field
const resolution = 30;
const noiseScale = 0.0001;
const noiseStrength = 1.5;
const angleOffset = -Math.PI / 4;
const flowField = flowfield(W, H, resolution, noiseScale, noiseStrength, angleOffset);

// Flowers
const totalFlowers = R.random_num(1, 50);
let h_factor = R.random_num(1, 150)
let striped_stem = R.random_bool(0.5);
const smooth_factor = R.random_int(0, 4);
const angleType = R.random_choice(['straight', 'curvy', 'random']);

// Petals Shape
let mode = R.random_int(0, 2);
let numSides = R.random_int(3, 8);
const angleStep = (Math.PI * 2) / numSides;
const messy_ellipse = R.random_bool(0.6);
let ellipse_resolution;
if (messy_ellipse) {
    ellipse_resolution = R.random_num(0.1, 0.0001)
} else {
    ellipse_resolution = 0.001
}

// Petals Colors
const fs_1 = R.random_num(0, 1)
const fs_2 = R.random_num(0, 1)
const stripeMode = R.random_bool(0.1);
if (stripeMode) {
    numStripes = R.random_int(1, 10);
} else {
    numStripes = 3
}

// Sun
const sunX = W * R.random_num(0, 1);
const sunY = H * R.random_num(0, .7);
const sunRadius = R.random_num(125, 250)
drawSun(sunX, sunY, sunRadius);

function draw() {
    for (let f = 0; f < totalFlowers; f++) {
        const fc_1 = R_Col(SP);
        const fc_2 = R_Col(SP);
        const core_color = R_Col(SP);
        const p = Math.floor(R.random_num(5, 10));
        startX = W / 3 + R.random_num(0, 1) * (W / 3);
        const flower = new Flower(startX, startY, p, h_factor, smooth_factor, flowField, resolution, f, totalFlowers, angleType, fc_1, fc_2, core_color, fs_1, fs_2);
        flower.draw();
    }
    drawGround();
    granulate(15)
}

function drawGround() {
    const xOff = W * 0.3;
    ctx.save();
    for (let i = xOff; i < W - xOff; i += 1) {
        const p_size = 2
        ctx.fillStyle = 'black';
        ctx.fillRect(i, startY - p_size / 2, p_size, p_size);
    }
    ctx.restore();
}

function drawSun(x, y, radius) {
    ctx.save();

    ctx.shadowColor = 'rgba(255, 255, 0, 1)';
    ctx.shadowBlur = 160;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    const sun_circle = R.random_bool(0.5);

    for (let i = 0; i < 6; i++) {
        ctx.beginPath();
        if (sun_circle) {
            ctx.arc(x, y, radius * i / 5, 0, 2 * Math.PI);
        } else {
            ctx.fillRect(x - radius * i / 10, y - radius * i / 10, radius * i / 5, radius * i / 5);
        }
        sc_1 = 0.9 - i * 0.2;
        sc_2 = 0.6 - i * 0.2;
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, `rgba(255, 255, 0, ${sc_1}`);
        gradient.addColorStop(1, `rgba(255, 255, 0, ${sc_2}`);
        ctx.fillStyle = gradient;
        ctx.fill();
    }
    ctx.restore();
}

function granulate(amount) {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    for (let i = 0; i < pixels.length; i += 4) {
        let grainAmount = Math.random() * (amount * 2) - amount;
        pixels[i] = Math.max(0, Math.min(255, pixels[i] + grainAmount));
        pixels[i + 1] = Math.max(0, Math.min(255, pixels[i + 1] + grainAmount));
        pixels[i + 2] = Math.max(0, Math.min(255, pixels[i + 2] + grainAmount));
    }
    ctx.putImageData(imageData, 0, 0);
}



draw();