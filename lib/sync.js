var Dropbox = require('dropbox');
var http = require('http');
var fs = require('fs');
var crypto = require('crypto');
var exec = require('child_process').exec;

var directory = '/vibes';

var client = new Dropbox.Client({
    token: process.env.DROPBOX_TOKEN
});

var Sync = function() {

    var self = this;

    self.run = function() {

      client.authenticate(function(error, client) {
        if (error) {
          console.log(error);
        }

        client.readdir(directory, function(error, entries) {
          if (error) {
            console.log(error);
          }

          entries.forEach(function(entry) {
            client.makeUrl( directory +  '/' + entry, { download: true }, function(eror, file) {
              // hash url to create file name
              var hash = crypto.createHash('md5').update(entry).digest('hex');

              // set file name
              var fileName = process.env.LOCAL_DIRECTORY + hash + '.mp3';

              // check if file exists
              if (!fs.existsSync(fileName)) {

                // download file
                var wget = 'wget ' + file.url + ' -O ' + fileName;

                // excute wget using child_process exec function
                var child = exec(wget, function(err, stdout, stderr) {
                    if (err) throw err;
                    else console.log(fileName + ' downloaded to ' + fileName);
                });

                child.stdout.on('data', function(data) {
                    console.log('stdout: ' + data);
                });
                child.stderr.on('data', function(data) {
                    console.log('stdout: ' + data);
                });
                child.on('close', function(code) {
                    console.log('closing code: ' + code);
                });
              }
            });
          });
        });
      });
    }
};

module.exports = new Sync();
