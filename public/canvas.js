let canvas = document.getElementById("main-canvas");

async function fetchImage(url) {
    let imgReq = await fetch(url);
    let blob = await imgReq.blob();
    //let image = document.createElement("img");
    return createImageBitmap(blob);
    //image.src = URL.createObjectURL(blob);
    //return image;
}

class TileLayer {
    constructor (options) {
        if (!options.width) throw new Error("TileLayer requires a width.");
        this.width = options.width;
        if (!options.height) throw new Error("TileLayer requires a height.");
        this.height = options.height;
        if (!options.images || !(options.images instanceof Map)) throw new Error("TileLayer requires images.");
        this.images = options.images;

        this.grid = [];
        for (let y = 0; y < this.height; y++) {
            this.grid.push([]);
            for (let x = 0; x < this.width; x++) {
                this.grid[y].push(options.defaultTile || "");
            }
        }

        if (!options.ctx || !(options.ctx instanceof CanvasRenderingContext2D)) throw new Error("TileLayer requires a canvas context (ctx).");
        this.ctx = options.ctx;
    }

    drawRegion(x, y, w, h) {
        this.checkTileBounds(x, y);
        this.checkTileBounds(x + w - 1, y + h - 1);
        let ctx = this.ctx;
        for (let i = y; i < y + h; i++) {
            for (let j = x; j < x + w; j++) {
                ctx.drawImage(this.images.get(this.grid[i][j]), j, i, 1, 1);
            }
        }
    }

    draw() {
        this.drawRegion(0, 0, this.width, this.height);
    }

    checkTileBounds(x, y) {
        if (x < 0 || x >= this.width) 
            throw new Error(`Bad Tile Bounds: x = ${x} is not in the range [0, ${this.width})`);
        if (y < 0 || y >= this.height) 
            throw new Error(`Bad Tile Bounds: y = ${y} is not in the range [0, ${this.height})`);
    }

    getTileImage(x, y) {
        this.checkTileBounds(x, y);
        return this.grid[y][x];
    }

    setTileImage(x, y, image) {
        this.checkTileBounds(x, y);
        this.grid[y][x] = image;
    }
}

class DrawLayer {
    constructor (options) {
        
    }
}

class CanvasController {
    constructor (options) {
        if (!options.canvas) throw new Error("CanvasController requires a canvas.");
        this.canvas = options.canvas;
        this.ctx = canvas.getContext("2d");
        this.layers = [];
    }

    draw(dragger) {
        dragger.applyTransforms(this.canvas, this.ctx);
        this.layers.forEach(l => l.draw());
    }
}

class ElementDragger {
    constructor (elem) {
        let mouseDown = false;
        this.position = { x: 0, y: 0 };
        this.scale = 16;
        this.elem = elem;
        this.mouseDownHandler = e => {
            if (e.button == 0) mouseDown = true;
        }
        this.mouseUpHandler = e => {
            if (e.button == 0) mouseDown = false;
        }
        this.mouseMoveHandler = e => {
            if (mouseDown) {
                this.position = {
                    x: this.position.x + e.movementX / this.scale,
                    y: this.position.y + e.movementY / this.scale
                };
            }
        }
        this.wheelHandler = e => {
            this.scale *= (1 + 0.1 * Math.sign(e.deltaY));
        }
        elem.addEventListener("mousedown", this.mouseDownHandler);
        elem.addEventListener("mouseup", this.mouseUpHandler);
        elem.addEventListener("mousemove", this.mouseMoveHandler);
        elem.addEventListener("wheel", this.wheelHandler);
    }

    applyTransforms(c, ctx) {
        ctx.translate(c.width / 2, c.height / 2);
        ctx.scale(this.scale, this.scale);
        ctx.translate(this.position.x, this.position.y);
        //ctx.setTransform(this.scale, 1, 1, this.scale, this.position.x, this.position.y);
    }

    pixelSpaceToWorldSpace(x, y, c) {
        x += c.width / 2;
        y += c.height / 2;
        x *= this.scale;
        y *= this.scale;
        x += this.position.x
        y += this.position.y
        return { x, y };
    }

    disableDragging() {
        this.elem.removeEventListener("mousedown", this.mouseDownHandler);
        this.elem.removeEventListener("mouseup", this.mouseUpHandler);
        this.elem.removeEventListener("mousemove", this.mouseMoveHandler);
        this.elem.removeEventListener("wheel", this.wheelHandler);
    }
}

function makeHTMLTree(tree) {
    if (!tree.tag) throw new Error("Cannot make an HTML tree without a tag!");
    let elem = document.createElement(tree.tag);
    if (tree.attr && tree.attr instanceof Object) {
        Object.entries(tree.attr).forEach(([key, value]) => {
            elem[key] = value;
        });
    }
    if (tree.children && tree.children instanceof Array) {
        tree.children.forEach(child => {
            if (child instanceof HTMLElement) {
                elem.appendChild(child);
            } else {
                elem.appendChild(makeHTMLTree(child));
            }
        })
    }
    return elem;
}

document.body.appendChild(makeHTMLTree({
    tag: "div",
    attr: {},
    children: [
        {
            tag: "p",
            attr: { innerText: "test html tree thingy" }
        },
        {
            tag: "p",
            attr: { innerText: "test html tree thingy ANOTHER THING" }
        }
    ]
}));

async function testMain() {
    let c =  document.getElementById("main-canvas");
    let ctx = c.getContext("2d");
    let imageLUT = new Map();
    let test1 = await fetchImage("test1.png");
    let test2 = await fetchImage("test2.png");
    let test3 = await fetchImage("icons/Icon 1.png");
    let dragger = new ElementDragger(c);
    imageLUT.set(0, test1);
    imageLUT.set(1, test2);
    imageLUT.set(2, test3);
    let controller = new CanvasController({ canvas: c });
    for (let i = 0; i < 3; i++) {
        let tl = new TileLayer({
            width: 12,
            height: 12,
            images: imageLUT,
            ctx
        });
        controller.layers.push(tl);

        for (let i = 0; i < 12; i++) {
            for (let j = 0; j < 12; j++) {
                tl.grid[i][j] = Math.floor(Math.random() * 3);
            }
        }
    }

    function loop() {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.fillRect(0, 0, c.width, c.height);
        // dragger.applyTransforms(c, ctx);
        // tl.drawRegion(0, 0, 12, 12);
        controller.draw(dragger);
        requestAnimationFrame(loop);
    }
    loop();

    //ctx.scale(64, 64);
    //ctx.drawImage(imageLUT.get(1), 0, 0, 2, 2);
    //document.body.appendChild(imageLUT.get(1));
}

testMain();