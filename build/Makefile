# Web Audio Modules
# wasm makefile for msfa DX7

TARGET = ./dx7.js
API = ../../api/src/c
MSFA = ../src/c/msfa

SRC = ../src/c/dx7.cc $(API)/processor.cc \
	$(MSFA)/synth_unit.cc $(MSFA)/ringbuffer.cc $(MSFA)/patch.cc \
	$(MSFA)/lfo.cc $(MSFA)/dx7note.cc $(MSFA)/freqlut.cc $(MSFA)/sin.cc $(MSFA)/exp2.cc \
	$(MSFA)/fm_core.cc $(MSFA)/pitchenv.cc $(MSFA)/env.cc $(MSFA)/fm_op_kernel.cc

EXPORTS = "[\
	'_createModule','_wam_init','_wam_terminate','_wam_resize', \
	'_wam_onprocess', '_wam_onmidi', '_wam_onsysex', '_wam_onparam', \
	'_wam_onmessageN', '_wam_onmessageS', '_wam_onpatch' \
	]"

CFLAGS = -I$(API) -I$(MSFA)
LDFLAGS = -O2 -s EXPORTED_FUNCTIONS=$(EXPORTS)
JSFLAGS = -s ALLOW_MEMORY_GROWTH=1 -s WASM=1 -s EXPORT_NAME="'AudioWorkletGlobalScope.WAM'"

$(TARGET): $(OBJECTS)
	$(CC) $(CFLAGS) $(LDFLAGS) $(JSFLAGS) -o $@ $(SRC)
