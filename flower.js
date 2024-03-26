let perlin = new Perlin();

class Flower {
    constructor(x, y, p, h_factor, smooth_factor, flowField, resolution, index, totalFlowers, patternType, fc_1, fc_2, core_color, depth = 0, maxDepth = 2, parentAngle = null, hasFlower = true) {
        Object.assign(this, { x, y, p, h_factor, smooth_factor, flowField, resolution, index, totalFlowers, patternType, fc_1, fc_2, core_color, depth, maxDepth, parentAngle, hasFlower });

        this.coreRadius = 20;
        this.branches = [];
        this.points = this.calculatePoints();
    }

    calculatePoints() {
        const points = [[this.x, this.y]];
        let [lastX, lastY] = [this.x, this.y];
        for (let i = 0; i < this.p; i++) {
            const { nextX, nextY } = this.getNextPoint(lastX, lastY, i);
            if (nextY < canvas.height * R.random_num(0.1, 0.3)) break;
            points.push([nextX, nextY]);
            [lastX, lastY] = [nextX, nextY];
            this.attemptBranching(lastX, lastY, i, points);
        }
        return points;
    }

    getNextPoint(x, y, index) {
        const { h_factor } = this;
        const angle = R.random_num(0, 1) * 2 * Math.PI;
        const h_variation = (R.random_num(0, 1) - 0.5) * h_factor;
        let nextX = x + Math.cos(angle) * 10 + h_variation;
        let nextY = this.calculateNextY(y, index, angle);

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
        const upwardOffset = R.random_int(10, 60);
        return y - upwardOffset + yOffset;
    }

    attemptBranching(x, y, index, points) {
        const { depth, maxDepth, p, h_factor, smooth_factor, flowField, resolution, index: flowerIndex, totalFlowers, patternType, flower_color, core_color } = this;
        if (R.random_bool(0.5) && depth < maxDepth) {
            const angle = points.length > 1 && index > 0 ? Math.atan2(y - points[index - 1][1], x - points[index - 1][0]) : 0;
            const branchAngle = angle + (R.random_num(0.4, 0.8));
            const branchLength = R.random_int(10, p / 2);
            if (flowField && flowField.length > 0) {
                const [prevX, prevY] = points[index - 1] || [x, y];
                const fc_1 = R_Col(SP);
                const fc_2 = R_Col(SP);
                const dx = x - prevX;
                const dy = y - prevY;
                const branchStartX = prevX + dx * 0.9;
                const branchStartY = prevY + dy * 0.9;
                const hasFlower = R.random_bool(0.5);
                const branch = new Flower(branchStartX, branchStartY, branchLength, h_factor, smooth_factor, flowField, resolution, flowerIndex, totalFlowers, patternType, fc_1, fc_2, core_color, depth + 1, maxDepth, branchAngle, hasFlower);
                this.branches.push(branch);
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
        ctx.save();
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
        ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
        ctx.shadowBlur = scaledCoreRadius * 0.4;
        ctx.shadowOffsetY = scaledCoreRadius * 0.2;
        ctx.fill();
        ctx.restore();
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'black';
        ctx.stroke();
    }

    drawPetals() {
        const numPetals = R.random_int(4, 16);
        for (let i = 0; i < numPetals; i++) {
            this.drawPetal(i, numPetals);
        }
        return numPetals;
    }

    drawPetal(index, total) {
        const { fc_1, fc_2, coreRadius, points, depth } = this;
        const angle = (index / total) * 2 * Math.PI;
        const scaleFactor = Math.pow(0.8, depth);
        const petalLength = coreRadius * scaleFactor * (0.8 + R.random_num(0.4, 1.2));
        const petalWidth = coreRadius / 2 * scaleFactor * (0.8 + R.random_num(0.4, 1.2));
        const [petalX, petalY] = [points[points.length - 1][0] + Math.cos(angle) * coreRadius * 1.5, points[points.length - 1][1] + Math.sin(angle) * coreRadius * 1.5];
        const noiseValue = perlin.noise(petalX * 0.05, petalY * 0.05);
        const n = Math.abs((noiseValue - 0.5) * 2) * scaleFactor;

        ctx.save();
        ctx.translate(petalX + n, petalY + n);
        ctx.rotate(angle);

        ctx.beginPath();

        if (mode === 1) {
            ctx.ellipse(0, 0, petalLength, petalWidth, 0, 0, 2 * Math.PI);
        } else if (mode === 2) {
            ctx.rect(-petalLength, -petalWidth / 2, petalLength * 2, petalWidth);
        } else {
            const numSides = R.random_int(3, 6);
            const angleStep = (Math.PI * 2) / numSides;
            ctx.moveTo(petalLength, 0);
            for (let i = 1; i < numSides; i++) {
                const x = Math.cos(i * angleStep) * petalLength;
                const y = Math.sin(i * angleStep) * petalWidth;
                ctx.lineTo(x, y);
            }
            ctx.closePath();
        }

        const flower_gradient = ctx.createLinearGradient(-petalLength, 0, petalLength, 0);
        flower_gradient.addColorStop(0, fc_1);
        flower_gradient.addColorStop(1, fc_2);
        ctx.fillStyle = flower_gradient;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
        ctx.shadowBlur = petalWidth * 0.4;
        ctx.shadowOffsetY = petalWidth * 0.2;
        ctx.fill();
        ctx.restore();

        this.drawPetalStroke(petalX + n, petalY + n, petalLength, petalWidth, angle, scaleFactor);
    }

    drawPetalStroke(x, y, length, width, angle, scaleFactor) {
        const { coreRadius, points, flower_color } = this;
        const petalLength = coreRadius * scaleFactor * (0.8 + R.random_num(0.4, 1.2));
        const petalWidth = coreRadius / 2 * scaleFactor * (0.8 + R.random_num(0.4, 1.2));
        const [petalX, petalY] = [points[points.length - 1][0] + Math.cos(angle) * coreRadius * 1.5, points[points.length - 1][1] + Math.sin(angle) * coreRadius * 1.5];
        const noiseValue = perlin.noise(petalX * 0.05, petalY * 0.05);
        const n = Math.abs((noiseValue - 0.5) * 2) * scaleFactor;

        ctx.save();
        ctx.translate(petalX + n, petalY + n);
        ctx.rotate(angle);


        ctx.beginPath();
        if (mode === 1) {
            ctx.ellipse(0, 0, petalLength, petalWidth, 0, 0, 2 * Math.PI);
        } else if (mode === 2) {
            ctx.rect(-petalLength, -petalWidth / 2, petalLength * 2, petalWidth);
        } else {
            const numSides = R.random_int(3, 6);
            const angleStep = (Math.PI * 2) / numSides;
            ctx.moveTo(petalLength, 0);
            for (let i = 1; i < numSides; i++) {
                const x = Math.cos(i * angleStep) * petalLength;
                const y = Math.sin(i * angleStep) * petalWidth;
                ctx.lineTo(x, y);
            }
            ctx.closePath();
        }
        ctx.restore();

        ctx.fillStyle = flower_color;
        ctx.strokeStyle = 'black';
        ctx.lineWidth = scaleFactor;
        ctx.stroke();
    }

    draw() {
        this.drawStem();
        this.branches.forEach(branch => {
            branch.draw();
        });
        if (this.hasFlower) {
            this.drawPetals();
            this.drawCore();
        }
    }
}

