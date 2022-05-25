let canvas = document.getElementById("main-canvas");

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