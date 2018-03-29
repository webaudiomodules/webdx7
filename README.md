# webdx7 (AudioWorklet/WASM edition)
virtual Yamaha DX7 synth in a browser.

[demo](https://webaudiomodules.org/wamsynths/dx7)

other WAM demos at [webaudiomodules.org/wamsynths](https://webaudiomodules.org/wamsynths/)

Please note that low latency AudioWorklets require  [Chrome Canary 64](https://www.google.com/chrome/browser/canary.html) (or later) and setting a flag as explained [here](https://googlechromelabs.github.io/web-audio-samples/audio-worklet/). Other stable browsers are enabled with this [polyfill](https://github.com/jariseon/audioworklet-polyfill).

## info
This repo contains a work-in-progress implementation of webdx7 in WebAssembly. The binary runs in AudioWorklet. webdx7 is built on top of [Web Audio Modules (WAMs) API](https://webaudiomodules.org), which is currently extended to support AudioWorklets and WebAssembly. 

The code here includes pure hacks to work around limitations in current AudioWorklet browser implementation, and should definitely not be considered best practice :) WAMs API will be updated as AudioWorklets mature.

## prerequisites
* WASM [toolchain](http://webassembly.org/getting-started/developers-guide/)
* [node.js](https://nodejs.org/en/download/) 

## building

### #1 wasm compilation
```
cd build
export PATH=$PATH:/to/emsdk/where/emmake/resides
emmake make
```
step #1 creates two files, **dx7.wasm** and **dx7.js**. WASM binary cannot currently be loaded into AudioWorkletProcessor (AWP) directly, so let's encode it into a JS Uint8Array in step #2.

### #2 encoding
```
node encode-wasm.js dx7.wasm
```
step #2 produces **dx7.wasm.js** file, which can be loaded into AWP.


### done
We have now **dx7.wasm.js** (from step #2) and its loader **dx7.js** (from step #1). Copy these files to `dist/dx7/wasm` folder, and copy some DX7 sysex files into `dist/dx7/presets`. See readme there for instructions.

Finally open `dist/dx7.html` in a WASM-enabled browser and enjoy cool authentic FM sounds straight in browser. Works with MIDI and embedded virtual keyboard.



