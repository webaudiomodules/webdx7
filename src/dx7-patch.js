(function(NS) {
NS.Patch = function (data, id, name)
{
	this.data = data || new Array(144);
	this.id = id || 0;
	this.name = name || ""; // this.getName(data);
	
	if (data)
	{
		var sortfix = this.id * 0.00001;	
		this.algorithm = WAM.utils.clamp(data[134], 0, 31);	// 110 for packed
		this.sustain = this.getSustain() + sortfix;
		this.speed = this.getSpeed() + sortfix;
		this.duration = this.getDuration() + sortfix;
	}
	else this.algorithm = this.sustain = this.speed = this.duration = 0;
}

NS.Patch.prototype =
{
	getName: function (data, offset)
	{
		data = data || this.data;
		var name  = "";
		var offset = offset || 118;	// 118 for packed
		for (var n = 0; n < 10; n++)
		{
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
	},
	
	getCarriers: function ()
	{
		return NS.Patch.algorithms.carriers[this.algorithm];
	},

	// -- fastest attack
	getSpeed: function ()
	{
		var maxrate = 0;
		var level = 0;
		var clamp = WAM.utils.clamp;
		var carriers = this.getCarriers();

		carriers.forEach(function (op)
		{
			var offset = (6-op) * 21;	// 17 for packed
			var R1 = clamp(this.data[offset], 0,99);
			var L1 = clamp(this.data[offset + 4], 0,99);
			if (R1 >= maxrate)
			{
				maxrate = R1;
				level = L1;
			}
		}, this);
		var speed = 100 - maxrate;
		return speed;
	},

	// -- arbitrary scale
	getSustain: function ()
	{
		var sus = 0;
		var clamp = WAM.utils.clamp;
		var carriers = this.getCarriers();
		carriers.forEach(function (op)
		{
			var offset = (6-op) * 21;	// 17 for packed
			var L = 2*clamp(this.data[offset + 6], 0,99);	// L3
			L += clamp(this.data[offset + 16], 0,99);			// outlevel, 14 for packed
			sus += L;
		}, this);
		sus /= carriers.length;
		return sus;
	},
	
	// -- arbitrary scale
	getDuration: function ()
	{
		var maxdur = -1;
		var clamp = WAM.utils.clamp;
		var carriers = this.getCarriers();
		for (var c=0; c<carriers.length; c++)
		{
			var op = carriers[c];
			var offset = (6-op) * 21;	// 17 for packed

			var L3 = clamp(this.data[offset + 6], 0,99);
			if (L3 != 0) { maxdur = 1000; break; }
			
			var d  = 0;
			var s1 = 7;
			var s2 = 4;
			for (var i=0; i<3; i++)
			{
				var r  = clamp(this.data[offset+i],  0,99)
				var l1 = clamp(this.data[offset+s1], 0,99)
				var l2 = clamp(this.data[offset+s2], 0,99)
				d += this.getStageDuration(r,l1,l2);
				s1 = s2;
				s2++;
			}
			if (d > maxdur) maxdur = d;
		}
		return maxdur;
	},
	
	// -- exp and polynomial approximations based on Hexter's LUTs
	// -- Hexter's LUTs are also approximations, but the accuracy should be ok for this
	getStageDuration: function (r,l1,l2)
	{
		function scaleU(y) { return y*(y*(y*( 6E-8*y - 6E-6) + 0.0002) + 0.0041) - 0.0037; }
		function scaleD(y) { return y*(y*(y*(-2E-8*y + 6E-6) - 0.0005) + 0.0242) + 6E-05; }
		
		if (l2 > l1)
		{
			var dur = 44.651 * Math.exp(-0.11*r);
			return dur * (scaleU(l2) - scaleU(l1));
		}
		else
		{
			var dur = 367.8 * Math.exp(-0.111*r);
			return dur * (scaleD(l1) - scaleD(l2));
		}
	}
};

// -- WIP
NS.Patch.algorithms = 
{
	carriers:
	[ [1,3], [1,3], [1,4], [1,4], [1,3,5], [1,3,5], [1,3], [1,3],
	  [1,3], [1,4], [1,4], [1,3], [1,3], [1,3], [1,3], [1],
	  [1], [1], [1,4,5], [1,2,4], [1,2,4,5], [1,3,4,5], [1,2,4,5],
	  [1,2,3,4,5], [1,2,3,4,5], [1,2,4], [1,2,4], [1,3,6],
	  [1,2,3,5], [1,2,3,6], [1,2,3,4,5], [1,2,3,4,5,6]
	],
	graphs:
	[
		[[1,2],[3,4],[4,5],[5,6]],
	],
	feedbacks:
	[ [6] ]
}

NS.Patch.extractName = function(data,offset)
{
	var offset = offset || 118;	// 118 for packed, 145 for unpacked
	var name  = "";
	for (var n = 0; n < 10; n++)
	{
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

/**
 * Unpacks a patch into a parameter array.
 *
 * @param  {Array} patch 128 bytes (eg. single entry in 32 patch bank)
 * @return {Array}       144 bytes (single voice parameters, sans name)
 *
 * @see  http://homepages.abdn.ac.uk/mth192/pages/dx7/sysex-format.txt
 */
NS.Patch.unpack = function(patch)
{
	var m = new Uint8Array(145);
	var op, b, c, i;
	var clamp = WAM.utils.clamp;

	// operators
	for (op = 6; op >= 0; op--) {
		b = (6-op) * 17;
		c = (6-op) * 21;

		for (i = 0; i < 8; i++) {
			m[c+i] = clamp(patch[b+i], 0, 99);						// eg
		}

		m[c+8]  = clamp(patch[b+8], 0, 99);							// keyscale breakpoint
		m[c+9]  = clamp(patch[b+9], 0, 99);							// keyscale left depth
		m[c+10] = clamp(patch[b+10], 0, 99);						// keyscale rite depth
		m[c+11] = clamp(patch[b+11] & 3, 0, 3);					// keyscale left curve
		m[c+12] = clamp((patch[b+11] >> 2) & 3, 0, 3);			// keyscale rite curve		
		m[c+13] = clamp(patch[b+12] & 7, 0, 7);					// osc rate scale
		
		m[c+14] = clamp(patch[b+13] & 3, 0, 3);					// am sens
		m[c+15] = clamp((patch[b+13] >> 2) & 7, 0, 7);			// key velocity sens
		m[c+16] = clamp(patch[b+14], 0, 99);						// op level
		m[c+17] = clamp(patch[b+15] & 1, 0, 1);					// op mode
		m[c+18] = clamp((patch[b+15] >> 1) & 0x1F, 0, 31);		// freq coarse
		m[c+19] = clamp(patch[b+16], 0, 99);						// freq fine
		m[c+20] = clamp((patch[b+12] >> 3) & 15, 0, 14) - 7;	// detune
	}

	// globals
	b = 102;
	for (i = 0; i < 8; i++)
		m[126+i] = clamp(patch[b+i], 0, 99);			// pitch eg
	m[134] = clamp(patch[b+8], 0, 31);					// algorithm
	m[135] = clamp(patch[b+9] & 7, 0, 7);				// feedback
	m[136] = clamp((patch[b+9] >> 3) & 1, 0, 1);		// key sync
	m[137] = clamp(patch[b+10], 0, 99);					// lfo speed
	m[138] = clamp(patch[b+11], 0, 99);					// lfo delay
	m[139] = clamp(patch[b+12], 0, 99);					// lfo pm depth
	m[140] = clamp(patch[b+13], 0, 99);					// lfo am depth
	m[141] = clamp(patch[b+14] & 1, 0, 1);				// lfo key sync
	m[142] = clamp((patch[b+14] >> 1) & 7, 0, 5);	// lfo wave
	m[143] = clamp((patch[b+14] >> 5) & 7, 0, 7);	// pm sense
	m[144] = clamp(patch[b+15], 0, 48);					// transpose

	return m;
};
}(WAM.Synths.webDX7));
