var Session = require('./sessionMdl');

var sessionController = {};

// nurse logs in when they arrive for work, session is kept so that any midshift assignment changes can update automatically via setInterval request
sessionController.startSession = function(req, res, next) {
  var name = req.body.first + ' ' + req.body.last;
  var newSession = new Session({
    cookieId: name,
  });
  newSession.save(function(err){
    if (err) throw err;
  });
  next();
};

sessionController.isLoggedIn = function(req, res, next) {
  if (req.cookies.nurse){
    Session.findOne({'cookieId': req.cookies.nurse}, 'cookieId', function(err, nurse){
      if (err) return handleError(err);
      if (!nurse) return res.redirect('/signup'); // ask mike what needs to be sent to re-render log-in view
    }).then(function(nurse){
      next();
    })
  } else return res.redirect('/signup'); // same as above
};

module.exports = sessionController;