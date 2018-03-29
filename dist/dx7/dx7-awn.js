// webDX7 (WAM)
// Jari Kleimola 2017-18 (jari@webaudiomodules.org)

class DX7 extends WAMController
{
  constructor (actx, options) {
    options = options || {};
    options.numberOfInputs  = 0;
    options.numberOfOutputs = 1;
    options.outputChannelCount = [1];

    super(actx, "DX7", options);
  }
  
  static importScripts (actx) {
    var origin = location.origin + "/";
    return new Promise( (resolve) => {
      actx.audioWorklet.addModule(origin + "dx7/wasm/dx7.wasm.js").then(() => {
      actx.audioWorklet.addModule(origin + "dx7/wasm/dx7.js").then(() => {
      actx.audioWorklet.addModule(origin + "../wamsdk/wam-processor.js").then(() => {
      actx.audioWorklet.addModule(origin + "dx7/dx7-awp.js").then(() => {
        resolve();
      }) }) }) });      
    })
  }
}
