// work in progress
// helper class for WASM data marshalling and C function call binding
// also provides midi, patch data, parameter and arbitrary message support

class WAMProcessor extends AudioWorkletProcessor
{
  static get parameterDescriptors() {
    return [];
  }
  
  constructor(options) {
    super(options);
    this.bufsize = 128;
    this.sr = 44100;
    this.audiobufs = [[],[]];
    
    var WAM = AudioWorkletGlobalScope.WAM;

    // -- construction C function wrappers
    var wam_ctor = WAM.cwrap("createModule", 'number', []);
    var wam_init = WAM.cwrap("wam_init", null, ['number','number','number','string']);
    
    // -- runtime C function wrappers
    this.wam_terminate = WAM.cwrap("wam_terminate", null, ['number']);
    this.wam_onmidi = WAM.cwrap("wam_onmidi", null, ['number','number','number','number']);
    this.wam_onpatch = WAM.cwrap("wam_onpatch", null, ['number','number','number']);
    this.wam_onprocess = WAM.cwrap("wam_onprocess", 'number', ['number','number','number']);
    this.wam_onparam = WAM.cwrap("wam_onparam", null, ['number','number','number']);
    this.wam_onsysex = WAM.cwrap("wam_onsysex", null, ['number','number','number']);    
    this.wam_onmessageN = WAM.cwrap("wam_onmessageN", null, ['number','string','string','number']);
    this.wam_onmessageS = WAM.cwrap("wam_onmessageS", null, ['number','string','string','string']);

    this.inst = wam_ctor();
    var desc  = wam_init(this.inst, this.bufsize, this.sr, "");

    this.numInputs  = 0;
    this.numOutputs = 1;
    var ibufsx = WAM._malloc(this.numInputs);
    var obufsx = WAM._malloc(this.numOutputs);
    this.audiobus = WAM._malloc(2*4);
    WAM.setValue(this.audiobus,   ibufsx, 'i32');
    WAM.setValue(this.audiobus+4, obufsx, 'i32');

    for (var i=0; i<this.numInputs; i++) {
      var buf = WAM._malloc( this.bufsize*4 );
      WAM.setValue(ibufsx + i*4, buf, 'i32');
      this.audiobufs[0].push(buf/4);
    }
    for (var i=0; i<this.numOutputs; i++) {
      var buf = WAM._malloc( this.bufsize*4 );
      WAM.setValue(obufsx + i*4, buf, 'i32');
      this.audiobufs[1].push(buf/4);
    }
  }
  
  onmidi (status, data1, data2) {
    this.wam_onmidi(this.inst, status, data1, data2);
  }
  
  onpatch (data) {
    var WAM = AudioWorkletGlobalScope.WAM;
    var buf = WAM._malloc(data.length);
    for (var i = 0; i < data.length; i++)
      WAM.setValue(buf+i, data[i], 'i8');
    this.wam_onpatch(this.inst, buf, data.length);
    WAM._free(buf);
  }
  
  process (inputs,outputs,params) {

    // input is currently reserved for eventhack
    /* for (var i=0; i<this.numInputs; i++) {
      var waain = inputs[i][0];
      var wamin = audiobufs[0][i];
      AudioWorkletGlobalScope.WAM.HEAPF32.set(waain, wamin);
    } */
    
    this.wam_onprocess(this.inst, this.audiobus, 0);
    
    for (var i=0; i<this.numOutputs; i++) {
      var waaout = outputs[i][0];
      var wamout = this.audiobufs[1][i];
      waaout.set(AudioWorkletGlobalScope.WAM.HEAPF32.subarray(wamout, wamout + this.bufsize));
    }
    
    return true;    
  }
  
}

// -- hack to share data between addModule() calls
AudioWorkletGlobalScope.WAMProcessor = WAMProcessor;
