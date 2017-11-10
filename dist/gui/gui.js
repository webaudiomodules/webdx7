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
    var e = [EventType.patch, patch.length].concat(Array.from(patch));
    streamer.addEvent(e);
  }
  
  // -- midi keyboard
  var velo = 80;
  var midikeys = new QwertyHancock({
    container: document.getElementById("keys"), width: this.width, height: 60, margin:0,
    octaves: 6, startNote: 'C2', oct:4,
    whiteNotesColour: 'white', blackNotesColour: 'black', activeColour:'orange'
    });
  midikeys.keyDown = (note, name) => onMIDI({ data:[0x90, note, velo] });
  midikeys.keyUp   = (note, name) => onMIDI({ data:[0x80, note, velo] });    
}
