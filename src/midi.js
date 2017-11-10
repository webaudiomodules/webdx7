var midiPort;

function initMidi () {
  let combo = document.querySelector("#midiIn");
  navigator.requestMIDIAccess().then((midiIF) => {
    for (let input of midiIF.inputs.values()) {
      let option = new Option(input.name);
      option.port = input;
      combo.appendChild(option);
    }
    combo.onchange = e => {
      if (midiPort) midiPort.onmidimessage = null;
      midiPort = e.target.options[e.target.selectedIndex].port;
      midiPort.onmidimessage = onMIDI;
    }
    if (combo.options.length > 0)
      combo.onchange({ target:combo });
  })  
}

function onMIDI (msg) {
  var e = [EventType.midi].concat(Array.from(msg.data));
  streamer.addEvent(e);
}
