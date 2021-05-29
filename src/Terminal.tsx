import React, { useState, useRef } from 'react';
import useInterval from 'react-useinterval';
import update from 'immutability-helper';

import './Terminal.css';
import font from './compiled.json';
import { GridCell } from './types';

function rint(n: number) { return Math.floor(Math.random() * n) }

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

const INIT_CELL: GridCell = {
    bg: 0,
    layers: [{
        fg: 215,
        code: 0
    }]
}

const INIT_GRID: GridCell[] = [...new Array(COLS * ROWS)].map(() => ({ ...INIT_CELL }));

export default function Terminal() {

    const [gridState, setGridState] = useState<GridCell[]>(INIT_GRID);
    const divRef = useRef<HTMLDivElement>(null);

    const colors: Array<string> = [];
    for (let r = 0; r <= 5; r += 1) {
        for (let g = 0; g <= 5; g += 1) {
            for (let b = 0; b <= 5; b += 1) {
                colors.push(`${HEX[r]}${HEX[g]}${HEX[b]}`); // 216 color cube (0/3/6/9/C/F for RGB)
            }
        }
    }

    function setCells(changes: { x: number, y: number, code?: number, fg?: number }[]) {

        const merge: { [key: number]: GridCell } = {};

        for (const { x, y, code, fg } of changes) {
            const pos = y * COLS + x;
            merge[pos] = {
                bg: gridState[pos].bg,
                layers: [{
                    code: code ?? gridState[pos].layers[0].code,
                    fg: fg ?? gridState[pos].layers[0].fg
                }]
            };
        }
        setGridState(update(gridState, { $merge: merge }));
    }

    useInterval(
        () => {
            const changes = [...new Array(1000)].map(
                (_, idx) => ({
                    x: rint(COLS),
                    y: rint(ROWS),
                    fg: rint(216),
                    code: rint(384) + 32
                })
            );
            setCells(changes);
        }, 125
    )

    const scale = (divRef.current?.clientWidth ?? 640) / 640;

    return <div className='terminal' ref={divRef}>
        <svg style={{
            imageRendering: 'crisp-edges',
            width: 640 * scale,
            height: 400 * scale
        }}>
            <defs>
                {
                    colors.map((col) => {
                        const r = parseInt(col.charAt(0), 16) / 15;
                        const g = parseInt(col.charAt(1), 16) / 15;
                        const b = parseInt(col.charAt(2), 16) / 15;
                        return (<filter id={`color_${col}`} key={`color_${col}`}>
                            <feColorMatrix type='matrix'
                                values={`0 0 0 ${r} 0
                                         0 0 0 ${g} 0
                                         0 0 0 ${b} 0
                                         0 0 0 0 1`} />
                        </filter>)
                    })
                }
            </defs>
            {gridState.map(
                (cell, idx) => {
                    const x = idx % COLS;
                    const y = Math.floor(idx / COLS);
                    return cell.layers.map((layer) =>
                        <image
                            key={`${x}-${y}`}
                            href={`data:image/png;base64,${font[layer.code]}`}
                            x={`${x * 8 * scale}px`}
                            y={`${y * 16 * scale}px`}
                            width={8 * scale}
                            height={16 * scale}
                            filter={`url(#color_${colors[layer.fg]})`}
                        />
                    );
                }
            )}
        </svg>
    </div>;

}