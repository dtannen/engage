$(function(){


  var _gaq = {};

  var _data = {
    scroll_depth: "",
    scroll_velocity: "",
    time_on_page: ""
  }

  _gaq.push = function(data) {
    console.log("_gaq.push(" + JSON.stringify(data) + ");");
  };

  var dataLayer = {};
  dataLayer.push = function(data) {
    console.log("dataLayer.push(" + JSON.stringify(data) + ");");
  };

  var ga = function(params) {
    var args = Array.prototype.slice.call(arguments, 1);
    console.log("ga(" + args.join(',') + ");");
  };

  _gaq = undefined;
  dataLayer = undefined;
  ga = undefined;
  $.scrollDepth({
    elements: ['#section1', '#section2', '#section3', '#section4', '#section5', '#section6', 'footer'],
    userTiming: true,
    eventHandler: function(data) {
      /*
      console.log("Event: " + data.event);
      console.log("Event action: " + data.eventAction);
      console.log("Event category: " + data.eventCategory);
      console.log("Event label: " + data.eventLabel);
      console.log("Event value: " + data.eventValue);
      console.log("Event timing: " + data.eventTiming);
      */

      
      tmpScrollDepthPercentage = getPixelDepthPercentage(data);
      if (tmpScrollDepthPercentage != undefined) {
        _data.scroll_depth = tmpScrollDepthPercentage;
      }

      scrollDepth = getPixelDepth(data);

      tmpTimeOnPage = getTimeOnPage(data);
      if (tmpTimeOnPage != undefined) {
        _data.time_on_page = tmpTimeOnPage;
      }

     
      if (((scrollDepth != undefined) && (_data.scroll_depth != "")) && (_data.time_on_page != undefined)) {
        var _pixelDepth = parseInt(scrollDepth);
        
        _data.scroll_velocity = getPixelVelocity(_pixelDepth, _data.time_on_page)

        if (_data.scroll_velocity == "Infinity") {
          _data.scroll_velocity = NaN
        }


        sendMessage(_data);

        //console.log(_data)
        //console.log("Scroll velocity formula:  velocity = pixelDepth / timeOnPage | " + _data.scroll_velocity + " = " + _pixelDepth + " / " + _data.time_on_page)

        //console.log("----------------------------------------------------------------------------------");

        _data.scroll_depth = "";
        _data.scroll_velocity = "";
        _data.time_on_page = "";
      }
      
      //console.log(_data)

      /*
        “data”: {
          “scroll_depth”: %
          “scroll_velocity”: px/s
          “time_on_page”: seconds
        }
      */



      //console.log(data);
    }
  });

  function getPixelDepth(data) {
    if ((data.event == "ScrollDistance") && (data.eventAction == "Pixel Depth")) {
      var pixelDepth = data.eventLabel;

      return pixelDepth;
    }
  }

  function getPixelDepthPercentage(data) {
    if ((data.event == "ScrollDistance") && (data.eventAction == "Percentage")) {
      var pixelDepth = data.eventLabel;

      return pixelDepth.toString();
    }
  }

  function getPixelVelocity(pixelDepth, timing) {
      var pixelVelocity = pixelDepth / timing;

      return parseFloat(pixelVelocity.toFixed(2)).toString();
  }

  function getTimeOnPage(data) {
    if (data.event == "ScrollTiming") {
      var timeOnPage = data.eventTiming * 0.001

      return timeOnPage.toString();
    }
  }





  // Web socket

  var sock = null;
  var wsuri = "ws://127.0.0.1:8000/api/data";


  sock = new WebSocket(wsuri);

  sock.onopen = function() {
    console.log("connected to " + wsuri);
  }

  sock.onclose = function(e) {
    console.log("connection closed (" + e.code + ")");
  }

  sock.onmessage = function(e) {
    console.log("message received: " + e.data);
  }
  

  function sendMessage(msg) {
    sock.send(JSON.stringify(msg));
  };

});