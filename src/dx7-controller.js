// ----------------------------------------------------------------------------
// controller
//
WAM.Synths.webDX7 = function ()
{
	var self = this;
	
	this.init = function (actx, bufsize)
	{
		return new Promise(function (resolve, reject)
		{
			var processor = new WAM.ProcessorASMJS(WAM.Synths.webDX7, "Module");		
			var desc = { audio: { outputs: [{ id:0, channels:1 }] } };
			self.setup(actx, bufsize, desc, processor).then(function ()
			{
				resolve(self);
			});
		});
	}
	
	this.getPatchNames = function ()
	{
		var names = [];
		var offset = 6;
		if (this.bank) for (var i = 0; i < 32; i++)
		{
			var patch = this.bank.subarray(offset, offset+128);
			var name = (i < 9) ? "P-0" : "P-";
			name += (i+1) + "&nbsp;&nbsp;";
			for (var n = 0; n < 10; n++)
			{
				var c = patch[n + 118];
				switch (c) {
					case  92:  c = 'Y';  break;  // yen
					case 126:  c = '>';  break;  // >>
					case 127:  c = '<';  break;  // <<
					default: if (c < 32 || c > 127) c = 32; break;
				}
				name += String.fromCharCode(c);
			}
			names.push(name);
			offset += 128;
		}
		return names;
	}
}
WAM.Synths.webDX7.prototype = new WAM.Controller("sync");
