if (process.argv.length != 3) {
  console.log("usage: node encode-wasm.js mymodule.wasm");
	return;
}

let wasmName = process.argv[2];
let name = wasmName.substr(0, wasmName.length - 5).toUpperCase();

// thanks to Steven Yi / Csound
//
fs = require('fs');
let wasmData = fs.readFileSync(wasmName);
let wasmStr = wasmData.join(",");
let wasmOut = "AudioWorkletGlobalScope.WAM = AudioWorkletGlobalScope.WAM || {}\n";
wasmOut += "AudioWorkletGlobalScope.WAM." + name + " = { ENVIRONMENT: 'WEB' }\n";
wasmOut += "AudioWorkletGlobalScope.WAM." + name + ".wasmBinary = new Uint8Array([" + wasmStr + "]);";
fs.writeFileSync(wasmName + ".js", wasmOut);
