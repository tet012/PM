let perlin = new Perlin();

class Flower {
    constructor(x, y, p, h_factor, smooth_factor, flowField, resolution, index, totalFlowers, patternType, flower_color, core_color, depth = 0, maxDepth = 2, parentAngle = null) {
        this.x = x;
        this.y = y;
        this.p = p;
        this.h_factor = h_factor;
        this.smooth_factor = smooth_factor;
        this.flowField = flowField;
        this.resolution = resolution;
        this.patternType = patternType;
        this.flower_color = flower_color;
        this.core_color = core_color;
        this.coreRadius = 20;
        this.branches = [];
        this.depth = depth;
        this.maxDepth = maxDepth;
        this.points = this.calculatePoints();
    }

    calculatePoints() {
        let points = [[this.x, this.y]];
        let lastX = this.x, lastY = this.y;
        for (let i = 0; i < this.p; i++) {
            let { nextX, nextY } = this.getNextPoint(lastX, lastY, i);
            if (nextY < canvas.height * 0.1) break;
            points.push([nextX, nextY]);
            lastX = nextX;
            lastY = nextY;
            this.attemptBranching(lastX, lastY, i, points);
        }
        return points;
    }

    getNextPoint(x, y, index) {
        let rows = this.flowField.length;

        const cols = this.flowField.length > 0 ? this.flowField[0].length : 0;
        let col = Math.floor(x / this.resolution);
        let row = Math.floor(y / this.resolution);
        col = Math.max(0, Math.min(col, cols - 1));
        row = Math.max(0, Math.min(row, rows - 1));
        const angle = this.flowField[row][col];
        const h_variation = (Math.random() - 0.5) * this.h_factor;
        let nextX = x + Math.cos(angle) * 10 + h_variation;
        let nextY = this.calculateNextY(y, index, angle);
        return { nextX, nextY };
    }

    // calculateNextY(y, index, angle) {
    //     switch (this.patternType) {
    //         case 'straight':
    //             return y - 50;
    //         case 'curvy':
    //             return y - 40 + ((index % 2 === 0) ? 20 : -20);
    //         case 'random':
    //             return y - (Math.sin(angle) * 20 + 10);
    //         default:
    //             return y - (Math.sin(angle) * 30 + 10);
    //     }
    // }

    calculateNextY(y, index, angle) {
        const movementType = this.patternType; // Use patternType to determine the movement type
        const amplitude = 20; // Adjust this value to control the magnitude of the movement
        const frequency = 0.05; // Adjust this value to control the frequency of the movement

        let yOffset = 0;

        switch (movementType) {
            case 'radial':
                yOffset = Math.sin(angle) * amplitude;
                break;
            case 'oscillate':
                yOffset = Math.sin(index * frequency) * amplitude;
                break;
            case 'noise':
                const noiseValue = perlin.noise(index * frequency, y * frequency);
                yOffset = (noiseValue - 0.5) * amplitude * 2;
                break;
            default:
                yOffset = 0;
        }

        // Ensure the stem always goes up
        const upwardOffset = 30; // Adjust this value to control the upward movement
        return y - upwardOffset + yOffset;
    }

    attemptBranching(x, y, index, points) {
        if (Math.random() < 0.1 && this.depth < this.maxDepth) {
            let angle;
            if (points.length > 1 && index > 0) {
                angle = Math.atan2(y - points[index - 1][1], x - points[index - 1][0]);
            } else {
                angle = 0; // You might adjust this default value as needed
            }
            let branchAngle = angle + (Math.random() * 0.8 - 0.4); // Divergence angle
            let branchLength = Math.floor(Math.random() * (this.p / 2)) + 5;
            if (this.flowField && this.flowField.length > 0) {
                this.branches.push(new Flower(x, y, branchLength, this.h_factor, this.smooth_factor, this.flowField, this.resolution, this.index, this.totalFlowers, this.patternType, this.flower_color, this.core_color, this.depth + 1, this.maxDepth, branchAngle));
            }
        }
    }


    drawStem() {
        this.points = chaikinSmooth(this.points, this.smooth_factor);
        const frequency = 0.0085;
        const amplitude = 4;
        const baseWidth = 2;

        for (let i = 0; i < this.points.length - 1; i++) {
            const start = this.points[i];
            const end = this.points[i + 1];
            let noiseValue = perlin.noise(i * frequency);
            let normalizedNoise = (noiseValue + 1) / 2;
            let strokeWidth = baseWidth + normalizedNoise * amplitude * 2 - amplitude;
            strokeWidth = Math.max(baseWidth, Math.min(strokeWidth, baseWidth + amplitude));

            ctx.beginPath();
            ctx.moveTo(...start);
            ctx.lineTo(...end);
            ctx.lineWidth = strokeWidth;
            ctx.strokeStyle = 'black';
            ctx.stroke();
        }
    }

    drawCore() {
        const coreRadius = this.coreRadius;
        const numPoints = 100;
        const resolution = 0.02;
        const scale = 1;
        const coreX = this.points[this.points.length - 1][0];
        const coreY = this.points[this.points.length - 1][1];

        ctx.beginPath();
        for (let i = 0; i <= numPoints; i++) {
            const angle = (i / numPoints) * 2 * Math.PI;
            const baseX = coreX + coreRadius * Math.cos(angle);
            const baseY = coreY + coreRadius * Math.sin(angle);

            // Apply noise to slightly modify the radius rather than the position
            let noiseValue = perlin.noise(baseX * resolution, baseY * resolution);
            let n = (noiseValue - 0.5) * scale; // Reduce the impact of noise.

            // Adjust radius based on noise, keeping the center fixed
            const adjustedRadius = coreRadius + n;
            const x = coreX + adjustedRadius * Math.cos(angle);
            const y = coreY + adjustedRadius * Math.sin(angle);

            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }

        ctx.closePath();
        ctx.fillStyle = this.core_color;
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'black';
        ctx.stroke();
    }

    drawPetals() {
        const numPetals = Math.floor(Math.random() * 8 + 4);
        for (let i = 0; i < numPetals; i++) {
            this.drawPetal(i, numPetals);
        }
    }

    drawPetal(index, total) {
        const angle = (index / total) * 2 * Math.PI;
        const petalLength = this.coreRadius; // Consider varying this for more natural variation
        const petalWidth = this.coreRadius / 2; // Narrower width for petal appearance
        const petalX = this.points[this.points.length - 1][0] + Math.cos(angle) * this.coreRadius * 1.5;
        const petalY = this.points[this.points.length - 1][1] + Math.sin(angle) * this.coreRadius * 1.5;

        // Adding noise for organic variation
        let noiseValue = perlin.noise(petalX * 0.05, petalY * 0.05); // Adjust these for more or less variation
        let n = Math.abs((noiseValue - 0.5) * 2); // Use absolute value or another method to keep dimensions positive

        // Drawing the petal with noise-influenced dimensions for organic variation
        ctx.beginPath();
        ctx.ellipse(petalX + n, petalY + n, petalLength + n, petalWidth + n, angle, 0, 2 * Math.PI);
        ctx.fillStyle = this.flower_color;
        ctx.fill();
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        ctx.stroke();
    }

    draw() {
        this.drawStem(); // Draw the stem last

        this.branches.forEach(branch => branch.draw()); // Draw the sub-branches first
        this.drawPetals(); // Draw the petals
        this.drawCore(); // Draw the core on top of the petals
    }
}
