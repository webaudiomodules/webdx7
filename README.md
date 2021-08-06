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

## building, distribution and demo usage

### #1 wasm compilation and encoding
```
cd build
export PATH=$PATH:/to/emsdk/where/emmake/resides
emmake make
```
step #1 creates three files:
- the loader: **dx7.js**.
- the raw WASM binary: **dx7.wasm**
- a JavaScript embedding of the WASM binary: **dx7.wasm.js**

### #2 copy built files to `dist/dx7/wasm`
Next copy the built files to `dist/dx7/wasm` by running:
```
make dist
```

### #3 try it out
Now that you've built webdx7 and put the files in place, copy some DX7 sysex files into `dist/dx7/presets`. See readme there for instructions.

Finally open `dist/dx7.html` in a WASM-enabled browser and enjoy cool authentic FM sounds straight in browser. Works with MIDI and embedded virtual keyboard.

## licenses
- webdx7 code is MIT licensed
- MSFA is Apache 2.0 licensed
- tuning-library is [permissively licensed](/src/c/tuning-library/LICENSE.md)
See [here](https://github.com/webaudiomodules/webdx7/issues/7#issuecomment-809681630)
