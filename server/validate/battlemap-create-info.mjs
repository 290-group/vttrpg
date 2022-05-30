import Ajv from "ajv";
import * as TJS from "typescript-json-schema";
import * as path from "path";
import * as url from "url";

const dirname = path.dirname(url.fileURLToPath(import.meta.url));

const ajv = new Ajv();

const battlemapCreateInfoSchema = TJS.generateSchema(
    TJS.getProgramFromFiles([path.join(dirname, "./battlemap-create-info.ts")]),
    "BattlemapCreateInfo"
);
console.log(battlemapCreateInfoSchema);
// const battlemapCreateInfoSchema = {
//     type: "object",
//     properties: {
//         width: { type: "integer" },
//         height: { type: "integer" },
//         name: { type: "string" },
//         password: { type: "string" },
//         dmPassword: { type: "string" },
//     },
//     required: ["width", "height", "name", "password", "dmPassword"],
//     additionalProperties: false
// }
export const validateBattlemapCreateInfo = ajv.compile(battlemapCreateInfoSchema);


