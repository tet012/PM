let svgNS = "http://www.w3.org/2000/svg";
let svgElement = document.querySelector('svg');
let defs = svgElement.querySelector('defs');
let W = 1024;
let H = 1024;
let entropy = 0;

let params = {
    petals: 10,
    layers: 5,
    petalWidth: 0.5,
    petalsHeight: 0.5,
    diameter: 480,
    hueShift: 10,
    // rOffset: 0.0015,
    rSpeed: 0.05,
    layersSize: 5,
    layersOffsetX: 0,
    layersOffsetY: 0,
    petalX: 500,
    petalY: 500,
    offsetX: 0,
    offsetY: 0,
    rHue1: 180,
    rHue2: 180,
    radiusX: 0,
    radiusY: 0,
    groupOffsetX: 0,
    groupOffsetY: 0,
    rFactor: 0,
    strokeWidth: 1,
    rectRotation: 0,
    filter1: 1,
    filter2: 1,
};

params.fillPetals = true;
params.filterType = 'mozaic';


function generatePetals() {
    defs.innerHTML = '';
    document.querySelectorAll('.petalsGroup').forEach(e => e.remove());

    const maxSaturation = 100;
    const minSaturation = 100;
    const maxBrightness = 100;
    const minBrightness = 60;

    for (let j = params.layers; j > 0; j--) {

        let petalId = `petal${j}`;

        // Colors
        let hue1 = params.rHue1 + j * params.hueShift;
        let hue2 = params.rHue2 + j * params.hueShift;
        let saturation = (minSaturation, maxSaturation - (j * ((maxSaturation - minSaturation) / params.layers)));
        let brightness = (minBrightness, maxBrightness - (j * ((maxBrightness - minBrightness) / params.layers)));

        // Size
        let petalX = params.petalX + (params.layersOffsetX * j);
        let petalY = params.petalY + (params.layersOffsetY * j);

        // let petalW = params.diameter * params.petalWidth;
        // let petalH = params.diameter * params.petalsHeight;
        // Size
        let petalW = (params.diameter * params.petalWidth) + (j * params.layersSize);
        let petalH = (params.diameter * params.petalsHeight) + (j * params.layersSize);

        // Radius
        let maxW = 200;
        let sourceMin = params.diameter;
        let sourceMax = params.diameter + maxW;
        let vrx = Math.abs(map(petalW, sourceMin, sourceMax, params.radiusX, params.radiusY));
        let vry = 0;

        // Group Params
        let groupX = j * params.groupOffsetX
        let groupY = j * params.groupOffsetY
        let rFactor = j * params.rFactor;

        let petal = document.createElementNS(svgNS, 'rect');

        //Petal Position & Size
        petal.setAttribute('width', `${petalW}`);
        petal.setAttribute('height', `${petalH}`);
        petal.setAttribute('x', `${petalX}`); // Use local petalX
        petal.setAttribute('y', `${petalY}`); // Use local petalY
        petal.setAttribute('rx', `${vrx}`);
        // petal.setAttribute('fill', petalColor);

        //Gradient
        let gradientId = `gradient${j}`;
        let gradient = document.createElementNS(svgNS, 'linearGradient');
        gradient.setAttribute('id', gradientId);
        gradient.setAttribute('x1', '0%');
        gradient.setAttribute('y1', '0%');
        gradient.setAttribute('x2', '100%');
        gradient.setAttribute('y2', '0%');

        let stopOpacity = params.fillPetals ? 0.5 : 0; // Adjust opacity based on checkbox
        // let petalStroke = params.fillPetals ? 'none' : `hsl(${hue1}, ${saturation}%, ${brightness}%)`; // Add stroke if not filled
        // let petalStrokeWidth = params.fillPetals ? 0 : 1; // Stroke width, adjust as needed

        let stop1 = document.createElementNS(svgNS, 'stop');
        stop1.setAttribute('offset', '0%');
        stop1.setAttribute('stop-color', `hsl(${hue1}, ${saturation}%, ${brightness}%)`);
        stop1.setAttribute('stop-opacity', stopOpacity);

        let stop2 = document.createElementNS(svgNS, 'stop');
        stop2.setAttribute('offset', '100%');
        stop2.setAttribute('stop-color', `hsl(${hue2}, ${saturation}%, ${brightness}%)`);
        stop2.setAttribute('stop-opacity', stopOpacity);

        updatedStroke = params.strokeWidth - j * j * 0.1

        // petal.setAttribute('stroke', params.fillPetals ? 'none' : `hsl(${hue1}, ${saturation}%, ${brightness}%)`);
        petal.setAttribute('stroke-width', updatedStroke);
        petal.setAttribute('stroke', 'black');
        // petal.setAttribute('stroke-width', 10);

        gradient.appendChild(stop1);
        gradient.appendChild(stop2);
        defs.appendChild(gradient);
        petal.setAttribute('fill', `url(#${gradientId})`);
        petal.setAttribute('stroke', `hsl(${hue1}, ${saturation}%, ${brightness}%)`);

        // Filter
        let filterId = createFilter(j, params.filterType);

        let centerX = petalX + petalW / 2;
        let centerY = petalY + petalH / 2;

        // Calculate rotation for this petal
        let petalRotation = j * params.rectRotation;
        petal.setAttribute('transform', `rotate(${petalRotation}, ${centerX}, ${centerY})`);

        let petalDef = document.createElementNS(svgNS, 'g');
        petalDef.setAttribute('id', petalId);
        petalDef.appendChild(petal);
        defs.appendChild(petalDef);

        let petalsGroup = document.createElementNS(svgNS, 'g');
        petalsGroup.setAttribute('class', `petalsGroup`);
        petalsGroup.setAttribute('filter', `url(#${filterId})`);

        petalsGroup.setAttribute('transform', `rotate(${rFactor}, ${(W / 2)}, ${H / 2}) translate(${groupX}, ${groupY} )`);
        svgElement.appendChild(petalsGroup);

        for (let i = 0; i < params.petals; i++) {
            let use = document.createElementNS(svgNS, 'use');
            use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', `#${petalId}`);
            petalsGroup.appendChild(use);
        }
    }
    move()
}

function createFilter(j, effectType) {
    let filterId = `${effectType}Filter${j}`;
    let filter = document.createElementNS(svgNS, 'filter');
    filter.setAttribute('id', filterId);
    filter.setAttribute('x', '-50%');
    filter.setAttribute('y', '-50%');
    filter.setAttribute('width', '200%');
    filter.setAttribute('height', '200%');

    if (effectType === 'deform') {
        let scale = 20 + j * 2;
        let baseFrequency = 0.02 + j * 0.05; // Adjusted for a more noticeable effect

        let feTurbulence = document.createElementNS(svgNS, 'feTurbulence');
        feTurbulence.setAttribute('type', 'turbulence');
        feTurbulence.setAttribute('baseFrequency', baseFrequency.toString());
        feTurbulence.setAttribute('numOctaves', '90');
        feTurbulence.setAttribute('result', 'turbulence');

        let feDisplacementMap = document.createElementNS(svgNS, 'feDisplacementMap');
        feDisplacementMap.setAttribute('in2', 'turbulence');
        feDisplacementMap.setAttribute('in', 'SourceGraphic');
        feDisplacementMap.setAttribute('scale', scale.toString());
        feDisplacementMap.setAttribute('xChannelSelector', 'R');
        feDisplacementMap.setAttribute('yChannelSelector', 'G');

        filter.appendChild(feTurbulence);
        filter.appendChild(feDisplacementMap);
    } else if (effectType === '3d') {
        let feGaussianBlur = document.createElementNS(svgNS, 'feGaussianBlur');
        feGaussianBlur.setAttribute('in', 'SourceAlpha');
        feGaussianBlur.setAttribute('stdDeviation', '4');
        feGaussianBlur.setAttribute('result', 'blur');

        let feOffset = document.createElementNS(svgNS, 'feOffset');
        feOffset.setAttribute('in', 'blur');
        feOffset.setAttribute('dx', '5');
        feOffset.setAttribute('dy', '5');
        feOffset.setAttribute('result', 'offsetBlur');

        let feBlend = document.createElementNS(svgNS, 'feBlend');
        feBlend.setAttribute('in', 'SourceGraphic');
        feBlend.setAttribute('in2', 'offsetBlur');
        feBlend.setAttribute('mode', 'normal');

        filter.appendChild(feGaussianBlur);
        filter.appendChild(feOffset);
        filter.appendChild(feBlend);
    } else if (effectType === 'mozaic') {
        let cellSize = 10 + j;
        let feTurbulence = document.createElementNS(svgNS, 'feTurbulence');
        feTurbulence.setAttribute('type', 'turbulence');
        feTurbulence.setAttribute('baseFrequency', params.filter1 / cellSize);
        feTurbulence.setAttribute('numOctaves', '1');
        feTurbulence.setAttribute('result', 'turbulence');

        let feDisplacementMap = document.createElementNS(svgNS, 'feDisplacementMap');
        feDisplacementMap.setAttribute('in2', 'turbulence');
        feDisplacementMap.setAttribute('in', 'SourceGraphic');
        feDisplacementMap.setAttribute('scale', cellSize / params.filter2);
        feDisplacementMap.setAttribute('xChannelSelector', 'R');
        feDisplacementMap.setAttribute('yChannelSelector', 'G');

        filter.appendChild(feTurbulence);
        filter.appendChild(feDisplacementMap);
    } else if (effectType === 'pixel') {
        let tileSize = 4;
        let tileSpacing = 1;

        let feFlood = document.createElementNS(svgNS, 'feFlood');
        feFlood.setAttribute('x', tileSpacing.toString());
        feFlood.setAttribute('y', tileSpacing.toString());
        feFlood.setAttribute('height', tileSize.toString());
        feFlood.setAttribute('width', tileSize.toString());

        let feComposite = document.createElementNS(svgNS, 'feComposite');
        feComposite.setAttribute('width', (tileSize * 2).toString());
        feComposite.setAttribute('height', (tileSize * 2).toString());

        let feTile = document.createElementNS(svgNS, 'feTile');
        feTile.setAttribute('result', 'a');

        let feComposite2 = document.createElementNS(svgNS, 'feComposite');
        feComposite2.setAttribute('in', 'SourceGraphic');
        feComposite2.setAttribute('in2', 'a');
        feComposite2.setAttribute('operator', 'in');

        let feMorphology = document.createElementNS(svgNS, 'feMorphology');
        feMorphology.setAttribute('operator', 'dilate');
        feMorphology.setAttribute('radius', '1');

        filter.appendChild(feFlood);
        filter.appendChild(feComposite);
        filter.appendChild(feTile);
        filter.appendChild(feComposite2);
        filter.appendChild(feMorphology);
    }

    defs.appendChild(filter);

    return filterId;
}

function update() {
    document.getElementById('entropyCounter').innerText = `Entropy: ${entropy}`;
    document.querySelectorAll('.petalsGroup').forEach(e => e.remove());
    document.querySelectorAll('defs > *').forEach(e => e.remove());

    // somewhat emergent lel
    params.petals = Math.max(2, params.petals + Math.floor((Math.random() - 0.5) * 2 * Math.sqrt(entropy)));
    params.layers += Math.floor((Math.random() - 0.5) * 2 * Math.log1p(entropy));
    params.petalWidth *= 1 + (Math.random() - 0.5) * 0.1 * entropy;
    params.petalsHeight *= 1 + (Math.random() - 0.5) * 0.1 * entropy;
    params.diameter += (Math.random() - 0.5) * 20 * Math.sin(entropy);
    params.hueShift += Math.floor((Math.random() - 0.5) * 20);
    params.rOffset += (Math.random() - 0.5) * 0.002 * entropy;
    params.rSpeed += (Math.random() - 0.5) * 0.01 * Math.sqrt(entropy);
    params.layersSize += (Math.random() - 0.5) * Math.log1p(entropy);
    params.layersOffsetX += (Math.random() - 0.5) * 10 * entropy;
    params.layersOffsetY += (Math.random() - 0.5) * 10 * entropy;

    params.petalX += (Math.random() - 0.5) * 5;
    params.petalY += (Math.random() - 0.5) * 5;

    params.offsetX += (Math.random() - 0.5) * 10;
    params.offsetY += (Math.random() - 0.5) * 10;
    params.rHue1 += Math.floor((Math.random() - 0.5) * 360 * Math.sin(entropy));
    params.rHue2 += Math.floor((Math.random() - 0.5) * 360 * Math.cos(entropy));
    params.radiusX += (Math.random() - 0.5) * 5;
    params.radiusY += (Math.random() - 0.5) * 50;
    // params.groupOffsetX += (Math.random() - 0.5) * 20 * Math.tan(entropy);
    // params.groupOffsetY += (Math.random() - 0.5) * 20 * Math.tan(entropy);
    params.rFactor += (Math.random() - 0.5) * 360 * Math.sin(entropy);

    // Clamp values to maintain some constraints
    params.petals = Math.max(1, params.petals);
    params.layers = Math.max(1, params.layers);
    params.petalWidth = Math.max(0.1, Math.min(params.petalWidth, 2));
    params.petalsHeight = Math.max(0.1, Math.min(params.petalsHeight, 2));
    params.diameter = Math.max(20, Math.min(params.diameter, 800));
    params.layersSize = Math.max(-200, Math.min(params.layersSize, 200));

    generatePetals();
}

function move(time) {
    document.querySelectorAll('.petalsGroup').forEach((group, groupIndex) => {
        const children = group.children;
        for (let i = 0; i < children.length; i++) {
            let rotation = (i * 360 / params.petals);
            const translateX = 0
            const translateY = 0
            children[i].setAttribute('transform', `rotate(${rotation}, ${(W / 2)}, ${H / 2}) translate(${translateX}, ${translateY}) `);
        }
    });
}

function map(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

generatePetals();
