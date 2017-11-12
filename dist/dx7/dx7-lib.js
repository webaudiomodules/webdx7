// bank and patch handling

var DX7Library = function ()
{
  this.banks = banklist;
  this.patches = [];
  this.bank = [];
  var self = this;
  
  this.load = filename => {
    var url = "dx7/presets/" + filename;
    return new Promise( (resolve,reject) => {
      fetch(url).then(resp => {
      resp.arrayBuffer().then(data => {

        // -- packed bank with sysex frame (32 patches)
        if (data.byteLength != 4104) reject();
        self.patches = [];
        self.bank = [];
        data = new Uint8Array(data);
        data = data.subarray(6,4102);
        for (var i=0; i<32; i++) {
          var offset = i*128;
          var voice  = data.subarray(offset,offset+128);
          var name   = extractName(voice);
          self.patches.push(name);
          self.bank.push(voice);
        }
        resolve(self.patches);
      }) }) });
  }
  
  function extractName (data,offset) {
    var offset = offset || 118;	// 118 for packed, 145 for unpacked
    var name  = "";
    for (var n = 0; n < 10; n++) {
      var c = data[n + offset];
      switch (c) {
        case  92:  c = 'Y';  break;  // yen
        case 126:  c = '>';  break;  // >>
        case 127:  c = '<';  break;  // <<
        default: if (c < 32 || c > 127) c = 32; break;
      }
    name += String.fromCharCode(c);
    }
    return name;
  }
}

var banklist = [
  "rom1A.syx",
  "steinber.syx",
  "SynprezFM_03.syx",
  "weird1.syx",
  "solange2.syx",
  "analog1.syx",
  "Dexed_01.syx"
];
