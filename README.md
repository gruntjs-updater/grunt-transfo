# grunt-transfo

> Transfo offer both 'copy' and 'concat' task at once with the addition of streamed transformation of content and optional caching based on files mtime to limit unrequired file processing. Transfo should be used as an alternative to any grunt-contrib-copy and/or grunt-contrib-concat usage without any change in your grunt configuration (see compatibility test).

![transfo.png](https://raw.github.com/nopnop/grunt-transfo/master/transfo.png)

## Functionalities overview

  - Replace grunt-contrib-copy without any configuration changes
  - Replace grunt-contrib-concat without any configuration changes
  - Lazy mode offer caching to reduce processing time if the source is not newer than the destination (see `lazy` option)
  - Use of [Stream](http://nodejs.org/api/stream.html) instead of buffering all the file content before copy or concat.
  - Pipe stream of sources and/or concatenated sources through a pipeline of [Stream Transform](http://nodejs.org/api/stream.html#stream_class_stream_transform) (see `transforms` option).
  - Adding dynamically files to the processing queue while the sources goes through the transforms pipeline.
  - Processing  more than one file at a time (see `concurrency` option)

## Getting Started
This plugin requires Grunt `~0.4.1` and node `>= 0.10.0`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-transfo --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-transfo');
```

## The "transfo" task

### Overview
In your project's Gruntfile, add a section named `transfo` to the data object passed into `grunt.initConfig()`.

You can use `grunt-transfo` in place of any [grunt-contrib-copy](https://github.com/gruntjs/grunt-contrib-copy) or  [grunt-contrib-concat](https://github.com/gruntjs/grunt-contrib-concat) configuration.

```js
grunt.initConfig({
  transfo: {
    options: {
      // Any grunt-contrib-copy and/or grunt-contrib-concat options
      // Any grunt-transfo options (see below)
    },

    // Copy
    any_copy_task: {
      files: [
        {expand: true, src: ['path/**/*.js'], dest: 'build/', filter: 'isFile'}
      ]
    },

    // Concat
    any_concat_task: {
      options: {
        stripBanners: true,
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %> */',
      },
      src: ['build/project.js','vendors/**/*.js'],
      dest: 'dist/built.js',
      expand: true
    },
  },
})
```

### Options

#### concurrency

Type: `Integer` (>= 1) • Default: 1

How many files to proceed at the same time (copy and concat are asynchronously executed).

#### transforms

Type: `Array` of `Function` • Default: `[]`

Each function is a constructor for a [Transform stream](http://nodejs.org/api/stream.html#stream_class_stream_transform). Any time a source is processed, each constructor is called with following arguments and must return a Transform stream.

`Array of function(src, dest, options, addFiles) ... `

  - `src` {`String`}: The source file path
  - `dest` {`String`}: The destination file path
  - `options` {`Object`}:
    - *All your task options*
    - `isConcat` {`Boolean`}: This is file will be concatenated with others
  - `addFiles` {`Function`}: A helper to add files to the process queue. Usefull to add file detected while the transformation (expl: assets in css source):
    - `sources` {`Array|String`}: One or many path to copy / concatenate
    - `dest` {`String`}: Destination path
    - `options`: Copy/concat options (transfo options)

```js
options: {
  transforms: [
    // PassThrough ...
    function(src, dest, options, addFiles) { return new stream.Transform(); }
  ]
}
```

See too [Stream Handbook](https://github.com/substack/stream-handbook) to understand why using [stream](http://nodejs.org/api/stream.html) may be very powerfull.

See too [through2](https://github.com/rvagg/through2) a nice wrapped around [stream.Transform](http://nodejs.org/api/stream.html#stream_class_stream_transform).


#### transformsConcat

Type: `Array` of `Function` • Default: `[]`

Like the `transforms` option but for the concatenated result.

`Array of function(src, dest, options) ... `

  - `src` {`String`}: The source file path
  - `dest` {`String`}: The destination file path
  - `options` {`Object`}:
    - *All your task options*
    - `isConcat` {`Boolean`}: This is file will be concatenated with others


####  lazy

Type: `Boolean` • Default: `false`

Do nothing if the destination file already exist with an equal or posterior mtime of the source(s). Both for copy and concat. Concat task a cached copy of the sources files after processing and transformation in `tmp/grunt-transfo` (see `cache` option below).

This option can be useful to reduce processing time. Especially when you use transfo with [watch](https://github.com/gruntjs/grunt-contrib-watch) and [livereload](https://github.com/gruntjs/grunt-contrib-watch#optionslivereload).

#### cache

Type: `String` • Default: `tmp/grunt-transfo`

The path to use to store lazy & concatenation cached files. Remember to add this path to your `clean` task if you plan to use the `lazy` option.

#### readOnly

Type: `Boolean` • Default: `false`

Only read source content through the process & transform pipeline but write nothing to the destination.

#### Any [grunt-contrib-copy options](https://github.com/gruntjs/grunt-contrib-copy#options)

  - [processContent](https://github.com/gruntjs/grunt-contrib-copy#processcontent)
  - [processContentExclude](https://github.com/gruntjs/grunt-contrib-copy#processcontentexclude)

#### Any [grunt-contrib-concat options](https://github.com/gruntjs/grunt-contrib-concat#options)

  - [separator](https://github.com/gruntjs/grunt-contrib-concat#separator)
  - [banner](https://github.com/gruntjs/grunt-contrib-concat#banner)
  - [stripBanners](https://github.com/gruntjs/grunt-contrib-concat#stripbanners)
  - [process](https://github.com/gruntjs/grunt-contrib-concat#process)

### Usage Examples

The [transfo-unifyurl](https://npmjs.org/package/transfo-unifyurl) library is an example of grunt-transfo stream transformation.
[transfo-unifyurl](https://npmjs.org/package/transfo-unifyurl) copy all css assets by adding them to the grunt-transfo pipeline.

```shell
npm install transfo-unifyurl
```

```js
grunt.initConfig({
  transfo: {
    // This is a concat task. grunt-transfo allow copy task too
    concat_css: {
      src: ['src/**/*.css'],
      dest: 'build/css/compiled.css',
      options: {
        // Add unifyurl to the transformation pipeline
        transforms: [require('transfo-unifyurl')],
        // Set unifyurl options (below the default options):
        unifyurl: {
          // Assets destination: relative to the css destination path.
          dest:       './',

          // Url to the destination (default is a resolved
          // relative path based on dest value)
          url:        null,

          // List source extension to process. Other sources are ignored.
          extensions: ['.css']
        },
      },
    },
  },
})
```


## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
