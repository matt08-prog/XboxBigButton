chrome.app.runtime.onLaunched.addListener(function() {
  console.log("I think we're alone now, 'cause everything you say judt comes back at meeeeee.")
  chrome.app.window.create('window.html',
  {
    'outerBounds': {
      'width': 1920,
      'height': 1021
    }
  });
});

chrome.runtime.onSuspend.addListener(function() {
  // Do some simple clean-up tasks.
});
