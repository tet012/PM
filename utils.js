function windEffect(time, intensity = 1) {
    return Math.sin(time / 1000) * intensity;
}

function R_Col(colorsArray) {
    return R.random_choice(colorsArray);
}

function colorWithOpacity(hslColor, opacity) {
    let values = hslColor.match(/\d+/g);
    if (!values || values.length !== 3) {
        return hslColor;
    }

    return `hsla(${values[0]}, ${values[1]}%, ${values[2]}%, ${opacity})`;
}

function genTokenData(projectNum) {
    let data = {};
    let hash = "0x";
    for (var i = 0; i < 64; i++) {
        hash += Math.floor(Math.random() * 16).toString(16);
    }
    data.hash = hash;
    data.tokenId = (
        projectNum * 1000000 +
        Math.floor(Math.random() * 1000)
    ).toString();
    return data;
}
let tokenData = genTokenData(123);

class Random {
    constructor() {
        this.useA = false;
        let sfc32 = function (uint128Hex) {
            let a = parseInt(uint128Hex.substring(0, 8), 16);
            let b = parseInt(uint128Hex.substring(8, 16), 16);
            let c = parseInt(uint128Hex.substring(16, 24), 16);
            let d = parseInt(uint128Hex.substring(24, 32), 16);
            return function () {
                a |= 0;
                b |= 0;
                c |= 0;
                d |= 0;
                let t = (((a + b) | 0) + d) | 0;
                d = (d + 1) | 0;
                a = b ^ (b >>> 9);
                b = (c + (c << 3)) | 0;
                c = (c << 21) | (c >>> 11);
                c = (c + t) | 0;
                return (t >>> 0) / 4294967296;
            };
        };
        this.prngA = new sfc32(tokenData.hash.substring(2, 34));
        this.prngB = new sfc32(tokenData.hash.substring(34, 66));
        for (let i = 0; i < 1e6; i += 2) {
            this.prngA();
            this.prngB();
        }
    }
    random_dec() {
        this.useA = !this.useA;
        return this.useA ? this.prngA() : this.prngB();
    }
    random_num(a, b) {
        return a + (b - a) * this.random_dec();
    }
    random_int(a, b) {
        return Math.floor(this.random_num(a, b + 1));
    }
    random_bool(p) {
        return this.random_dec() < p;
    }
    random_choice(list) {
        return list[this.random_int(0, list.length - 1)];
    }
}

function reload() {
    location.reload();
}

document.addEventListener("click", reload);

function chaikinSmooth(arr, num) {
    if (num === 0) return arr;
    const l = arr.length;
    const smooth = [arr[0]];
    for (let i = 0; i < l - 1; i++) {
        const c = arr[i];
        const next = arr[i + 1];
        smooth.push(
            [0.75 * c[0] + 0.25 * next[0], 0.75 * c[1] + 0.25 * next[1]],
            [0.25 * c[0] + 0.75 * next[0], 0.25 * c[1] + 0.75 * next[1]]
        );
    }
    smooth.push(arr[arr.length - 1]);
    return num === 1 ? smooth : chaikinSmooth(smooth, num - 1);
}

function flowfield(width, height, resolution, noiseScale, noiseStrength, angleOffset, startY) {
    const cols = Math.floor(width / resolution);
    const rows = Math.floor((height - H * 0.1) / resolution) + 1;
    const field = new Array(rows);
    for (let y = 0; y < rows; y++) {
        field[y] = new Array(cols);
        for (let x = 0; x < cols; x++) {
            const noiseX = (x + 0.5) * noiseScale;
            const noiseY = (y + startY / resolution + 0.5) * noiseScale;
            const noiseValue = perlin.noise(noiseX, noiseY);
            const angle = noiseValue * Math.PI * 2 * noiseStrength + angleOffset;
            field[y][x] = angle;
        }
    }
    return field;
}

function lerp(a, b, t) {
    return a + (b - a) * t;
}

class Perlin {
    constructor() {
        this.permutation = [...Array(256).keys()];
        this.permutation = this.permutation.concat(this.permutation);
        this.shuffle(this.permutation);
    }

    shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    noise(x) {
        if (x < 0) x = -x;
        let xi = Math.floor(x) & 255;
        let xf = x - Math.floor(x);
        let u = this.fade(xf);
        return this.lerp(u, this.grad(this.permutation[xi], xf), this.grad(this.permutation[xi + 1], xf - 1)) * 2;
    }

    fade(t) {
        return t * t * t * (t * (t * 6 - 15) + 10);
    }

    lerp(t, a, b) {
        return a + t * (b - a);
    }

    grad(hash, x) {
        let h = hash & 15;
        let grad = 1 + (h & 7);
        if (h & 8) grad = -grad;
        return (grad * x);
    }
}