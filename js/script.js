// CSS prefix crap...
var pre = prefix();
var _jsPrefix  = pre.lowercase;
if(_jsPrefix == 'moz') {
  _jsPrefix = 'Moz';
}
var _cssPrefix = pre.css;

var _containerHeight, _width, _height, _scrollHeight;
var _movingElements = [];
var _scrollPercent = 0;

var ACCELERATION = 0.2; // IMPORTANT: This value is how quickly each letter begins moving as you scroll. It's a value between [0.0 - 1.0]. At 1.0, each letter will move instantly as soon as the scroll reaches their start position. At a 0.0, they won't move. At some low value, like 0.1, they'll appear to lag behind a bit, adding a bit of physicality to each letter object.

var _positions = [
  {
    name: 's',
    start: {
      percent: 0.05, // This indicates when the letter will start moving. It is "what fraction of the letter-container is hidden" when scrolled. [0.1 == 10%] So if the window is scrolled hiding 10% of the pink box containing the letters, then this letter will begin moving.
      x: 0.091, // The horizontal starting position of the letter as a fraction of the container (or screen) width. This is measured from the left side of each letter image, so at 0.0 the left side of the letter will line up perfectly with the left side of the container.
      y: 0.23 // The vertical starting position of the letter as a fraction of the container (or screen) height. This is measured from the top of each letter image, so at 0.0 the top of the letter will line up perfectly with the top of the container.
    },
    end: {
      percent: 0.5, // This indicates when the letter will stop. As with `start.percent`, it is "what fraction of the letter-container is hidden" when scrolled.
      x: 0.091, // The horizontal finish position of the letter as a fraction of the container (or screen) width.
      y: 0.637 // The vertical finish position of the letter as a fraction of the container (or screen) height.
    }
  },
  {
    name: 'i',
    start: {
      percent: 0.05,
      x: 0.22,
      y: 0.35
    },
    end: {
      percent: 0.5,
      x: 0.22,
      y: 0.548
    }
  },
  {
    name: 'm',
    start: {
      percent: 0.05,
      x: 0.2940,
      y: 0.281
    },
    end: {
      percent: 0.5,
      x: 0.2940,
      y: 0.64
    }
  },
  {
    name: 'p',
    start: {
      percent: 0.05,
      x: 0.537,
      y: 0.42
    },
    end: {
      percent: 0.5,
      x: 0.537,
      y: 0.638
    }
  },
  {
    name: 'l',
    start: {
      percent: 0.05,
      x: 0.6935,
      y: 0.175
    },
    end: {
      percent: 0.5,
      x: 0.694,
      y: 0.534
    }
  },
  {
    name: 'e',
    start: {
      percent: 0.05,
      x: 0.764,
      y: 0.392
    },
    end: {
      percent: 0.5,
      x: 0.764,
      y: 0.637
    }
  }
];

resize();
initMovingElements();

/**
 * Does some initialisation; calculating the difference from start to end of each element
 * and getting the DOM elements we're going to be moving.
 */
function initMovingElements() {
  for (var i = 0; i < _positions.length; i++) {
    _positions[i].diff = {
      percent: _positions[i].end.percent - _positions[i].start.percent,
      x: _positions[i].end.x - _positions[i].start.x,
      y: _positions[i].end.y - _positions[i].start.y,
    };
    _positions[i].target = {};
    _positions[i].current = {};
    var el = document.getElementsByClassName('letter '+_positions[i].name)[0];
    _movingElements.push(el);
  }
}

/**
 * Updates the dimensions (height/width) we're using in our calculations
 * Called whenever the window is resized.
 */
function resize() {
  _containerHeight = document.getElementById('letter-container').clientHeight; // the height of the letter-container
  _width = document.getElementById('container').clientWidth; // Should be the width of the browser window when you're not using a fixed dimension image as the background.
  _height = window.innerHeight; // Height of the browser window
}

/**
 * Updates the position of the elements depending on where the browser window is scrolled to.
 */
function updateElements() {
  for (var i = 0; i < _movingElements.length; i++) {
    var p = _positions[i];
    if(_scrollPercent <= p.start.percent) {
      p.target.x = p.start.x * _width;
      p.target.y = p.start.y * _containerHeight;
    } else if(_scrollPercent >= p.end.percent) {
      p.target.x = p.end.x * _width;
      p.target.y = p.end.y * _containerHeight;
    } else {
      p.target.x = p.start.x * _width + (p.diff.x * (_scrollPercent - p.start.percent)/p.diff.percent * _width);
      p.target.y = p.start.y * _containerHeight + (p.diff.y * (_scrollPercent - p.start.percent)/p.diff.percent * _containerHeight);
    }

    // lerp
    if(!p.current.x) {
      p.current.x = p.target.x;
      p.current.y = p.target.y;
    } else {
      p.current.x = p.current.x + (p.target.x - p.current.x) * ACCELERATION;
      p.current.y = p.current.y + (p.target.y - p.current.y) * ACCELERATION;
    }
    _movingElements[i].style[_jsPrefix+'Transform'] = 'translate3d('+p.current.x+'px, '+
        p.current.y+'px, 0px)';
  }
}


/**
 * This is our render loop, it's called on every frame of animation
 */
function loop() {
  // Set the scroll position of the browser window
  _scrollOffset = window.pageYOffset || window.scrollTop; // How many pixels the page has scrolled down
  _scrollPercent = _scrollOffset/_containerHeight || 0; // The percentage of the letter-container that is hidden

  // Update position of letter elements
  updateElements();

  // Sends a request to the browser to call this function again when it's ready to animate the next frame.
  requestAnimationFrame(loop);
}

// Call the loop function to start animating
loop();

// Call the resize function above whenever the browser is resized, to adjust x (horizontal) position of letters.
window.addEventListener('resize', resize);




/**
 * Prefix bullshit... don't need to know this...
 */
/* prefix detection http://davidwalsh.name/vendor-prefix */

function prefix() {
  var styles = window.getComputedStyle(document.documentElement, ''),
    pre = (Array.prototype.slice
      .call(styles)
      .join('')
      .match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o'])
    )[1],
    dom = ('WebKit|Moz|MS|O').match(new RegExp('(' + pre + ')', 'i'))[1];
  return {
    dom: dom,
    lowercase: pre,
    css: '-' + pre + '-',
    js: pre[0].toUpperCase() + pre.substr(1)
  };
}
