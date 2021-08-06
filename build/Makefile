# Web Audio Modules
# wasm makefile for msfa DX7

TARGET = ./dx7.js
API = ../src/wamsdk
MSFA = ../src/c/msfa

SRC = ../src/c/dx7.cc $(API)/processor.cpp \
	$(MSFA)/synth_unit.cc $(MSFA)/ringbuffer.cc $(MSFA)/patch.cc \
	$(MSFA)/lfo.cc $(MSFA)/dx7note.cc $(MSFA)/freqlut.cc $(MSFA)/sin.cc $(MSFA)/exp2.cc \
	$(MSFA)/fm_core.cc $(MSFA)/pitchenv.cc $(MSFA)/env.cc $(MSFA)/fm_op_kernel.cc $(MSFA)/tuning.cc

CFLAGS = -I$(API) -I$(MSFA) -Wno-logical-op-parentheses
LDFLAGS = -O2
JSFLAGS = -s ALLOW_MEMORY_GROWTH=1 -s WASM=1 -s BINARYEN_ASYNC_COMPILATION=0 -s EXPORT_NAME="'AudioWorkletGlobalScope_WAM_DX7'" -s "EXPORTED_RUNTIME_METHODS=['ccall', 'cwrap', 'setValue']" -s "EXPORTED_FUNCTIONS=['_malloc', '_free']" -s EMULATE_FUNCTION_POINTER_CASTS=1

# DEBUGFLAGS = -g4 --source-map-base "http://localhost:8080/path/to/location/with/wasm/sourcemap/"

$(TARGET): $(OBJECTS)
	$(CC) $(CFLAGS) $(LDFLAGS) $(JSFLAGS) -o $@ $(SRC)
	# emmake complains about `.` characters in the `EXPORT_NAME`, so we add them manually...
	sed -i 's/AudioWorkletGlobalScope_WAM_DX7/AudioWorkletGlobalScope\.WAM\.DX7/g' $(TARGET)
	node encode-wasm.js dx7.wasm

dist:
	cp dx7.js ../dist/dx7/wasm/
	cp dx7.wasm.js ../dist/dx7/wasm/
