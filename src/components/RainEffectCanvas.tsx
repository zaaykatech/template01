'use client';

import React, { useEffect, useRef } from 'react';
import RainRenderer from '../lib/raineffect/rain-renderer';
import Raindrops from '../lib/raineffect/raindrops';
import loadImages from '../lib/raineffect/image-loader';
import createCanvas from '../lib/raineffect/create-canvas';

export default function RainEffectCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!canvasRef.current || !containerRef.current) return;
        
        const canvas = canvasRef.current;
        const container = containerRef.current;

        // Fix DPI and sizes based on the container size rather than window
        let dpi = window.devicePixelRatio || 1;
        
        const updateSize = () => {
            const rect = container.getBoundingClientRect();
            canvas.width = rect.width * dpi;
            canvas.height = rect.height * dpi;
            canvas.style.width = rect.width + "px";
            canvas.style.height = rect.height + "px";
            return { width: canvas.width, height: canvas.height };
        };

        const size = updateSize();

        let textureFg: HTMLCanvasElement, textureFgCtx: CanvasRenderingContext2D | null;
        let textureBg: HTMLCanvasElement, textureBgCtx: CanvasRenderingContext2D | null;
        let textureBgSize = { width: 384, height: 256 };
        let textureFgSize = { width: 96, height: 64 };

        loadImages([
            { name: "dropAlpha", src: "/img/drop-alpha.png" },
            { name: "dropColor", src: "/img/drop-color.png" },
            { name: "textureRainFg", src: "/img/weather/texture-rain-fg.png" },
            { name: "textureRainBg", src: "/img/weather/texture-rain-bg.png" },
        ]).then((images: any) => {
            if (!canvasRef.current) return; // unmounted

            const dropAlpha = images.dropAlpha.img;
            const dropColor = images.dropColor.img;
            const textureRainFg = images.textureRainFg.img;
            const textureRainBg = images.textureRainBg.img;

            const raindrops = new Raindrops(
                size.width,
                size.height,
                dpi,
                dropAlpha,
                dropColor,
                {
                    trailRate: 1,
                    trailScaleRange: [0.2, 0.45],
                    collisionRadius: 0.45,
                    dropletsCleaningRadiusMultiplier: 0.28,
                }
            );

            textureFg = createCanvas(textureFgSize.width, textureFgSize.height);
            textureFgCtx = textureFg.getContext('2d');
            textureBg = createCanvas(textureBgSize.width, textureBgSize.height);
            textureBgCtx = textureBg.getContext('2d');

            if (textureFgCtx) {
                textureFgCtx.globalAlpha = 1;
                textureFgCtx.drawImage(textureRainFg, 0, 0, textureFgSize.width, textureFgSize.height);
            }
            if (textureBgCtx) {
                textureBgCtx.globalAlpha = 1;
                textureBgCtx.drawImage(textureRainBg, 0, 0, textureBgSize.width, textureBgSize.height);
            }

            new RainRenderer(
                canvas, 
                raindrops.canvas, 
                textureFg, 
                textureBg, 
                null, 
                {
                    brightness: 1.04,
                    alphaMultiply: 6,
                    alphaSubtract: 3,
                }
            );
        });

    }, []);

    return (
        <div ref={containerRef} className="absolute inset-0 z-0 overflow-hidden rounded-2xl pointer-events-none opacity-60 mix-blend-overlay">
            <canvas ref={canvasRef} className="w-full h-full" />
        </div>
    );
}
