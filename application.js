#!/usr/bin/env node
var _ = require("lodash");
var nomnom = require("nomnom");
var pkg = require([__dirname, "package"].join("/"));
var logger = require([__dirname, "lib", "logger"].join("/"));

nomnom.script(pkg.name);

var default_options = {
    version: {
        flag: true,
        abbr: "v",
        help: "print version and exit",
        callback: function(){
            return pkg.version;
        }
    },

    max: {
        abbr: "m",
        help: "Maximum number of entries to keep",
        required: true
    },

    "dry-run": {
        flag: true,
        help: "Enable dry-run mode. Nothing will actually be deleted",
        default: false
    }
}

var s3_options = _.defaults(default_options, {
    region: {
        help: "AWS Region",
        default: "us-east-1"
    },

    "access-key-id": {
        help: "AWS access key id",
        required: true
    },

    "secret-access-key": {
        help: "AWS secret access key",
        required: true
    },

    "prefix": {
        help: "S3 path prefix"
    },

    bucket: {
        help: "S3 bucket used for persistence",
        required: true
    }
});

nomnom.command("s3").options(s3_options).callback(function(options){
    var S3 = require([__dirname, "persistence", "s3"].join("/"));
    var s3 = new S3({
        region: options.region,
        credentials: {
            accessKeyId: options["access-key-id"],
            secretAccessKey: options["secret-access-key"]
        }
    });

    s3.purge({
        prefix: options.prefix,
        max: options.max,
        bucket: options.bucket,
        dry_run: options["dry-run"]
    }, function(err, purged){
        if(err)
            logger.log("error", err.message);
        else if(options["dry-run"]){
            _.each(purged, function(object){
                logger.log("info", [object.Key, "will be purged!"].join(" "));
            });
        }
        else if(purged == 0)
            logger.log("info", "No items had to be purged!");
        else
            logger.log("info", ["Successfully purged", purged, "items!"].join(" "));
    });
});

nomnom.parse();
