//
//  dx7.cc
//
//
//  Created by Jari Kleimola on 04/04/15.
//
//

#include "dx7.h"
#include "freqlut.h"
#include "exp2.h"
#include "sin.h"
#include "pitchenv.h"

extern "C" { EMSCRIPTEN_KEEPALIVE void* createModule() { return new DX7(); } }

const char* DX7::init(uint32_t bufsize, uint32_t sr, void* desc)
{
	Freqlut::init(sr);
	Exp2::init();
	Sin::init();
	Lfo::init(sr);
	PitchEnv::init(sr);

	bufsize_ = bufsize;
	outbuf16_ = new int16_t[bufsize];
	synth_unit_ = new SynthUnit(&ring_buffer_);
	return 0;
}

void DX7::terminate()
{
	delete synth_unit_;
	delete [] outbuf16_;
}

void DX7::resize(uint32_t bufsize)
{
	delete [] outbuf16_;
	bufsize_ = bufsize;
	outbuf16_ = new int16_t[bufsize_];
}

void DX7::onMidi(WAM::byte status, WAM::byte data1, WAM::byte data2)
{
	uint8_t msg[3] = { status, data1, data2 };
	ring_buffer_.Write(msg, 3);
}

void DX7::onSysex(WAM::byte* msg, uint32_t size)
{
	if (size == 4104)
		ring_buffer_.Write(msg, 4104);
}

void DX7::onPatch(void* patch, uint32_t size)
{
	synth_unit_->onPatch((WAM::byte*)patch, size);
}

void DX7::onParam(uint32_t idparam, double value)
{
	synth_unit_->onParam(idparam, (char)value);
}

void DX7::onProcess(WAM::AudioBus* audio, void* data)
{
	// mono 16-bit signed ints
	synth_unit_->GetSamples(bufsize_, outbuf16_);

	static const float scaler = 0.00003051757813;
	float* outbuf = audio->outputs[0];
	for (uint32_t n=0; n<bufsize_; n++)
		outbuf[n] = outbuf16_[n] * scaler;
}
