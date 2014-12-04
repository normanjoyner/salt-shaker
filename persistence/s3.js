var util = require("util");
var _ = require("lodash");
var AWS_SDK = require("aws-sdk");
var Persistence = require([__dirname, "..", "lib", "persistence"].join("/"));

function S3(config){
    this.initialize("s3");
    AWS_SDK.config.update(config);
    this.s3 = new AWS_SDK.S3();
}

util.inherits(S3, Persistence);

S3.prototype.purge = function(options, fn){
    var self = this;

    var data = {
        Bucket: options.bucket
    }

    if(!_.isUndefined(options.prefix))
        data.Prefix = options.prefix;

    this.s3.listObjects(data, function(err, data) {
        if(err)
            return fn(err);

        if(_.has(data, "Contents")){
            var objects = _.sortBy(data.Contents, function(object){
                return new Date(object.LastModified).valueOf();
            });

            if(objects.length <= options.max)
                return fn(null, 0);
            else{
                var to_purge = _.map(_.first(objects, (objects.length - options.max)), function(object){
                    return _.pick(object, "Key");
                });
                if(!options.dry_run){
                    self.s3.deleteObjects({
                        Bucket: options.bucket,
                        Delete: {
                            Objects: to_purge
                        }
                    }, function(err, data){
                        return fn(err, to_purge.length);
                    });
                }
                else
                    return fn(null, to_purge);
            }
        }
        else
            return cb(new Error("S3 response missing 'Contents' key"));
    });
}

module.exports = S3;
