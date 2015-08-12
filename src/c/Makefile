# Web Audio Modules
# emscripten makefile for msfa DX7

TARGET = ./dx7-asm.js
API = ../../api

SRC = dx7.cc $(API)/processor.cc \
	msfa/synth_unit.cc msfa/ringbuffer.cc msfa/patch.cc \
	msfa/lfo.cc msfa/dx7note.cc msfa/freqlut.cc msfa/sin.cc msfa/exp2.cc \
	msfa/fm_core.cc msfa/pitchenv.cc msfa/env.cc msfa/fm_op_kernel.cc

EXPORTS = "[\
	'_createModule','_wam_init','_wam_terminate','_wam_resize', \
	'_wam_onprocess', '_wam_onmidi', '_wam_onsysex', '_wam_onparam', \
	'_wam_onmessageN', '_wam_onmessageS', '_wam_onpatch' \
	]"

CFLAGS = -I$(API) -I./msfa
LDFLAGS = -O2 --memory-init-file 0 -s NO_FILESYSTEM=1 -s EXPORTED_FUNCTIONS=$(EXPORTS)
JSFLAGS = --pre-js pre.js --post-js post.js -s EXPORT_NAME="'WAMModule'"

$(TARGET): $(OBJECTS)
	$(CC) $(CFLAGS) $(LDFLAGS) $(JSFLAGS) -o $@ $(SRC)
