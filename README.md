# vttrpg
Virtual tabletop role playing game battle map thing.

## Battlemap Format:
Serverside battlemap format/specification:
```ts
type Circle {
    type: "circle",
    x: number,
    y: number,
    r: number
}

type Rectangle {
    type: "rectangle",
    x1: number,
    y1: number,
    x2: number,
    y2: number
}

type Polyline {
    type: "polyline",
    points: { x: number, y: number }[]
}

type Token {
    x: number,
    y: number,
    image: string,
    stats: number[]
    maxStats: number[]
}

type Battlemap {
    imagePalette: string[], // all possible image URLs in the battlemap
    width: number, // width of battlemap in tiles
    height: number, // height of battlemap in tiles
    tileLayers: {
        images: number[][] // 2D array of indexes into the imagePalette array
    }[],
    shapeLayers: {
        shapes: (Circle | Rectangle | Polyline)[],
        isFogOfWar: bool
    }[],
    tokens: Token[]
}

type Session {
    battlemap: Battlemap,
    password: string,
    dmPassword: string
}
```

## Battlemap Create Request Format
Data structure used to generate a battlemap
```ts
type BattlemapCreateInfo {
    width: number,
    height: number,
    name: string,
    password: string,
    dmPassword: string
}
```