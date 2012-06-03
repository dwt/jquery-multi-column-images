jasmine.getFixtures().fixturesPath = 'fixtures';

beforeEach(function() {
    /*
  this.addMatchers({
    toBePlaying: function(expectedSong) {
      var player = this.actual;
      return player.currentlyPlayingSong === expectedSong && 
             player.isPlaying;
    }
  });
  */
});

afterEach(function() {
    if ((/reload/).test(window.location)) {
        setTimeout("window.location.reload()", 3 * 1000)
    }
});