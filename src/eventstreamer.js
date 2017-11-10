var EventType = { midi:1, patch:2 }

var EventStreamer = function (actx)
{
  var spnEvents = [];
  var eventbuf  = [];
  var spn = actx.createScriptProcessor(256, 0,1);
  
  this.connect = dst => {
    spn.connect(dst);
    spn.onaudioprocess = streamEvents;
  }
  
  this.disconnect = () => {
    spn.onaudioprocess = null;
    spn.disconnect();
  }

  this.addEvent = e => {
    eventbuf = eventbuf.concat(e);
  }
  
  function streamEvents(e) {
    var out = e.outputBuffer.getChannelData(0);
    out.fill(0);

    if (eventbuf.length > 0) {
      var end = eventbuf.length > 256 ? 256 : undefined;
      var slice = eventbuf.slice(0,end);
      out.set(slice);
      if (end) eventbuf.splice(end);
      else eventbuf = [];
    }
  }
}
