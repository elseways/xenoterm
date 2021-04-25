export type GridCell = {
    bg: number,
    layers: Layer[],
}

export type Layer = {
    code: number,
    fg: number,
    effect?: Effect
}

export type Effect = null; // handle this later