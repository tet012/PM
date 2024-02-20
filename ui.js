// JS GUI
let gui = new dat.GUI();

// Petals    
let petals = gui.addFolder('Petals');
petals.add(params, 'petals', 1, 32).step(1).onChange(generatePetals);
petals.add(params, 'petalWidth', 0.01, 2).onChange(generatePetals);
petals.add(params, 'petalsHeight', 0.01, 2).onChange(generatePetals);
petals.add(params, 'diameter', 10, 800).onChange(generatePetals);
petals.add(params, 'petalX', 0, 1000).onChange(generatePetals);
petals.add(params, 'petalY', 0, 1000).onChange(generatePetals);
petals.add(params, 'radiusX', 0, 50).onChange(generatePetals);
petals.add(params, 'radiusY', 0, 500).onChange(generatePetals);

// Layers
let layers = gui.addFolder('Layers');
layers.add(params, 'layers', 0, 124).step(1).onChange(generatePetals);
layers.add(params, 'layersOffsetX', -200, 200).onChange(generatePetals);
layers.add(params, 'layersOffsetY', -200, 200).onChange(generatePetals);
layers.add(params, 'layersSize', -200, 200).onChange(generatePetals);

// Colors
let colors = gui.addFolder('Colors');
colors.add(params, 'hueShift', 0.1, 50).onChange(generatePetals);
colors.add(params, 'rHue1', 0, 360).onChange(generatePetals);
colors.add(params, 'rHue2', 0, 360).onChange(generatePetals);
gui.add(params, 'fillPetals').name('Fill Petals').onChange(generatePetals);

// Group
let group = gui.addFolder('Group');
group.add(params, 'groupOffsetX', -50, 50).onChange(generatePetals);
group.add(params, 'groupOffsetY', -50, 50).onChange(generatePetals);
group.add(params, 'rFactor', -2000, 2000).onChange(generatePetals);

petals.open();
layers.open();
colors.open();
group.open();


// HTML UI
document.getElementById('nextBtn').addEventListener('click', function () {
    entropy++;
    update();
});

document.getElementById('prevBtn').addEventListener('click', function () {
    entropy = Math.max(0, entropy - 1);
    update();
});

document.getElementById('saveOutputBtn').addEventListener('click', function () {
    // Save Configuration as JSON
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(params));
    const configDownloadAnchorNode = document.createElement('a');
    configDownloadAnchorNode.setAttribute("href", dataStr);
    configDownloadAnchorNode.setAttribute("download", "configuration.json");
    document.body.appendChild(configDownloadAnchorNode);
    configDownloadAnchorNode.click();
    configDownloadAnchorNode.remove();

    // Delay to ensure the configuration download initiates first
    setTimeout(() => {
        // Save SVG as an Image (SVG format here for simplicity)
        const svgData = new XMLSerializer().serializeToString(document.querySelector('svg'));
        const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
        const svgUrl = URL.createObjectURL(svgBlob);
        const imageDownloadLink = document.createElement('a');
        imageDownloadLink.href = svgUrl;
        imageDownloadLink.download = "petals.svg";
        document.body.appendChild(imageDownloadLink);
        imageDownloadLink.click();
        document.body.removeChild(imageDownloadLink);
    }, 100); // Adjust the delay if needed
});

document.getElementById('loadInput').addEventListener('change', function (e) {
    const fileReader = new FileReader();
    fileReader.onload = function (event) {
        const loadedParams = JSON.parse(event.target.result);
        Object.assign(params, loadedParams);
        for (let key in loadedParams) {
            if (gui.__controllers.find(c => c.property === key)) {
                gui.__controllers.find(c => c.property === key).setValue(loadedParams[key]);
            }
        }
        generatePetals(); // Regenerate petals with new params
    };
    fileReader.readAsText(e.target.files[0]);
});