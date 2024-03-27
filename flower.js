let perlin = new Perlin();

class Flower {
    constructor(x, y, p, h_factor, smooth_factor, flowField, resolution, index, totalFlowers, patternType, fc_1, fc_2, core_color, depth = 0, maxDepth = 2, parentAngle = null, hasFlower = true) {
        Object.assign(this, { x, y, p, h_factor, smooth_factor, flowField, resolution, index, totalFlowers, patternType, fc_1, fc_2, core_color, depth, maxDepth, parentAngle, hasFlower });

        this.coreRadius = 40;
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
        const upwardOffset = R.random_int(20, 100);
        return y - upwardOffset + yOffset;
    }

    attemptBranching(x, y, index, points) {
        const { depth, maxDepth, p, h_factor, smooth_factor, flowField, resolution, index: flowerIndex, totalFlowers, patternType, core_color } = this;
        if (R.random_bool(0.2) && depth < maxDepth) {
            const angle = points.length > 1 && index > 0 ? Math.atan2(y - points[index - 1][1], x - points[index - 1][0]) : 0;
            const branchAngle = angle + (R.random_num(0.4, 0.8));
            const branchLength = R.random_int(1, p / 2);
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
        const { points, smooth_factor, depth, fc_1, fc_2 } = this;
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

            if (striped_stem) {
                if (R.random_bool(0.5)) {
                    ctx.strokeStyle = fc_1;
                } else {
                    if (R.random_bool(0.75)) {
                        ctx.strokeStyle = 'black';
                    } else {
                        ctx.strokeStyle = fc_2;
                    }
                }
            } else {
                ctx.strokeStyle = 'black';
            }
            ctx.stroke();
        }
    }

    drawCore() {
        const { coreRadius, points, core_color, depth } = this;
        const numPoints = 100;
        const resolution = 0.02;
        const scale = 1;
        const [coreX, coreY] = points[points.length - 1];
        const scaleFactor = Math.pow(0.3, depth);
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

        const ellipseRadius = scaledCoreRadius * R.random_num(0.15, 0.3);
        const ellipseResolution = 0.05;
        const ellipseScale = ellipseRadius * 0.2;
        ctx.beginPath();
        for (let j = 0; j <= numPoints; j++) {
            const angle = (j / numPoints) * 2 * Math.PI;
            const [baseX, baseY] = [coreX + ellipseRadius * Math.cos(angle), coreY + ellipseRadius * Math.sin(angle)];
            const noiseValue = perlin.noise(baseX * ellipseResolution, baseY * ellipseResolution);
            const n = (noiseValue - 0.5) * ellipseScale;
            const adjustedRadius = ellipseRadius + n;
            const [x, y] = [coreX + adjustedRadius * Math.cos(angle), coreY + adjustedRadius * Math.sin(angle)];
            ctx[j === 0 ? 'moveTo' : 'lineTo'](x, y);
        }
        ctx.closePath();
        ctx.fillStyle = 'rgba(0, 0, 0, 1)';
        ctx.fill();
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
        const scaleFactor = Math.pow(0.3, depth);
        const petalLength = coreRadius * scaleFactor * (0.8 + R.random_num(0.4, 1.2));
        const petalWidth = coreRadius / 2 * scaleFactor * (0.8 + R.random_num(0.4, 1.2));
        const [coreX, coreY] = points[points.length - 1];
        const petalDistance = coreRadius * 1.5 * scaleFactor;
        const [petalX, petalY] = [coreX + Math.cos(angle) * petalDistance, coreY + Math.sin(angle) * petalDistance];
        const noiseValue = perlin.noise(petalX * 0.05, petalY * 0.05);
        const n = Math.abs((noiseValue - 0.5) * 2) * scaleFactor;
        // this.drawPetalStroke(petalX + n, petalY + n, petalLength, petalWidth, angle, scaleFactor);

        ctx.save();
        ctx.translate(petalX + n, petalY + n);
        ctx.rotate(angle);
        ctx.beginPath();
        if (mode === 1) {
            const numPoints = 100;
            const resolution = ellipse_resolution;
            const scale = petalWidth * 0.1;
            for (let i = 0; i <= numPoints; i++) {
                const t = i / numPoints;
                const angle = t * 2 * Math.PI;
                const x = petalLength * Math.cos(angle);
                const y = petalWidth * Math.sin(angle);
                const noiseValue = perlin.noise(x * resolution, y * resolution);
                const n = (noiseValue - 0.5) * scale;
                ctx[i === 0 ? 'moveTo' : 'lineTo'](x + n, y + n);
            }
        } else if (mode === 2) {
            const numPoints = 4;
            const points = [
                [-petalLength, -petalWidth / 2],
                [petalLength, -petalWidth / 2],
                [petalLength, petalWidth / 2],
                [-petalLength, petalWidth / 2]
            ];
            const resolution = ellipse_resolution;
            const scale = petalWidth * 0.1;
            ctx.moveTo(points[0][0], points[0][1]);
            for (let i = 1; i < numPoints; i++) {
                const [x, y] = points[i];
                const noiseValue = perlin.noise(x * resolution, y * resolution);
                const n = (noiseValue - 0.5) * scale;
                ctx.lineTo(x + n, y + n);
            }
            ctx.closePath();
        } else {
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

        for (let i = 0; i < numStripes; i++) {
            const startColorPosition = (i / numStripes);
            const endColorPosition = ((i + 1) / numStripes);

            const color = i % 2 === 0 ? O_col(fc_1, 0.65) : O_col(fc_2, 0.65);

            if (stripeMode) {
                flower_gradient.addColorStop(startColorPosition, color); // Start of the stripe
                if (i < numStripes - 1) {
                    flower_gradient.addColorStop(endColorPosition - 0.001, color);
                }
            } else {
                flower_gradient.addColorStop(startColorPosition, color);
            }
        }

        if (stripeMode && numStripes > 1) {
            const lastColor = numStripes % 2 === 0 ? O_col(fc_1, 0.85) : O_col(fc_2, 0.85);
            flower_gradient.addColorStop(1, lastColor);
        }


        ctx.fillStyle = flower_gradient;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
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
        const [coreX, coreY] = points[points.length - 1];
        const petalDistance = coreRadius * 1.5 * scaleFactor;
        const [petalX, petalY] = [coreX + Math.cos(angle) * petalDistance, coreY + Math.sin(angle) * petalDistance];
        const noiseValue = perlin.noise(petalX * 0.05, petalY * 0.05);
        const n = Math.abs((noiseValue - 0.5) * 2) * scaleFactor;

        ctx.save();
        ctx.translate(petalX + n, petalY + n);
        ctx.rotate(angle);


        ctx.beginPath();
        if (mode === 1) {
            const numPoints = 100;
            const resolution = ellipse_resolution;
            const scale = petalWidth * 0.1;
            for (let i = 0; i <= numPoints; i++) {
                const t = i / numPoints;
                const angle = t * 2 * Math.PI;
                const x = petalLength * Math.cos(angle);
                const y = petalWidth * Math.sin(angle);
                const noiseValue = perlin.noise(x * resolution, y * resolution);
                const n = (noiseValue - 0.5) * scale;
                ctx[i === 0 ? 'moveTo' : 'lineTo'](x + n, y + n);
            }
        } else if (mode === 2) {
            const numPoints = 4;
            const points = [
                [-petalLength, -petalWidth / 2],
                [petalLength, -petalWidth / 2],
                [petalLength, petalWidth / 2],
                [-petalLength, petalWidth / 2]
            ];
            const resolution = ellipse_resolution;
            const scale = petalWidth * 0.1;
            ctx.moveTo(points[0][0], points[0][1]);
            for (let i = 1; i < numPoints; i++) {
                const [x, y] = points[i];
                const noiseValue = perlin.noise(x * resolution, y * resolution);
                const n = (noiseValue - 0.5) * scale;
                ctx.lineTo(x + n, y + n);
            }
            ctx.closePath();
        } else {
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

    drawParticles() {
        const { coreRadius, points, depth, fc_1, fc_2 } = this;
        const [coreX, coreY] = points[points.length - 1];
        const scaleFactor = Math.pow(0.7, depth);
        const scaledCoreRadius = coreRadius * scaleFactor;
        const numParticles = R.random_int(5, 50);
        for (let i = 0; i < numParticles; i++) {
            const particleRadius = scaledCoreRadius * R.random_num(0.05, 0.15);
            const particleResolution = 0.1;
            const particleScale = particleRadius * 0.5;
            const angle = R.random_num(0, 2 * Math.PI);
            const distance = scaledCoreRadius * R.random_num(1.2, 5);
            const [particleX, particleY] = [coreX + distance * Math.cos(angle), coreY + distance * Math.sin(angle)];
            ctx.beginPath();
            for (let j = 0; j <= 50; j++) {
                const angle = (j / 50) * 2 * Math.PI;
                const [baseX, baseY] = [particleX + particleRadius * Math.cos(angle), particleY + particleRadius * Math.sin(angle)];
                const noiseValue = perlin.noise(baseX * particleResolution, baseY * particleResolution);
                const n = (noiseValue - 0.5) * particleScale;
                const adjustedRadius = particleRadius + n;
                const [x, y] = [particleX + adjustedRadius * Math.cos(angle), particleY + adjustedRadius * Math.sin(angle)];
                ctx[j === 0 ? 'moveTo' : 'lineTo'](x, y);
            }
            ctx.closePath();
            ctx.fillStyle = R.random_bool(0.7) ? O_col(fc_1, R.random_num(0.3, 0.8)) : O_col(fc_2, R.random_num(0.3, 0.8)); ctx.fill();
        }
    }

    draw() {
        this.drawStem();
        this.branches.forEach(branch => {
            branch.draw();
        });
        if (this.hasFlower) {
            this.drawPetals();
            this.drawCore();
            this.drawParticles(); // B. Draw particles around the flower head

        }
    }
}

