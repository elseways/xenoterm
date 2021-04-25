export type GridCell = {
    bg: string,
    layers: Layer[],
}

export type Layer = {
    code: number,
    fg: string,
    effect?: Effect
}

export type Effect = null; // handle this later