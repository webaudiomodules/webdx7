function initGUI (lib) {
  
  // -- populate comboboxes
  var inited  = false;
  var banks   = document.getElementById("banks");
  var patches = document.getElementById("patches");
  lib.banks.forEach( name => { banks.appendChild(new Option(name)); });

  // -- change bank
  banks.onchange = function (e) {
    lib.load(e.target.value).then(bank => {
      patches.innerHTML = "";
      bank.forEach( name => { patches.appendChild(new Option(name)); });
      if (!inited) { inited = true; patches.selectedIndex = 10; }
      else patches.onchange({ target:patches });
    })
  }
  banks.onchange({ target:banks });

  // -- change patch
  patches.onchange = function (e) {
    var patch = lib.bank[e.target.selectedIndex];
    dx7.setPatch(patch);
  }
  
  // -- midi keyboard
  var velo = 80;
  var midikeys = new QwertyHancock({
    container: document.getElementById("keys"), width: this.width, height: 60, margin:0,
    octaves: 6, startNote: 'C2', oct:4,
    whiteNotesColour: 'white', blackNotesColour: 'black', activeColour:'orange'
    });
  midikeys.keyDown = (note, name) => dx7.onMidi([0x90, note, velo]);
  midikeys.keyUp   = (note, name) => dx7.onMidi([0x80, note, velo]);
}

function initMidi () {
  let combo = document.querySelector("#midiIn");
  navigator.requestMIDIAccess().then((midiIF) => {
    for (let input of midiIF.inputs.values()) {
      let option = new Option(input.name);
      option.port = input;
      combo.appendChild(option);
    }
    combo.onchange = e => {
      dx7.midiIn = e.target.options[e.target.selectedIndex].port;
    }
    if (combo.options.length > 0)
      combo.onchange({ target:combo });
  })
}
