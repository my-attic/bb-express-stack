/**
 * Created by k33g_org on 02/01/15.
 */

module.exports = function(app, myDataBase) {
  app.get("/api/users/hello", function(req, res) {
    res.send({message:"hello"});
  });


  app.post("/api/users/signin", function(req, res) {
    var user = req.body;
    console.log("user:", user);
    req.session.connectedUser = user;
    res.send(user);
  });

  app.get("/api/users/token", function(req, res) {
    res.send(req.session.connectedUser);
  });


  // all users
  app.get("/api/users", function(req, res) {

    myDataBase.find({}, function (err, docs) {
      res.send(docs);
    });

  });

  // one user by id
  app.get("/api/users/:id", function(req, res) {
    myDataBase.findOne({ _id: req.params.id }, function (err, doc) {
      res.send(doc)
    });
  });

  // delete a user by id
  app.delete("/api/users/:id", function(req, res) {
    myDataBase.remove({ _id: req.params.id }, {}, function (err, numRemoved) {
      res.statusCode = 200;
      res.send({res:numRemoved});
    });
  });

  // add a user
  app.post("/api/users", function(req, res) {
    var user = req.body;
    myDataBase.insert(user, function (err, newDoc) {
      res.statusCode = 301;
      res.header("location", "/users/"+newDoc._id).end();
    });

  });

  // update user by id
  app.put("/api/users/:id", function(req, res) {
    myDataBase.update({_id:req.params.id}, req.body, {}, function (err, numReplaced) {
      res.statusCode = 200;
      res.send({res:numReplaced});
    })
  });


};