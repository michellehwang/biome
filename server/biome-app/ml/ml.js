var cp = require('child_process')

var Result = function(status, result) {
    this.status = status;
    this.result = result;
}

exports.classifyImage = function(path, callback) {
    var child = cp.exec('python py/classify.py ' + path, []
, function(err, stdout, stderr) {
    if (err) {
      console.log(err)
      callback(null);
      return;
    }
    console.error(stderr)
    var str = stdout;
    callback(stdout.trim());
});
}
