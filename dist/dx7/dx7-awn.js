class DX7 extends AudioWorkletNode
{
  constructor (actx, options) {
    options = options || {};
    options.numberOfInputs  = 1;
    options.numberOfOutputs = 1;
    options.channelCount = 1;

    super(actx, "DX7", options);
  }
  
  static importScripts (actx) {
    return new Promise( (resolve) => {
      actx.audioWorklet.addModule("dx7/dx7.wasm.js").then(() => {
      actx.audioWorklet.addModule("dx7/loader.js").then(() => {
      actx.audioWorklet.addModule("dx7/wam-processor.js").then(() => {
      actx.audioWorklet.addModule("dx7/dx7-awp.js").then(() => {
        setTimeout( function () { resolve(); }, 500);
      }) }) }) });      
    })
  }
}
