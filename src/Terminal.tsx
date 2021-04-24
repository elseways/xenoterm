import React from 'react';
import './Terminal.css';
import Cell from './Cell';

// const FPS = 20;
// const BPS = 162;
// let beatTimer = 0;
// let beats = 0;

// function refresh() {
//     beatTimer += BPS;
//     if (beatTimer > FPS * 60) {
//         beatTimer -= FPS * 60;
//         beats += 1;
//         // console.log(beats);
//     }
// }

const COLS = 80;
const ROWS = 25;

const HEX = ['0', '3', '6', '9', 'c', 'f'];

export default function Terminal() {

    const cells: JSX.Element[] = [];

    for (let c = 0; c < COLS; c++) {
        for (let r = 0; r < ROWS; r++) {
            cells.push(
                <Cell
                    key={r * COLS + c}
                    x={c * 8}
                    y={r * 16}
                    cell={{
                        bg: (c + r) % 2 === 0 ? '#033' : '#066',
                        layers: [
                            {
                                fg: `${HEX[r % 6]}${HEX[(c * 5) % 6]}${HEX[(r + c) % 6]}`,
                                code: (c * 13 + r * 17) % 96 + 32,
                                effect: null
                            }
                        ]
                    }
                    }
                />
            )
        }
    }

    const colors: Array<{ r: number, g: number, b: number }> = [];
    for (let r = 0; r <= 15; r += 3) {
        for (let g = 0; g <= 15; g += 3) {
            for (let b = 0; b <= 15; b += 3) {
                colors.push({ r, g, b }); // 216 color cube (0/3/6/9/C/F for RGB)
            }
        }
    }

    return <svg viewBox='0 0 640 400'>
        <defs>
            {colors.map(
                ({ r, g, b }) => <filter id={`color_${r.toString(16)}${g.toString(16)}${b.toString(16)}`}>
                    <feColorMatrix
                        type='matrix'
                        values={`0 0 0 0 ${r / 15} 
                                 0 0 0 0 ${g / 15}
                                 0 0 0 0 ${b / 15}
                                 0 0 0 1 0`}
                    />
                </filter>
            )}
        </defs>
        {cells}
    </svg>;

}