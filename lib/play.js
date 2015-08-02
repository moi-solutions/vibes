var fs = require('fs');
var omx = require('omxctrl');
var exec = require('child_process').exec;

var dbPath = './db.json';
var pidPath = './vibes.pid';

// if pid exists then delete
if (fs.existsSync(pidPath)) {
  fs.unlinkSync(pidPath);
}

var Store = function() {

  var self = this;

  self.run = function() {
    if (fs.existsSync(pidPath)) {
      console.log('Ignore request');
    }
    else {
      var list = fs.readdirSync(process.env.LOCAL_DIRECTORY);

      var db = JSON.parse(fs.readFileSync(dbPath));

      // create database if empty
      if (db.length === 0) {
        if (list.length > 0) {
          var store = [];
          list.forEach(function(file) {
            store.push(file);
          });

          fs.writeFileSync(dbPath, JSON.stringify(store), 'utf8');
        }
        // reload database
        db = JSON.parse(fs.readFileSync(dbPath));
      }

      // select random position
      var selectedFile = db[Math.floor(Math.random()*db.length)];

      // remove position selected
      // and create new db.json file
      var index = db.indexOf(selectedFile);
      db.splice(index, 1);
      fs.writeFileSync(dbPath, JSON.stringify(db), 'utf8');

      // play file
      omx.play(process.env.LOCAL_DIRECTORY + selectedFile);

      // on ended play new file 
      omx.on('ended', function() {
        // remove pid file
        fs.unlinkSync(pidPath);

        // next file
        self.get();
      });

      //var play = 'omxplayer ' + process.env.LOCAL_DIRECTORY + selectedFile;

      //var child = exec(play, function(err, stdout, stderr) {
      //    if (err) throw err;
      //    console.log('Play: ' + selectedFile);
      //});

      // save pid file
      fs.writeFileSync(pidPath, child.pid, 'utf8');

      // listener close
      //child.on('close', function(code) {
          // remove pid file
      //    fs.unlinkSync(pidPath);

          // next file
      //    self.get();
      //});
    }

  };

  /**
   * Stop audio
   */
  self.stop = function() {
    omx.stop();
  }
};

module.exports = new Store();
