class DX7AWP extends AudioWorkletGlobalScope.WAMProcessor
{
  constructor(options) { super(options); }
}

registerProcessor("DX7", DX7AWP);
