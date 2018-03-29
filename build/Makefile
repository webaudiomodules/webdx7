# Web Audio Modules
# wasm makefile for msfa DX7

TARGET = ./dx7.js
API = ../src/wamsdk
MSFA = ../src/c/msfa

SRC = ../src/c/dx7.cc $(API)/processor.cpp \
	$(MSFA)/synth_unit.cc $(MSFA)/ringbuffer.cc $(MSFA)/patch.cc \
	$(MSFA)/lfo.cc $(MSFA)/dx7note.cc $(MSFA)/freqlut.cc $(MSFA)/sin.cc $(MSFA)/exp2.cc \
	$(MSFA)/fm_core.cc $(MSFA)/pitchenv.cc $(MSFA)/env.cc $(MSFA)/fm_op_kernel.cc

CFLAGS = -I$(API) -I$(MSFA) -Wno-logical-op-parentheses
LDFLAGS = -O2
JSFLAGS = -s ALLOW_MEMORY_GROWTH=1 -s WASM=1 -s BINARYEN_ASYNC_COMPILATION=0 -s EXPORT_NAME="'AudioWorkletGlobalScope.WAM.DX7'"

$(TARGET): $(OBJECTS)
	$(CC) $(CFLAGS) $(LDFLAGS) $(JSFLAGS) -o $@ $(SRC)
