$(function(){

	// Start timer
	var startTime = new Date;

	var data = {
    	scroll_depth: "",
    	scroll_velocity: "",
    	time_on_page: ""
	}

	/*
     * Throttle function borrowed from:
     * Underscore.js 1.5.2
     * http://underscorejs.org
     * (c) 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
     * Underscore may be freely distributed under the MIT license.
     */

    function throttle(func, wait) {
      var context, args, result;
      var timeout = null;
      var previous = 0;
      var later = function() {
        previous = new Date;
        timeout = null;
        result = func.apply(context, args);
      };
      return function() {
        var now = new Date;
        if (!previous) previous = now;
        var remaining = wait - (now - previous);
        context = this;
        args = arguments;
        if (remaining <= 0) {
          clearTimeout(timeout);
          timeout = null;
          previous = now;
          result = func.apply(context, args);
        } else if (!timeout) {
          timeout = setTimeout(later, remaining);
        }
        return result;
      };
    }

    // Scroll Event
    $(window).on('scroll', throttle(function() {

    	var scrollStartTime = new Date;

    	var docHeight = $(document).height();
    	
    	//var winHeight = window.innerHeight ? window.innerHeight : $(window).height();
    	//var scrollDistance = $(window).scrollTop() + winHeight;
    	
    	var scrollDistance = $(window).scrollTop();

    	var timing = Math.floor((new Date - startTime) * 0.001);
    	var timingSeconds = timing.toString() + "s";

    	var percentage = Math.floor((scrollDistance / docHeight) * 100);
        var percetageString = percentage.toString() + "%";

        //window.velocity = 0;
        var d1 = scrollDistance;
        
        setInterval(function(){ 
            var d2 = $(window).scrollTop();
            window.velocity = d2 - d1;
            //console.log("V:  " + velocity)

        }, 1000);

        
        console.log("Percentage: " + percetageString)
        console.log("docHeight: " + docHeight.toString() + "px")
        console.log("scrollDistance: " + scrollDistance.toString() + "px");
        console.log("timing: "+ timingSeconds);
        //console.log("Scroll Velocity: " + scrollDistance / Math.floor((new Date - scrollStartTime) * 0.001))
        console.log("Velocity: " + window.velocity)
        console.log("----------------------------------------")

        
        //data.scroll_velocity = scrollDistance / Math.floor((new Date - scrollStartTime) * 0.001);
        
        if (window.velocity == undefined) {
            window.velocity = 0;
        }

        data.scroll_depth = percetageString;
        data.scroll_velocity = window.velocity.toString() + "px/s";
        data.time_on_page = timingSeconds;

        // Send data to server
        sendMessage(data);



    }, 500));


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