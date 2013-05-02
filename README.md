# Parcel

Parcel is easy package management using a file server and path conventions, with
built in support for [Amazon S3](http://aws.amazon.com/s3/).  It is designed to
encode package metadata, including name, version and OS within a path.  The
conventions allow this metadata to be queried, without the need for a database.

## Install

    $ npm install parcel -g

Install for development:

    $ git clone git@github.com:sifteo/parcel.git
    $ cd parcel
    $ npm link

## Usage

#### Command Line

To publish a package, invoke the command:

    $ parcel publish repo.json MyApp-v1.0.1.dmg -p macosx.json
    
The first argument is a file containing repository configuration.  An example
`repo.json` for an S3 repository would look like:

    {
        "url": "s3://updates.example.com/stable/",
        "pattern": ":name/:os/:version/:filename",
        "accessKeyId": "INSERT_ACCESS_KEY_ID_HERE",
        "secretAccessKey": "INSERT_SECRET_ACCESS_KEY_HERE"
    }

`url` contains the url of the S3 repository, and `pattern` declares the path
conventions in use.  Properties of the package will be substitued into this
pattern when uploading the package.

Parcel can infer many properties of the package.  The optional `-p` argument
allows properties to be declared explicitly.

    {
      "name": "my-app",
      "os": "macosx",
      "pattern": "MyApp-v:version.dmg"
    }

Once packages are published, they can be queried:

    $ parcel query repo.json my-app
    
    $ parcel query repo.json my-app@1.0.1
    
#### API

The command line interface is built on top of an API.  Parcel can be required
as a module, and this API can be used programmatically.

## Tests

    $ npm install
    $ make test

## License

[Apache License, Version 2.0](http://opensource.org/licenses/Apache-2.0)

Copyright (c) 2013 Sifteo Inc. <[http://www.sifteo.com/](http://www.sifteo.com/)>
