import { Pane } from 'https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js';
import { params, generatePetals } from './script.js';
const pane = new Pane({ title: 'Petal Generator' });

// PETALS
const petals = pane.addFolder({ title: 'Petals' });
petals.addBinding(params, 'petals', { min: 1, max: 32, step: 1 }).on('change', generatePetals);
petals.addBlade({
    view: 'separator',
});
petals.addBinding(params, 'width', { min: 0, max: 800, step: 0.1 }).on('change', generatePetals);
petals.addBinding(params, 'height', { min: 0, max: 800, step: 0.1 }).on('change', generatePetals);
petals.addBlade({
    view: 'separator',
});
petals.addBinding(params, 'petalX', { min: -1000, max: 1000 }).on('change', generatePetals);
petals.addBinding(params, 'petalY', { min: -1000, max: 1000 }).on('change', generatePetals);

const path = pane.addFolder({ title: 'Path' });
path.addBinding(params, 'x1', { min: 0, max: 150, step: 0.1 }).on('change', generatePetals);
path.addBinding(params, 'x2', { min: 0, max: 150, step: 0.1 }).on('change', generatePetals);
path.addBinding(params, 'y1', { min: 0, max: 150, step: 0.1 }).on('change', generatePetals);
path.addBinding(params, 'y2', { min: 0, max: 150, step: 0.1 }).on('change', generatePetals);
path.addBinding(params, 'z1', { min: 0, max: 150, step: 0.1 }).on('change', generatePetals);
path.addBinding(params, 'z2', { min: 0, max: 150, step: 0.1 }).on('change', generatePetals);

const shapes = pane.addTab({
    pages: [
        { title: 'roundness' },
        { title: 'Advanced' },

    ],
});

// SHAPES
const roundness = shapes.pages[0];
const applyPreset = {
    'Round': () => {
        params.radius_A = 100;
        params.radius_B = 100;
        params.radius_C = 100;
        params.radius_D = 100;
    },
    'Square': () => {
        params.radius_A = 0;
        params.radius_B = 0;
        params.radius_C = 0;
        params.radius_D = 0;
    },
    'Alt_1': () => {
        params.radius_A = 100;
        params.radius_B = 0;
        params.radius_C = 100;
        params.radius_D = 0;
    },
    'Alt_2': () => {
        params.radius_A = 0;
        params.radius_B = 100;
        params.radius_C = 0;
        params.radius_D = 100;
    }
};

roundness.addBlade({
    view: 'list',
    label: 'Shape',
    options: [
        { text: 'Square', value: 'Square' },
        { text: 'Round', value: 'Round' },
        { text: 'Alt_1', value: 'Alt_1' },
        { text: 'Alt_2', value: 'Alt_2' },
    ],
    value: 'Square',
}).on('change', (event) => {
    const selectedValue = event.value;
    if (typeof applyPreset[selectedValue] === 'function') {
        applyPreset[selectedValue]();
        generatePetals();
    } else {
        console.error('Selected preset function does not exist:', selectedValue);
    }
});

shapes.pages[1].addBinding(params, 'radius_A', { min: 0, max: 100 }).on('change', generatePetals);
shapes.pages[1].addBinding(params, 'radius_B', { min: 0, max: 100 }).on('change', generatePetals);
shapes.pages[1].addBinding(params, 'radius_C', { min: 0, max: 100 }).on('change', generatePetals);
shapes.pages[1].addBinding(params, 'radius_D', { min: 0, max: 100 }).on('change', generatePetals);

// LAYERS
const layers = pane.addFolder({ title: 'Layers' });
layers.addBinding(params, 'layers', { min: 0, max: 500, step: 1 }).on('change', generatePetals);
layers.addBlade({
    view: 'separator',
});
layers.addBinding(params, 'offsetX', { min: -200, max: 200 }).on('change', generatePetals);
layers.addBinding(params, 'offsetY', { min: -200, max: 200 }).on('change', generatePetals);
layers.addBlade({
    view: 'separator',
});
layers.addBinding(params, 'scale', { min: -8, max: 8, step: 0.001 }).on('change', generatePetals);

// ROTATION
const rotation = pane.addFolder({ title: 'Rotation' });
rotation.addBinding(params, 'angle', { min: -180, max: 180, step: 0.1 }).on('change', generatePetals);
rotation.addBinding(params, 'rotation', { min: -8, max: 8, step: 0.1 }).on('change', generatePetals);

// FILL
const fill = pane.addFolder({ title: 'Fill' });

fill.addBinding(params, 'fill', { label: 'Fill' }).on('change', generatePetals);
fill.addBlade({ view: 'separator' });

fill.addBinding(params, 'gradientType', {
    label: 'Type',
    options: {
        Linear: 'linear',
        Radial: 'radial'
    },
}).on('change', () => {
    generatePetals();
});

fill.addBinding(params, 'position', {
    picker: 'inline',
    expanded: false,
}).on('change', () => {
    generatePetals();
});

fill.addBinding(params, 'gradient_direction', {
    label: 'Direction',
    options: {
        Up: 'up',
        Down: 'down',
        Right: 'right',
        Left: 'left',
    },
}).on('change', (value) => { generatePetals(); });

fill.addBlade({ view: 'separator' });

fill.addBinding(params, 'color_shift', { min: 0.1, max: 50 }).on('change', generatePetals);
fill.addBlade({ view: 'separator' });
fill.addBinding(params, 'hue_1', { min: 0, max: 360 }).on('change', generatePetals);
fill.addBinding(params, 'hue_2', { min: 0, max: 360 }).on('change', generatePetals);
fill.addBlade({ view: 'separator' });

fill.addBinding(params, 'opacity_1', { min: 0, max: 1, step: 0.01 }).on('change', generatePetals);
fill.addBinding(params, 'opacity_2', { min: 0, max: 1, step: 0.01 }).on('change', generatePetals);

const border = pane.addFolder({ title: 'Border' });
border.addBinding(params, 'strokeWidth', { min: 0, max: 50 }).on('change', generatePetals);
border.addBinding(params, 'strokeStyle', {
    label: 'Style',
    options: {
        Solid: 'solid',
        Dotted: 'dotted',
        Dashed: 'dashed',
        Double: 'double',
        Groove: 'groove',
        Ridge: 'ridge',
        Inset: 'inset',
        Outset: 'outset',
    },
}).on('change', (value) => {
    generatePetals();
});

// const pattern = pane.addFolder({ title: 'Pattern' });
// pattern.addBinding(params, 'selectedClass', {
//     label: 'Pattern Style',
//     options: {
//         'Pattern 1': 'bg_pattern_1',
//         'Pattern 2': 'bg_pattern_2',
//     },
// }).on('change', (value) => {
//     document.querySelectorAll('.petal').forEach((petalElement) => {
//         petalElement.classList.remove('bg_pattern_1', 'bg_pattern_2');
//         petalElement.classList.add(value);
//     });
// });

// pattern.addBinding(params, 'patternColor1', {
//     label: 'Color 1',
// }).on('change', (value) => {
//     document.documentElement.style.setProperty('--pattern-color-1', value);
// });

// pattern.addBinding(params, 'patternColor2', {
//     label: 'Color 2',
// }).on('change', (value) => {
//     document.documentElement.style.setProperty('--pattern-color-2', value);
// });

const effect = pane.addFolder({ title: 'Effect' });
effect.addBinding(params, 'blur', { min: 0, max: 2, step: 0.01 }).on('change', generatePetals);
effect.addBinding(params, 'shadow', { min: 0, max: 50, step: 0.01 }).on('change', generatePetals);

// // Manage
// const state = pane.exportState();
// const Manage = pane.addFolder({ title: 'Manage' });
// Manage.addButton({ title: 'Export' }).on('click', () => {
//     const json = JSON.stringify(state, null, 2);
//     const blob = new Blob([json], { type: 'application/json' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = 'export.json';
//     a.click();
//     URL.revokeObjectURL(url);
// });

// function updateTweakpaneInputs(newState) {
//     for (const key in newState) {
//         if (newState.hasOwnProperty(key)) {
//             pane.inputs[key].setValue(newState[key]);
//         }
//     }
// }

// Manage.addButton({ title: 'Load' }).on('click', () => {
//     try {
//         const fileInput = document.createElement('input');
//         fileInput.type = 'file';
//         fileInput.accept = '.json';
//         fileInput.onchange = (event) => {
//             const file = event.target.files[0];
//             if (file) {
//                 const reader = new FileReader();
//                 reader.onload = (e) => {
//                     try {
//                         const json = e.target.result;
//                         const data = JSON.parse(json);
//                         Object.assign(state, data);
//                         generatePetals();
//                         updateTweakpaneInputs(data);
//                     } catch (err) {
//                         console.error('Error parsing JSON:', err);
//                     }
//                 };
//                 reader.readAsText(file);
//             }
//         };
//         fileInput.click();
//     } catch (error) {
//         console.error('Error loading JSON:', error);
//     }
// });
