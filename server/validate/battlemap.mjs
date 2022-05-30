import Ajv from "ajv";

const ajv = new Ajv();

const tileLayerSchema = {
    type: "object",
    properties: {
        images: { type: "array", items: { type: "array", items: { type: "integer" } }}
    },
    requred: ["images"],
    additionalProperties: false
};

c

const battlemapSchema = {
    type: "object",
    properties: {
        imagePalette: { type: "array", items: { type: "string" } },
        width: { type: "integer" },
        height: { type: "integer" },
        tileLayers: {
            type: "array",
            items: tileLayerSchema
        }
    },
    required: ["width", "height", "name", "password", "dmPassword"],
    additionalProperties: false
};



export const validateBattlemap = ajv.compile(battlemapSchema);


