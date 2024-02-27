export const params = {
    //PETALS
    petals: 8,
    width: 25,
    height: 150,
    petalX: 0,
    petalY: 50,

    //SHAPE
    radius_A: 0,
    radius_B: 0,
    radius_C: 0,
    radius_D: 0,

    //LAYER
    layers: 16,
    offsetX: 0,
    offsetY: 0,
    scale: 0.1,

    //ROTATION
    angle: 45,
    rotation: 10,

    //COLOR
    fill: true,
    gradient_direction: 'down',
    color_shift: 10,
    hue_1: 180,
    hue_2: 240,
    opacity_1: 0.9,
    opacity_2: 0.9,

    //STROKE
    strokeWidth: 0,
    strokeStyle: 'solid',

    //FX
    blur: 0,
    shadow: 0,
};

export function generatePetals() {
    const container = document.getElementById('container');
    container.style.position = 'relative';
    container.innerHTML = '';

    for (let j = 1; j <= params.layers; j++) {
        const hue_1 = params.hue_1 + (j - 1) * params.color_shift;
        const hue_2 = params.hue_2 + (j - 1) * params.color_shift;

        const group = document.createElement('div');
        group.className = 'group';
        group.style.position = 'absolute';
        const groupRotation = params.rotation * (j - 1);
        group.style.transform = `translate(${params.offsetX * (j - 1)}px, ${params.offsetY * (j - 1)}px) rotate(${groupRotation}deg)`;

        for (let i = 0; i < params.petals; i++) {
            const scale = 1 + (j - 1) * params.scale;
            const width = params.width * scale;
            const height = params.height * scale;
            const petal = document.createElement('div');

            // SHAPE
            petal.className = 'petal';
            petal.style.width = `${width}px`;
            petal.style.height = `${height}px`;

            petal.style.marginLeft = `-${width / 2}px`;
            petal.style.marginTop = `-${height / 2}px`;

            petal.style.borderRadius = `${params.radius_A}% ${params.radius_B}% ${params.radius_C}% ${params.radius_D}%`;

            // FILL & BORDER
            let direction;
            switch (params.gradient_direction) {
                case 'down':
                    direction = 'to bottom';
                    break;
                case 'up':
                    direction = 'to top';
                    break;
                case 'left':
                    direction = 'to left';
                    break;
                case 'right':
                    direction = 'to right';
                    break;
                default:
                    direction = 'to right';
            }

            const updateStroke = params.strokeWidth + 1
            if (params.fill) {
                petal.style.background = `linear-gradient(${direction}, hsl(${hue_1}, 100%, 50%, ${params.opacity_1}), hsl(${hue_2}, 100%, 50%, ${params.opacity_2}))`;
                petal.style.border = `${params.strokeWidth}px ${params.strokeStyle} hsl(${hue_1}, 100%, 50%)`;
            } else if (params.fill === false) {
                petal.style.border = `${updateStroke}px ${params.strokeStyle} hsl(${hue_1}, 100%, 50%)`;
            }
            petal.style.setProperty('--border-color', `hsl(${hue_1}, 100%, 50%)`);

            // EFFECTS
            let blur = (j - 1) * params.blur;
            let shadow = params.shadow * (j - 1)
            petal.style.boxShadow = `0 0 ${shadow}px hsl(${hue_1}, 100%, 50%)`;
            petal.style.filter = `blur(${blur}px)`;

            const rotationPerPetal = (360 / params.petals) * i;
            petal.style.transform = `rotate(${rotationPerPetal}deg) translate(${params.petalX}%, ${params.petalY}%) rotate(${params.angle}deg)`;

            group.appendChild(petal);
        }

        container.insertBefore(group, container.firstChild);
    }
}

generatePetals();
