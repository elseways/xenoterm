import React from 'react';
import font from './compiled.json';

import { GridCell } from './types';

type Props = {
    x: number,
    y: number,

    cell: GridCell,

    // fx: CellEffects
}

export default function Cell(props: Props) {

    const { x, y, cell } = props;

    return <g>
        <rect x={x} y={y} height={16} width={8} fill={cell.bg} />
        {cell.layers.map(
            (cell) => {
                const { code, fg } = cell;
                return <image
                    x={x}
                    y={y}
                    height={16}
                    width={8}
                    href={`data:image/png;base64,${font[code] ?? font[0]}`}
                    data-char={code}
                    filter={`url(#color_${fg})`}
                />
            }
        )}
    </g>;

}