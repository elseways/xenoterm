import React, { useState } from 'react';
import useInterval from 'react-useinterval';
import update from 'immutability-helper';

import './Terminal.css';
import Cell from './Cell';
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
            const changes = [...new Array(25)].map(
                (_, idx) => ({
                    x: idx,
                    y: idx,
                    fg: `${HEX[rint(6)]}${HEX[rint(6)]}${HEX[rint(6)]}`,
                    code: rint(96) + 32
                })
            );
            setCell(changes);
        }, 50
    )

    return <svg viewBox='0 0 640 400'>
        <defs>
            {colors.map(
                ({ r, g, b }) => <filter key={`${r}-${g}-${b}`} id={`color_${r.toString(16)}${g.toString(16)}${b.toString(16)}`}>
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
        {gridState.map(
            (gridCell, idx) => {
                const x = idx % 80;
                const y = Math.floor(idx / 80);
                return (<Cell
                    key={`${x}-${y}`}
                    x={x * 8}
                    y={y * 16}
                    cell={gridCell}
                />);
            }
        )}
    </svg>;

}