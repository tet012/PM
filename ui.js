import { Pane } from 'https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js';
import { params, generatePetals } from './script.js';
import * as TweakpaneEssentialsPlugin from './tweakpane-plugin-camerakit-0.3.0.min.js';

const pane = new Pane({ title: 'Parameters' });
pane.registerPlugin(TweakpaneEssentialsPlugin);


// PETALS
const petals = pane.addFolder({
    title: 'Petals', expanded: false,
});
petals.addBinding(params, 'petals', { min: 1, max: 32, step: 1, label: 'Number' },).on('change', generatePetals);
petals.addBlade({
    view: 'separator',
});
petals.addBinding(params, 'width', { min: 0, max: 800, step: 0.1 }).on('change', () => {
    generatePetals();
});
petals.addBinding(params, 'height', { min: 0, max: 800, step: 0.1 }).on('change', () => {
    generatePetals();
});
petals.addBlade({
    view: 'separator',
});
petals.addBinding(params, 'petalX', { min: -1000, max: 1000 }).on('change', generatePetals);
petals.addBinding(params, 'petalY', { min: -1000, max: 1000 }).on('change', generatePetals);


// Roundness
const Roundness = pane.addFolder({ title: 'Roundness', expanded: false });

Roundness.addBinding(params, 'radius_x1', { min: 0, max: 200 }).on('change', generatePetals);
Roundness.addBinding(params, 'radius_y1', { min: 0, max: 200 }).on('change', generatePetals);

Roundness.addBinding(params, 'radius_x2', { min: 0, max: 200 }).on('change', generatePetals);
Roundness.addBinding(params, 'radius_y2', { min: 0, max: 200 }).on('change', generatePetals);

Roundness.addBinding(params, 'radius_x3', { min: 0, max: 200 }).on('change', generatePetals);
Roundness.addBinding(params, 'radius_y3', { min: 0, max: 200 }).on('change', generatePetals);

Roundness.addBinding(params, 'radius_x4', { min: 0, max: 200 }).on('change', generatePetals);
Roundness.addBinding(params, 'radius_y4', { min: 0, max: 200 }).on('change', generatePetals);

// Custom Shape
const path = pane.addFolder({ title: 'Custom Shape', expanded: false });
path.addBinding(params, 'enable', { label: 'Enable' }).on('change', generatePetals);
path.addBinding(params, 'x1', { min: 0, max: 500, step: 0.1 }).on('change', generatePetals);
path.addBinding(params, 'y1', { min: 0, max: 500, step: 0.1 }).on('change', generatePetals);
path.addBinding(params, 'x2', { min: 0, max: 500, step: 0.1 }).on('change', generatePetals);
path.addBinding(params, 'y2', { min: 0, max: 500, step: 0.1 }).on('change', generatePetals);
path.addBinding(params, 'x3', { min: 0, max: 500, step: 0.1 }).on('change', generatePetals);
path.addBinding(params, 'y3', { min: 0, max: 500, step: 0.1 }).on('change', generatePetals);
path.addBinding(params, 'x4', { min: 0, max: 500, step: 0.1 }).on('change', generatePetals);
path.addBinding(params, 'y4', { min: 0, max: 500, step: 0.1 }).on('change', generatePetals);

// LAYERS
const layers = pane.addFolder({ title: 'Layers', expanded: false });
layers.addBinding(params, 'layers', { min: 0, max: 10, step: 1 }).on('change', generatePetals);
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
const rotation = pane.addFolder({ title: 'Rotation', expanded: false });
rotation.addBinding(params, 'angle', { min: -180, max: 180, step: 0.1 }).on('change', generatePetals);
rotation.addBinding(params, 'rotation', { min: -8, max: 8, step: 0.1 }).on('change', generatePetals);

// FILL
const fill = pane.addFolder({ title: 'Fill', expanded: false });

fill.addBinding(params, 'fill', { label: 'Fill' }).on('change', generatePetals);
fill.addBlade({ view: 'separator' });

// fill.addBinding(params, 'gradientType', {
//     label: 'Type',
//     options: {
//         Linear: 'linear',
//         Radial: 'radial'
//     },
// }).on('change', () => {
//     generatePetals();
// });

fill.addBinding(params, 'position', {
    picker: 'inline',
    expanded: true,
}).on('change', () => {
    generatePetals();
});

// fill.addBinding(params, 'gradient_direction', {
//     label: 'Direction',
//     options: {
//         Up: 'up',
//         Down: 'down',
//         Right: 'right',
//         Left: 'left',
//     },
// }).on('change', (value) => { generatePetals(); });

fill.addBlade({ view: 'separator' });
// fill.addBinding(params, 'color_shift', { min: 0.1, max: 50 }).on('change', generatePetals);
// fill.addBlade({ view: 'separator' });
fill.addBinding(params, 'hue_1', { min: 0, max: 360 }).on('change', generatePetals);
fill.addBinding(params, 'hue_2', { min: 0, max: 360 }).on('change', generatePetals);
fill.addBinding(params, 'light_1', { min: 0, max: 100 }).on('change', generatePetals);
fill.addBinding(params, 'light_2', { min: 0, max: 100 }).on('change', generatePetals);
fill.addBinding(params, 'sat_1', { min: 0, max: 100 }).on('change', generatePetals);
fill.addBinding(params, 'sat_2', { min: 0, max: 100 }).on('change', generatePetals);
fill.addBlade({ view: 'separator' });

fill.addBinding(params, 'opacity_1', { min: 0, max: 1, step: 0.01 }).on('change', generatePetals);
fill.addBinding(params, 'opacity_2', { min: 0, max: 1, step: 0.01 }).on('change', generatePetals);

const border = pane.addFolder({ title: 'Border', expanded: false });
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

const effect = pane.addFolder({ title: 'Effect', expanded: false });
effect.addBinding(params, 'blur', { min: 0, max: 2, step: 0.01 }).on('change', generatePetals);
effect.addBinding(params, 'shadow', { min: 0, max: 50, step: 0.01 }).on('change', generatePetals);

// ENTROPY
const evolution = pane.addFolder({ title: 'Evolution', expanded: true });
evolution.addBinding(params, 'entropy', {
    view: 'cameraring',
    series: 0,
}).on('change', () => {
    generatePetals();
});


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
