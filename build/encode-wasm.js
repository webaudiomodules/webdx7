// thanks to Steven Yi / Csound
//
fs = require('fs');
let wasmData = fs.readFileSync("dx7.wasm");
let wasmStr = wasmData.join(",");
let wasmOut = "AudioWorkletGlobalScope.WAM = { ENVIRONMENT: 'WEB' }\n";
wasmOut += "AudioWorkletGlobalScope.WAM.wasmBinary = new Uint8Array([" + wasmStr + "]);";
fs.writeFileSync("dx7.wasm.js", wasmOut);

// later we will possibly switch to base64
// as suggested by Stephane Letz / Faust
// let base64 = wasmData.toString("base64");
// fs.writeFileSync("dx7.base64.js", base64);
