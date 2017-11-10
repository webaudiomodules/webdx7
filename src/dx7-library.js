(function(NS) {
NS.Library = function ()
{	
	function reset()
	{
		self.data = null;			// flat array of voicedata, 145 bytes each
		self.patchlist = [];		// patchid,syxid,name,[tagids]
		self.patches = [];
	}
	var self = this;
	self.tags = [];				// tagid,name
	reset();
	
	this.getPatchData = function(id)
	{
		var offset = id * 145;
		return this.data.subarray(offset,offset+145);
	}
	
	this.getPatch = function (id)
	{
		for (var i=0; i<this.patches.length; i++)
			if (this.patches[i].id == id) return this.patches[id];
		return null;
	}
	
	this.sort = function (patches, prop, desc)
	{
		desc = (desc == undefined) ? false : desc;
		var i1 = desc ? -1 : 1;
		var i2 = desc ? 1 : -1;
		
		var strcmp = function (a,b) { return a[prop].localeCompare(b[prop]) * i1; }
		var intcmp = function (a,b)
		{
			if (a[prop] > b[prop]) return i1;
			if (a[prop] < b[prop]) return i2;
			return 0;
		}
		
		if (prop == "name")			patches.sort(strcmp);
		else if (prop == "id")		patches.sort(intcmp);
		else if (prop == "syxid")	patches.sort(intcmp);
	}
	
	this.query = function(tags)
	{
		var result = [];
		if (!Array.isArray(tags)) tags = [tags];
		tags.forEach(function (tag)
		{
			tag = tag.toLowerCase();
			var idtag = self.tags[tag];
			if (idtag >= 0)
				for (var i=0; i<self.patches.length; i++)
				{
					if (self.patches[i].tags.indexOf(idtag) >= 0)
						result.push(self.patches[i]);
				}
		});
		return result;
	}
	
	this.load = function()
	{
		reset();
		return new Promise(function (resolve, reject)
		{
			load("/patches/webdx7/dx7patches.zip","arraybuffer").then( function (bin)
			{
				var zip = new JSZip(bin);
				var keys = Object.keys(zip.files);
				var file = zip.files[keys[0]];
				self.data = new Uint8Array(file.asArrayBuffer());
				
				load("/patches/webdx7/dx7patches.json").then( function (arr1)
				{
					for (var i=0; i<arr1.length; i++)
					{
						var p = arr1[i];
						var d = { id:p[0], syxid:p[1], name:p[2], tags:p[3], };
						self.patchlist.push(d);
						
						var patch = new NS.Patch(self.getPatchData(p[0]), p[0], p[2]);
						patch.tags = p[3];
						self.patches.push(patch);
					}

					load("/patches/webdx7/tags.json").then( function (arr2)
					{
						arr2.forEach(function (t) { self.tags[t[1]] = t[0]});
						resolve(self);
					});				
				});
			});
		});
	}
	
	this.loadSysex = function(url, file)
	{
		function parse(data)
		{
			var length = data.byteLength;
			var id = 0;

			// -- unpacked single voice or bank of 32 voices
			if (length == 163 || length == 4960)
			{
				if (length == 163) { data = data.subarray(6,161); length = 155; }
				var N = length / 155;
				for (var i=0; i<N; i++)
				{
					var offset = i*155;
					var voice  = data.subarray(offset,offset+145);
					var name   = NS.Patch.extractName(data,145);
					var patch  = { id:id++, syxid:0, name:name, data:voice, tags:[] };
					self.patchlist.push(patch);

					var p = new NS.Patch(voice, i, name);
					self.patches.push(p);
				}
			}

			// -- packed bank without sysex frame, with sysex frame, or 45 patches with sysex frame
			else if (length == 4096 || length == 4104 || length == 5760)
			{
				if (length == 4104) { data = data.subarray(6,4102); length = 4096; }
				var N = length / 128;
				for (var i=0; i<N; i++)
				{
					var offset = i*128;
					var packed = data.subarray(offset,offset+128);
					var voice  = NS.Patch.unpack(packed);
					var name   = NS.Patch.extractName(packed);
					var patch  = { id:id++, syxid:0, name:name, data:voice, tags:[] };
					self.patchlist.push(patch);

					var p = new NS.Patch(voice, i, name);
					self.patches.push(p);
				}
			}

			var dataoffset = 0;
			var byteLength = self.patchlist.length * 145;
			self.data = new Uint8Array(byteLength);
			for (var i=0; i<self.patchlist.length; i++)
			{
				self.data.set(self.patchlist[i].data, dataoffset);
				dataoffset += 145;
			}
		}
		
		reset();
		var self = this;
		return new Promise(function (resolve, reject)
		{
			if (file instanceof File)
			{
				var reader = new FileReader();
				reader.onload = function (e)
				{
					var data = new Uint8Array(e.target.result);
					parse(data);
					resolve(self);
				};
				reader.readAsArrayBuffer(file);
			}
			else load(url,"arraybuffer").then( function (data)
			{
				parse(data);
				resolve(self);
			});
		});
	}
	
	function load(url, type)
	{
		type = type || "json";
		return new Promise(function (resolve, reject)
		{
			var xhr = new XMLHttpRequest();
			xhr.responseType = type;
			xhr.onload = function (e)
			{
				if (type == "arraybuffer") resolve(new Uint8Array(xhr.response));
				else resolve(xhr.response);
			}
			xhr.open("get", url, true);
			xhr.send();			
		});
	}
}
}(WAM.Synths.webDX7));