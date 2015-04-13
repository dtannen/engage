$(function(){


  var _gaq = {};

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
      
      console.log("Event: " + data.event);
      console.log("Event action: " + data.eventAction);
      console.log("Event category: " + data.eventCategory);
      console.log("Event label: " + data.eventLabel);
      console.log("Event value: " + data.eventValue);
      console.log("Event timing: " + data.eventTiming);
      
      console.log(data);
    }
  });

});