$(function(){

	// Start timer
    var started = false;
    var stopped = false;
    var clockTime = 0;
    var startTime = new Date();
    var clockTimer = null;
    var idleTimer = null;
    var reportInterval = 5;
    var idleTimeout = 30;

	var data = {
    	scroll_depth: 0,
    	scroll_velocity: 0,
    	time_on_page: 0,
      dwell_time: 0
	}


    // Basic activity event listeners
    addListener(document, 'keydown', trigger);
    addListener(document, 'click', trigger);
    addListener(window, 'mousemove', throttle(trigger, 500));
    addListener(window, 'scroll', throttle(trigger, 500));

    // Page visibility listeners
    addListener(document, 'visibilitychange', visibilityChange);
    addListener(document, 'webkitvisibilitychange', visibilityChange);
    

    /*
     * Cross-browser event listening
     */

    function addListener(element, eventName, handler) {
      if (element.addEventListener) {
        element.addEventListener(eventName, handler, false);
      }
      else if (element.attachEvent) {
        element.attachEvent('on' + eventName, handler);
      }
      else {
        element['on' + eventName] = handler;
      }
    }

    function setIdle() {
      clearTimeout(idleTimer);
      stopClock();
    }

    function visibilityChange() {
      if (document.hidden || document.webkitHidden) {
        setIdle();
      }
    }

    function clock() {
      clockTime += 1;
      if (clockTime > 0 && (clockTime % reportInterval === 0)) {
        // Set dwellTime here if want to count intervals of 5 seconds
        // window.dwellTime = clockTime;
      }
      window.dwellTime = clockTime;
    }

    function stopClock() {
      stopped = true;
      clearTimeout(clockTimer);
    }


    function restartClock() {
      stopped = false;
      clearTimeout(clockTimer);
      clockTimer = setInterval(clock, 1000);
    }

    function startTimer() {

      // Calculate seconds from start to first interaction
      var currentTime = new Date();
      var diff = currentTime - startTime;

      // Set global
      started = true;

      // Start clock
      clockTimer = setInterval(clock, 1000);

    }

    function trigger() {

      if (!started) {
        startTimer();
      }

      if (stopped) {
        restartClock();
      }

      clearTimeout(idleTimer);
      idleTimer = setTimeout(setIdle, idleTimeout * 1000 + 100);
    }


    startTimer();

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

    	//var scrollStartTime = new Date;

    	
    	
    	var winHeight = window.innerHeight ? window.innerHeight : $(window).height();
    	var scrollDistance = $(window).scrollTop() + winHeight;

      //var winHeight = window.innerHeight ? window.innerHeight : $(window).height();
      //var scrollDistance2 = $(window).scrollTop() + winHeight;
      //console.log("Scroll distance 2: " + scrollDistance2)
      //var percentage2 = Math.floor((scrollDistance2 / docHeight) * 100);
      //console.log("Percetage 2: " + percentage2)
      /*
    	var docHeight = $(document).height();
    	var scrollDistance = $(document).scrollTop();
      var scrollDistance2 = $(window).scrollTop();
      */
      /*
      console.log("Document Scroll distance : " + scrollDistance)
      console.log("Window Scroll distance : " + scrollDistance2)
      console.log("docHeight : " + docHeight)
      console.log("Inner height: " + $(document).innerHeight())
      console.log("PageYOffset: " + window.pageYOffset)
      console.log("Scroll distance 3 : " + scrollDistance3)
      */

      var docHeight = $(document).height();
    	var percentage = Math.floor((scrollDistance / docHeight) * 100);
      var percetageString = percentage.toString();

      var d1 = scrollDistance;
        
      setInterval(function(){ 
        var d2 = $(window).scrollTop();
        window.velocity = Math.abs(d2 - d1);
      }, 1000);


      if (window.velocity == undefined) {
        window.velocity = 0;
      }

      if (window.dwellTime == undefined) {
        window.dwellTime = 0;
      }

      data.scroll_depth = percentage;
      data.scroll_velocity = Math.floor(window.velocity);
      data.dwell_time = window.dwellTime;

      console.log("--------------------------------------------------------");
      console.log("data.scroll_depth = " + percentage);
      console.log("data.scroll_velocity = " + Math.floor(window.velocity));
      console.log("data.dwell_time = " + window.dwellTime);
      console.log("--------------------------------------------------------");

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
    console.log(JSON.stringify(msg))
	};



});