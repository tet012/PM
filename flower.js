let perlin = new Perlin();

class Flower {
    constructor(x, y, p, h_factor, smooth_factor, flowField, resolution, index, totalFlowers, patternType, flower_color, core_color, depth = 0, maxDepth = 2, parentAngle = null) {
        Object.assign(this, { x, y, p, h_factor, smooth_factor, flowField, resolution, index, totalFlowers, patternType, flower_color, core_color, depth, maxDepth, parentAngle });
        this.coreRadius = 20;
        this.branches = [];
        this.points = this.calculatePoints();
    }

    calculatePoints() {
        const points = [[this.x, this.y]];
        let [lastX, lastY] = [this.x, this.y];
        for (let i = 0; i < this.p; i++) {
            const { nextX, nextY } = this.getNextPoint(lastX, lastY, i);
            if (nextY < canvas.height * 0.1) break;
            points.push([nextX, nextY]);
            [lastX, lastY] = [nextX, nextY];
            this.attemptBranching(lastX, lastY, i, points);
        }
        return points;
    }

    getNextPoint(x, y, index) {
        const { h_factor } = this;
        const angle = Math.random() * 2 * Math.PI;
        const h_variation = (Math.random() - 0.5) * h_factor;
        let nextX = x + Math.cos(angle) * 10 + h_variation;
        let nextY = this.calculateNextY(y, index, angle);

        // Check if the next point is within the canvas boundaries
        nextX = Math.max(0, Math.min(nextX, canvas.width));
        nextY = Math.max(0, Math.min(nextY, canvas.height));

        return { nextX, nextY };
    }

    calculateNextY(y, index, angle) {
        const { patternType } = this;
        const amplitude = 20;
        const frequency = 0.05;
        let yOffset = 0;
        switch (patternType) {
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
        const upwardOffset = 30;
        return y - upwardOffset + yOffset;
    }

    attemptBranching(x, y, index, points) {
        const { depth, maxDepth, p, h_factor, smooth_factor, flowField, resolution, index: flowerIndex, totalFlowers, patternType, flower_color, core_color } = this;
        if (Math.random() < 0.05 && depth < maxDepth) {
            const angle = points.length > 1 && index > 0 ? Math.atan2(y - points[index - 1][1], x - points[index - 1][0]) : 0;
            const branchAngle = angle + (Math.random() * 0.8 - 0.4);
            const branchLength = Math.floor(Math.random() * (p / 2)) + 5;
            if (flowField && flowField.length > 0) {
                const [prevX, prevY] = points[index - 1] || [x, y];
                const dx = x - prevX;
                const dy = y - prevY;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const branchStartX = prevX + dx * 0.9;
                const branchStartY = prevY + dy * 0.9;
                this.branches.push(new Flower(branchStartX, branchStartY, branchLength, h_factor, smooth_factor, flowField, resolution, flowerIndex, totalFlowers, patternType, flower_color, core_color, depth + 1, maxDepth, branchAngle));
            }
        }
    }

    drawStem() {
        const { points, smooth_factor, depth } = this;
        const smoothedPoints = chaikinSmooth(points, smooth_factor);
        const frequency = 0.0085;
        const amplitude = 4;
        const baseWidth = 2 / (depth + 1);
        for (let i = 0; i < smoothedPoints.length - 1; i++) {
            const [start, end] = [smoothedPoints[i], smoothedPoints[i + 1]];
            const noiseValue = perlin.noise(i * frequency);
            const normalizedNoise = (noiseValue + 1) / 2;
            const strokeWidth = Math.max(baseWidth, Math.min(baseWidth + normalizedNoise * amplitude * 2 - amplitude, baseWidth + amplitude));
            ctx.beginPath();
            ctx.moveTo(...start);
            ctx.lineTo(...end);
            ctx.lineWidth = strokeWidth;
            ctx.strokeStyle = 'black';
            ctx.stroke();
        }
    }

    drawCore() {
        const { coreRadius, points, core_color, depth } = this;
        const numPoints = 100;
        const resolution = 0.02;
        const scale = 1;
        const [coreX, coreY] = points[points.length - 1];
        const scaleFactor = Math.pow(0.7, depth);
        const scaledCoreRadius = coreRadius * scaleFactor;
        ctx.beginPath();
        for (let i = 0; i <= numPoints; i++) {
            const angle = (i / numPoints) * 2 * Math.PI;
            const [baseX, baseY] = [coreX + scaledCoreRadius * Math.cos(angle), coreY + scaledCoreRadius * Math.sin(angle)];
            const noiseValue = perlin.noise(baseX * resolution, baseY * resolution);
            const n = (noiseValue - 0.5) * scale;
            const adjustedRadius = scaledCoreRadius + n;
            const [x, y] = [coreX + adjustedRadius * Math.cos(angle), coreY + adjustedRadius * Math.sin(angle)];
            ctx[i === 0 ? 'moveTo' : 'lineTo'](x, y);
        }
        ctx.closePath();
        ctx.fillStyle = core_color;
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
        return numPetals;
    }

    drawPetal(index, total) {
        const { coreRadius, points, flower_color, depth } = this;
        const angle = (index / total) * 2 * Math.PI;
        const scaleFactor = Math.pow(0.7, depth);
        const petalLength = coreRadius * scaleFactor * (0.8 + Math.random() * 0.4);
        const petalWidth = coreRadius / 2 * scaleFactor * (0.8 + Math.random() * 0.4);
        const [petalX, petalY] = [points[points.length - 1][0] + Math.cos(angle) * coreRadius * 1.5, points[points.length - 1][1] + Math.sin(angle) * coreRadius * 1.5];
        const noiseValue = perlin.noise(petalX * 0.05, petalY * 0.05);
        const n = Math.abs((noiseValue - 0.5) * 2) * scaleFactor;
        ctx.beginPath();
        ctx.ellipse(petalX + n, petalY + n, petalLength, petalWidth, angle, 0, 2 * Math.PI);
        ctx.fillStyle = flower_color;
        ctx.fill();
        this.drawPetalStroke(petalX + n, petalY + n, petalLength, petalWidth, angle, scaleFactor);
    }

    drawPetalStroke(x, y, length, width, angle, scaleFactor) {
        const { coreRadius, points, flower_color, depth } = this;
        const petalLength = coreRadius * scaleFactor * (0.8 + Math.random() * 0.4);
        const petalWidth = coreRadius / 2 * scaleFactor * (0.8 + Math.random() * 0.4);
        const [petalX, petalY] = [points[points.length - 1][0] + Math.cos(angle) * coreRadius * 1.5, points[points.length - 1][1] + Math.sin(angle) * coreRadius * 1.5];
        const noiseValue = perlin.noise(petalX * 0.05, petalY * 0.05);
        const n = Math.abs((noiseValue - 0.5) * 2) * scaleFactor;
        ctx.beginPath();
        ctx.ellipse(petalX + n, petalY + n, petalLength, petalWidth, angle, 0, 2 * Math.PI);
        ctx.fillStyle = flower_color;
        ctx.strokeStyle = 'black';
        ctx.lineWidth = scaleFactor;
        ctx.stroke();
    }

    draw() {
        this.drawStem();
        this.branches.forEach(branch => branch.draw());
        this.drawPetals();
        this.drawCore();
    }
}