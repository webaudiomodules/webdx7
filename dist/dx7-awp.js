// eventhack: events are fetched from an upstream SPN node
// this will naturally become obsolete with AWP.MessagePort
// in general, WAMS do not require any custom AWP code

class DX7AWP extends AudioWorkletGlobalScope.WAMProcessor
{
  constructor(options) {
    super(options);
    this.eventStream = new EventStream();
  }

  processEvents (events) {
    events.forEach( function (e) {
      switch (e[0]) {
        case 1: this.onmidi(e[1],e[2],e[3]); break;
        case 2: this.onpatch(e.slice(1)); break;
      }
    }.bind(this));
  }
  
  process(inputs,outputs,params) {
    var events = this.eventStream.parse( inputs[0][0] );
    if (events.length > 0)
      this.processEvents(events);

    return super.process(inputs, outputs, params);    
  }
}

registerProcessor("DX7", DX7AWP);


// ----------------------------------------------------------------------------
// hack to get events in before MessagePort arrives
//
var EventStream = function ()
{
  var events = [];
  var event  = [];
  var argsToFetch = 0;

  function parseMidi (s,i) {
    while (i < s.length && argsToFetch > 0) {
      event.push(s[i++]);
      argsToFetch--;
    }
    if (argsToFetch == 0) {
      events.push(event);
      event = [];
    }
  }

  function parsePatch (s,i) {
    while (i < s.length && argsToFetch > 0) {
      event.push(s[i++]);
      argsToFetch--;
    }
    if (argsToFetch == 0) {
      events.push(event);
      event = [];
      return s.length;
    }
    return 128;
  }
  
  function parsePendingEvent (s) {
    var argsFetched = argsToFetch;
    switch (event[0]) {
      case 1: parseMidi(s,0);  break;
      case 2: parsePatch(s,0); break;
    }
    return argsFetched;
  }
  
  this.parse = function (stream) {
    events = [];
    var i = 0;
    
    // -- pending event
    if (argsToFetch != 0)
      i = parsePendingEvent(stream);      
    
    // -- fetch new events
    while (i < stream.length) {
      var type = stream[i];
      if (type != 0) {
        event = [];
        event.push(type)
        switch (type) {
          case 1:
            argsToFetch = 3;
            parseMidi(stream, i+1);
            i += 3;
            break;
          case 2:
            argsToFetch = stream[i+1];
            i = parsePatch(stream, i+2);
            break;
        }
      }
      i++;
    }
    return events;
  }
}
