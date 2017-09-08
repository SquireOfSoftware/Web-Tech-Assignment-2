exports.login = function( req, res) {
    var user = req.body.user;
    var pass = req.body.pass;
    connection.query( 'SELECT * FROM user WHERE user_name = ?', [user], function( error, results, fields) {
        if ( error ) {
            res.send({
                "code":400,
                "failed":"Error ocurred"
            })
        } else {
            if ( results.length > 0 ) {
                if ( [0].user_pass == pass ) {
                    res.send({
                        "code":200,
                        "success":"Login sucessfull"
                    });
                } else {
                    res.send({
                        "code":204,
                        "success":"Email and password does not match"
                    });
                }
            } else {
                res.send({
                    "code":204,
                    "success":"Email does not exits"
                });
            }
        }
    });
}
