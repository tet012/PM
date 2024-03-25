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
const color_1 = R_Col(SP)
const color_2 = R_Col(SP)
let h_factor


function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, color_1);
    gradient.addColorStop(1, color_2);

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const smooth_factor = 4
    const scaleFactor = 10
    const resolution = 10
    const frequency = 8
    const phaseShift = Math.random() * 1;
    const flowField = flowfield(W, H, resolution, phaseShift, scaleFactor, frequency);
    const totalFlowers = Math.random() * 3 + 1;
    h_factor = 50
    const angleType = R.random_choice(['straight', 'curvy', 'random']);

    for (let f = 0; f < totalFlowers; f++) {
        const flower_color = R_Col(SP)
        const core_color = R_Col(SP)
        const startY = H * 0.9;
        const p = Math.floor(Math.random() * 10 + 5);
        const startX = W / 3 + Math.random() * (W / 3);
        const flower = new Flower(startX, startY, p, h_factor, smooth_factor, flowField, resolution, f, totalFlowers, angleType, flower_color, core_color);
        flower.draw();
        flower.drawCore()
    }

    ctx.beginPath();
    ctx.moveTo(W * 0.3, H * 0.9);
    ctx.lineTo(W * 0.7, H * 0.9);
    ctx.strokeStyle = 'black'; ctx.lineWidth = 2;
    ctx.stroke();
}

animate();

