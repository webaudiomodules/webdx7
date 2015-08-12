//
//  dx7.h
//  
//
//  Created by Jari Kleimola on 04/04/15.
//
//

#ifndef _dx7_
#define _dx7_

#include "processor.h"
#include "msfa/synth.h"
#include "msfa/synth_unit.h"
#include "msfa/ringbuffer.h"

class DX7 : public Processor
{
public:
	virtual const char* init(uint32_t bufsize, uint32_t sr, void* desc);
	virtual void terminate();
	virtual void resize(uint32_t bufsize);
	virtual void onProcess(AudioBus* audio, void* data);
	virtual void onMidi(byte status, byte data1, byte data2);
	virtual void onSysex(byte* msg, uint32_t size);
	virtual void onPatch(void* patch, uint32_t size);
	virtual void onParam(uint32_t idparam, double value);
private:
	RingBuffer ring_buffer_;
	SynthUnit *synth_unit_;
	int16_t* outbuf16_;
	uint32_t bufsize_;
};

#endif
