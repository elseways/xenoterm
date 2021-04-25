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
    bg: '000',
    layers: [{
        fg: 'fff',
        code: 0
    }]
}

const INIT_GRID: GridCell[] = [...new Array(COLS * ROWS)].map(() => ({ ...INIT_CELL }));

export default function Terminal() {

    const [gridState, setGridState] = useState<GridCell[]>(INIT_GRID);
    const divRef = useRef<HTMLDivElement>(null);

    const colors: Array<{ r: number, g: number, b: number }> = [];
    for (let r = 0; r <= 15; r += 3) {
        for (let g = 0; g <= 15; g += 3) {
            for (let b = 0; b <= 15; b += 3) {
                colors.push({ r, g, b }); // 216 color cube (0/3/6/9/C/F for RGB)
            }
        }
    }

    function setCell(changes: { x: number, y: number, code?: number, fg?: string }[]) {

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
                    fg: `${HEX[rint(6)]}${HEX[rint(6)]}${HEX[rint(6)]}`,
                    code: rint(96) + 32
                })
            );
            setCell(changes);
        }, 50
    )

    const scale = (divRef.current?.clientWidth ?? 640) / 640;

    return <div className='terminal' ref={divRef}>
        {gridState.map(
            (cell, idx) => {
                return (
                    <img
                        style={{
                            position: 'absolute',
                            left: `${(idx % COLS) * 8 * scale}px`,
                            top: `${Math.floor(idx / COLS) * 16 * scale}px`,
                            filter: 'drop-shadow(1 1 0 blue)',
                            background: cell.bg,
                            transform: scale > 1 ? `scale(${scale})` : undefined
                        }}
                        alt={''}
                        src={`data:image/png;base64,${font[cell.layers[0].code]}`}
                    />);
            }
        )}
    </div>;

}