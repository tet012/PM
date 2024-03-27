class BackgroundElement {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }
}

class Cloud extends BackgroundElement {
    constructor(x, y) {
        const radius = R.random_num(50, 100);
        const color = 'rgba(255, 255, 255, 0.8)';
        super(x, y, radius, color);
        this.numPuffs = R.random_int(3, 6);
        this.puffs = this.createPuffs();
    }

    createPuffs() {
        const puffs = [];
        // Adjust the initial angle to make the cloud more horizontal
        let startAngle = Math.PI / 4;
        let endAngle = Math.PI * 3 / 4;
        for (let i = 0; i < this.numPuffs; i++) {
            // Distribute puffs more horizontally
            const angle = startAngle + (i / (this.numPuffs - 1)) * (endAngle - startAngle);
            const distance = R.random_num(this.radius * 0.85, this.radius); // Keep puffs closer for a more cohesive cloud
            const puffRadius = R.random_num(this.radius * 0.85, this.radius * 0.75); // Adjust puff size for variety
            // Adjust X and Y to create an elongated cloud shape
            const puffX = this.x + Math.cos(angle) * distance;
            const puffY = this.y + Math.sin(angle) * distance * 0.5; // Squash vertically to enhance horizontal stretch
            const puff = new BackgroundElement(puffX, puffY, puffRadius, this.color);
            puffs.push(puff);
        }
        return puffs;
    }

    draw() {
        // Draw the cloud base
        super.draw(); // Optional: draw a base shape for the cloud, can be omitted
        // Draw the puffs
        this.puffs.forEach(puff => puff.draw());
    }
}
