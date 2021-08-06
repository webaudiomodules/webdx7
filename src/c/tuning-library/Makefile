# YOU DO NOT NEED TO USE THIS MAKEFILE TO USE THIS LIBRARY
#
# Tunings is a header-only library. This Makefile is just used
# to build tests and the standalone utilities
#

ifeq ($(OS),Windows_NT)
	CC = g++
	CCFLAGS = -Wall -Werror -std=c++14 -Iinclude -Ilibs/catch2
	BLD = build/windows
else
	UNAME_S := $(shell uname -s)
	ifeq ($(UNAME_S),Linux)
		CC = g++
		CCFLAGS = -Wall -Werror -std=c++14 -Iinclude -Ilibs/catch2
		BLD = build/linux
	endif
	ifeq ($(UNAME_S),Darwin)
		CC = clang++
		CCFLAGS = -Wall -Werror -std=c++14 -Iinclude -Ilibs/catch2
		BLD = build/macos
	endif
endif

TUNING=include/Tunings.h include/TuningsImpl.h

all:	$(BLD)/alltests $(BLD)/showmapping $(BLD)/symbolcheck

runtests:	all
	@$(BLD)/symbolcheck

	@$(BLD)/alltests

	@LANG=`locale -a | grep es_ES | grep -v "\." | head -1` $(BLD)/alltests
	@LANG=`locale -a | grep fr_FR | grep -v "\." | head -1` $(BLD)/alltests
	@LANG=`locale -a | grep ja_JP | head -1` $(BLD)/alltests
	@LANG=`locale -a | grep zh_CN | head -1` $(BLD)/alltests
	@LANG=`locale -a | grep MAKE_SURE_NULL_IS_OK | grep -v "\." | head -1` $(BLD)/alltests	

$(BLD)/symbolcheck:	tests/symbolcheck1.cpp tests/symbolcheck2.cpp $(TUNING) $(BLD)
	@echo If this build fails, you forgot an inline
	$(CC) $(CCFLAGS) -c tests/symbolcheck1.cpp -o $(BLD)/symbolcheck1.o
	$(CC) $(CCFLAGS) -c tests/symbolcheck2.cpp -o $(BLD)/symbolcheck2.o
	$(CC) $(CCFLAGS) $(BLD)/symbolcheck1.o $(BLD)/symbolcheck2.o -o $(BLD)/symbolcheck

$(BLD)/alltests:	tests/alltests.cpp $(TUNING) $(BLD)
	$(CC) $(CCFLAGS) $< -o $@

$(BLD)/alltests_cov:	tests/alltests.cpp $(TUNING) $(BLD)
	$(CC) $(CCFLAGS) --coverage $< -o $@

$(BLD)/showmapping: commands/showmapping.cpp $(TUNING) $(BLD)
	$(CC) $(CCFLAGS) $< -o $@

$(BLD):
	mkdir -p $(BLD)

clean:
	rm -rf build

coverage:	$(BLD)/alltests_cov
	$(BLD)/alltests_cov
	mkdir -p $(BLD)/coverage
	mv alltests* $(BLD)/coverage
	cd $(BLD)/coverage && gcov alltests.gcna
