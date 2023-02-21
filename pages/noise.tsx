import { FC, useEffect, useRef } from 'react';

const Perlin: FC = () => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
    const noiseSize = 300;
	const noiseWidth = noiseSize;
	const noiseHeight = noiseSize;
    const noiseScale = 30;

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		let noise: number[][] = new Array(noiseWidth);
		for (let i = 0; i < noiseWidth; i++) {
			noise[i] = new Array(noiseHeight);
			for (let j = 0; j < noiseHeight; j++) {
				noise[i][j] = perlinNoise(i / noiseScale, j / noiseScale);
			}
		}

		const imageData = ctx.createImageData(noiseWidth, noiseHeight);

		for (let y = 0; y < noiseHeight; y++) {
			for (let x = 0; x < noiseWidth; x++) {
				const i = (y * noiseWidth + x) * 4;
				const value = Math.round(noise[x][y] * noiseSize);
				imageData.data[i] = value;
				imageData.data[i + 1] = value;
				imageData.data[i + 2] = value;
				imageData.data[i + 3] = 255;
			}
		}

		ctx.putImageData(imageData, 0, 0);
	}, []);

	

	return (
		<canvas ref={canvasRef} width={noiseWidth} height={noiseHeight} />
	);
};

export default Perlin;

function perlinNoise(x: number, y: number): number {
    let xi = Math.floor(x);
    let yi = Math.floor(y);
    let xf = x - xi;
    let yf = y - yi;

    let n00 = dotGridGradient(xi, yi, xf, yf);
    let n01 = dotGridGradient(xi, yi + 1, xf, yf - 1);
    let n10 = dotGridGradient(xi + 1, yi, xf - 1, yf);
    let n11 = dotGridGradient(xi + 1, yi + 1, xf - 1, yf - 1);

    let u = fade(xf);
    let v = fade(yf);

    let a = lerp(n00, n10, u);
    let b = lerp(n01, n11, u);

    return lerp(a, b, v);
}

function dotGridGradient(ix: number, iy: number, x: number, y: number): number {
    let gradient = getGradient(ix, iy);
    let dx = x - ix;
    let dy = y - iy;
    return (dx * gradient[0] + dy * gradient[1]);
}

function getGradient(ix: number, iy: number): [number, number] {
    let angle = Math.PI * noise2D(ix, iy);
    return [Math.cos(angle), Math.sin(angle)];
}

function noise2D(x: number, y: number): number {
    let n = x + y * 57;
    n = (n << 13) ^ n;
    return (1.0 - ((n * (n * n * 15731 + 789221) + 1376312589) & 0x7fffffff) / 1073741824.0);
}

function fade(t: number): number {
    return t * t * t * (t * (t * 6 - 15) + 10);
}

function lerp(a: number, b: number, t: number): number {
    return ((1 - t) * a) + (t * b);
}