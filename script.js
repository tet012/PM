export const params = {
    // EVOLUTION
    entropy: 0,

    //PETALS
    petals: 8,
    width: 250,
    height: 150,
    petalX: 50,
    petalY: -50,

    //RADIUS
    radius_x1: 100,
    radius_y1: 200,
    radius_x2: 0,
    radius_y2: 0,
    radius_x3: 100,
    radius_y3: 200,
    radius_x4: 0,
    radius_y4: 0,

    //LAYER
    layers: 1,
    offsetX: 0,
    offsetY: 0,
    scale: 0.1,

    //ROTATION
    angle: 45,
    rotation: 10,

    //COLOR
    fill: true,
    position: { x: 100, y: 50 },
    color_shift: 10,
    hue_1: 90,
    hue_2: 360,
    // opacity_1: 0.25,
    // opacity_2: 0.25,
    opacity_1: 0.7,
    opacity_2: 0.7,
    light_1: 75,
    light_2: 75,
    sat_1: 100,
    sat_2: 50,

    //Custom Shape
    enable: true,
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 100,
    x3: 150,
    y3: 0,
    x4: 150,
    y4: 0,

    //STROKE
    strokeWidth: 0,
    strokeStyle: 'solid',

    //FX
    blur: 0,
    shadow: 10,
};

export function generatePetals() {
    const container = document.getElementById('container');
    container.style.position = 'relative';
    container.innerHTML = '';

    const a1 = Math.random() * 100;
    const b1 = Math.random() * 100;
    const a2 = Math.random() * 100;
    const b2 = Math.random() * 100;
    const a3 = Math.random() * 100;
    const b3 = Math.random() * 100;
    const a4 = Math.random() * 100;
    const b4 = Math.random() * 100;

    const r_a1 = Math.random() * 200;
    const r_b1 = Math.random() * 200;
    const r_a2 = Math.random() * 200;
    const r_b2 = Math.random() * 200;
    const r_a3 = Math.random() * 200;
    const r_b3 = Math.random() * 200;
    const r_a4 = Math.random() * 200;
    const r_b4 = Math.random() * 200;

    const layersNumbr = Math.floor(Math.random() * 32);
    const petalsNumber = Math.max(4, Math.floor(Math.random() * (16)));

    const baseHue_1 = Math.random() * 360;
    const baseHue_2 = Math.random() * 360;
    const baseShift = Math.random() * 50

    const baseScale = Math.random() * 16;
    const baseWidth = Math.floor(Math.random() * 500) + 100;
    const baseHeight = Math.floor(Math.random() * 500) + 100;

    const angle = Math.floor(Math.random() * 361) - 180;
    const op_1 = Math.random();
    const op_2 = Math.random();

    const px = Math.floor(Math.random() * 201) - 100;
    const py = Math.floor(Math.random() * 201) - 100;

    for (let j = 1; j <= layersNumbr; j++) {
        const group = document.createElement('div');
        group.className = 'group';
        const hue_1 = baseHue_1 + baseShift * (j - 1);
        const hue_2 = baseHue_2 + baseShift * (j - 1);

        const groupRotation = params.rotation * (j - 1);
        group.style.transform = `translate(${params.offsetX * (j - 1)}px, ${params.offsetY * (j - 1)}px) rotate(${groupRotation}deg)`;

        for (let i = 0; i < petalsNumber; i++) {
            const petal = document.createElement('div');
            const petal_gradient = document.createElement('div');
            const petal_inner_shadow = document.createElement('div');

            const scale = 1 + (j - 1) * baseScale;
            const width = baseWidth + scale;
            const height = baseHeight + scale;

            const i_width = width * 2;
            const i_height = height * 2;

            petal.classList.add('petal');
            petal_gradient.classList.add('petal-gradient');
            petal_inner_shadow.classList.add('petal-inner_shadow');

            petal.style.width = `${width}px`;
            petal.style.height = `${height}px`;
            petal.style.marginLeft = `-${width / 2}px`;
            petal.style.marginTop = `-${height / 2}px`;
            petal.style.borderRadius =
                `${r_a1}% ${r_b1}% ${r_a2}% ${r_b2}% / 
            ${r_a3}% ${r_b3}% ${r_a4}% ${r_b4}%`;

            petal_gradient.style.width = `${i_width}px`;
            petal_gradient.style.height = `${i_height}px`;

            const rotationPerPetal = (360 / petalsNumber) * i + angle * j;

            if (params.fill) {
                const background = `hsla(${hue_1}, 100%, 50%, ${params.opacity_1})`
                petal.style.background = background;
                petal.style.border = 'none'

                const innerBackground = `radial-gradient(
                    hsla(${hue_1}, ${params.light_1}%, ${params.sat_1}%, ${op_1}), 
                    hsla(${hue_2}, ${params.light_2}%,  ${params.sat_2}%, ${op_2}))`;
                // const innerBackground = `repeating-radial-gradient(circle, black, black 5px, white 5px, white 10px)`;
                const innerBackground2 = `
                radial-gradient(circle at 50% 50%, transparent 20%, #00D4F0 21%, #00D4F0 34%, transparent 35%, transparent),
                radial-gradient(circle at 0% 50%, transparent 20%, #00D4F0 21%, #00D4F0 34%, transparent 35%, transparent)`;
                petal_gradient.style.background = innerBackground;
                // petal_gradient.style.backgroundRepeat = 'no-repeat'; // Prevent repeating the gradient tiles
                // petal_gradient.style.backgroundPosition = `right top, left bottom`; // Example positions
                // petal_gradient.style.backgroundSize = `auto, 100%`; // Adjust size as needed

                // petal.style.backdropFilter = 'blur(5px)';
                // petal_gradient.style.filter = `backdrop( blur(80px) )`;
                petal_gradient.style.backgroundPosition = `${params.position.x}px ${params.position.y}px`;
                // petal_gradient.style.transform = `rotate(${reverseAngle}deg)`;
            }

            const blur = (j - 1) * params.blur;
            const shadowBlur = params.shadow;

            petal_inner_shadow.style.width = `${width}px`;
            petal_inner_shadow.style.height = `${height}px`;
            petal_inner_shadow.style.position = 'absolute';
            petal_inner_shadow.style.zIndex = '100';
            // petal_inner_shadow.style.borderRadius = `${params.radius_A}% ${params.radius_B}% ${params.radius_C}% ${params.radius_D}%`;
            petal_inner_shadow.style.boxShadow = `
            inset 0px 0px 128px hsla(0, 0%, 0%, 0.1),
            inset 0px 0px 64px hsla(0, 0%, 0%, 0.3),
            inset 0px 0px 32px -8px hsla(0, 0%, 0%, 0.5),
            inset 0px 0px 8px -4px hsla(0, 0%, 0%, 1)`;

            // petal_inner_shadow.style.boxShadow = `
            // 0px 0px 128px -32px hsla(0, 0%, 0%, 0.1), 
            // inset -16px 16px 64px -24px hsla(0, 0%, 0%, 0.5)`,

            petal.style.filter = `blur(${blur}px)`;
            petal.style.transform = `rotate(${rotationPerPetal}deg) translate(${px}%, ${py}%)`;
            petal.style.clipPath = `polygon(${a1}% ${b1}%, ${a2}% ${b2}%, ${a3}% ${b3}%, ${a4}% ${b4}%)`;

            // petal_gradient.style.transform = `rotate(${rotationPerPetal}deg) `;

            petal.appendChild(petal_gradient);
            petal.appendChild(petal_inner_shadow);
            group.appendChild(petal);
        }
        container.insertBefore(group, container.firstChild);
    }

    const heart = document.createElement('div');
    heart.className = 'heart';
    heart.style.width = '150px';
    heart.style.height = '150px';
    heart.style.background = `hsla(${baseHue_1}, 100%, 50%, 1)`;
    heart.style.borderRadius = '50%';
    heart.style.position = 'absolute';
    heart.style.boxShadow = '0px 0px 32px -8px black, inset 0px 0px 64px -16px hsla(0, 0%, 0%, 0.25), inset 0px 0px 32px -8px hsla(0, 0%, 0%, 0.5) '
    container.appendChild(heart);
}

generatePetals();