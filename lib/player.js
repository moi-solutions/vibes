var fs = require('fs');
var exec = require('child_process').exec;

var dbPath = './db.json';
var pidPath = './vibes.pid';

// if pid exists then delete
if (fs.existsSync(pidPath)) {
  fs.unlinkSync(pidPath);
}

var Player = function() {

  var self = this;

  self.play = function() {
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

      var selectedFile = db[Math.floor(Math.random()*db.length)];

      var index = db.indexOf(selectedFile);
      db.splice(index, 1);
      fs.writeFileSync(dbPath, JSON.stringify(db), 'utf8');

      var play = 'omxplayer ' + process.env.LOCAL_DIRECTORY + selectedFile;

      var child = exec(play, function(err, stdout, stderr) {
          if (err) throw err;
          console.log('Play: ' + selectedFile);
      });

      // save pid file
      fs.writeFileSync(pidPath, child.pid, 'utf8');

      // listener close
      child.on('close', function(code) {
          // remove pid file
          fs.unlinkSync(pidPath);

          // next file
          self.play();
      });
    }

  };
};

module.exports = new Player();
