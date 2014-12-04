salt-shaker
====================

## About

### Description
A script to purge old slugs from a datastore. In reality, salt-shaker is flexible enough to purge the oldest `--max` entries from a given datastore; regardless of whether or not it is a slug.

### Author
* Norman Joyner - norman.joyner@gmail.com

## Getting Started

### Installing
Run ```npm install -g salt-shaker``` to install salt-shaker, and put it in your PATH.

## Usage & Examples
```salt-shaker --help``` can be used for a comprehensive list of available commands and options. Below are some usage examples:

### s3
```salt-shaker s3 --access-key-id AWS_ACCESS_KEY_ID --secret-access-key AWS_SECRET_ACCESS_KEY --prefix my-app --bucket slugs --max 5```

## Under the Hood

### Available Persistence Layers
* S3

## Contributing
Please feel free to contribute by opening issues and creating pull requests!
