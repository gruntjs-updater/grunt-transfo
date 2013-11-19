var grunt = require('grunt');
var fs = require('fs');

// From grunt-contrib-concat
var comment = require('../tasks/lib/comment').init(grunt);

function getNormalizedFile(filepath) {
  return grunt.util.normalizelf(grunt.file.read(filepath));
}


exports.transfo = {

  // Compatibility with grunt-contrib-copy

  copy_main: function(test) {
    'use strict';

    test.expect(3);

    var actual = fs.readdirSync('tmp_transfo_copy/copy_test_files').sort();
    var expected = fs.readdirSync('test/copy/expected/copy_test_files').sort();
    test.deepEqual(expected, actual, 'should copy several files');

    actual = fs.readdirSync('tmp_transfo_copy/copy_test_mix').sort();
    expected = fs.readdirSync('test/copy/expected/copy_test_mix').sort();
    test.deepEqual(expected, actual, 'should copy a mix of folders and files');

    actual = fs.readdirSync('tmp_transfo_copy/copy_test_v0.1.0').sort();
    expected = fs.readdirSync('test/copy/expected/copy_test_v0.1.0').sort();
    test.deepEqual(expected, actual, 'should parse both dest and src templates');

    test.done();
  },

  copy_flatten: function(test) {
    'use strict';

    test.expect(1);

    var actual = fs.readdirSync('tmp_transfo_copy/copy_test_flatten').sort();
    var expected = fs.readdirSync('test/copy/expected/copy_test_flatten').sort();
    test.deepEqual(expected, actual, 'should create a flat structure');

    test.done();
  },

  copy_single: function(test) {
    'use strict';

    test.expect(1);

    var actual = grunt.file.read('tmp_transfo_copy/single.js');
    var expected = grunt.file.read('test/copy/expected/single.js');
    test.equal(expected, actual, 'should allow for single file copy');

    test.done();
  },



  // Compatibility with grunt-contrib-concat

  default_options: function(test) {
    test.expect(1);

    var actual = getNormalizedFile('tmp_transfo_concat/default_options');
    var expected = getNormalizedFile('test/concat/expected/default_options');
    test.equal(actual, expected, 'should describe what the default behavior is.');

    test.done();
  },
  custom_options: function(test) {
    test.expect(1);

    var actual = getNormalizedFile('tmp_transfo_concat/custom_options');
    var expected = getNormalizedFile('test/concat/expected/custom_options');
    test.equal(actual, expected, 'should utilize custom banner, footer and separator.');

    test.done();
  },
  handling_invalid_files: function(test) {
    test.expect(1);

    var actual = getNormalizedFile('tmp_transfo_concat/handling_invalid_files');
    var expected = getNormalizedFile('test/concat/expected/handling_invalid_files');
    test.equal(actual, expected, 'will have warned, but should not fail.');

    test.done();
  },
  strip_banner: function(test) {
    test.expect(7);

    var src = getNormalizedFile('test/concat/fixtures/banner.js');
    test.equal(comment.stripBanner(src), grunt.util.normalizelf('// Comment\n\n/* Comment */\n'), 'It should strip the top banner.');
    test.equal(comment.stripBanner(src, {block: true}), grunt.util.normalizelf('// Comment\n\n/* Comment */\n'), 'It should strip the top banner.');

    src = getNormalizedFile('test/concat/fixtures/banner2.js');
    test.equal(comment.stripBanner(src), grunt.util.normalizelf('\n/*! SAMPLE\n * BANNER */\n\n// Comment\n\n/* Comment */\n'), 'It should not strip the top banner.');
    test.equal(comment.stripBanner(src, {block: true}), grunt.util.normalizelf('// Comment\n\n/* Comment */\n'), 'It should strip the top banner.');

    src = getNormalizedFile('test/concat/fixtures/banner3.js');
    test.equal(comment.stripBanner(src), grunt.util.normalizelf('\n// This is\n// A sample\n// Banner\n\n// But this is not\n\n/* And neither\n * is this\n */\n'), 'It should not strip the top banner.');
    test.equal(comment.stripBanner(src, {block: true}), grunt.util.normalizelf('\n// This is\n// A sample\n// Banner\n\n// But this is not\n\n/* And neither\n * is this\n */\n'), 'It should not strip the top banner.');
    test.equal(comment.stripBanner(src, {line: true}), grunt.util.normalizelf('// But this is not\n\n/* And neither\n * is this\n */\n'), 'It should strip the top banner.');
    test.done();
  },
  process_function: function(test) {
    test.expect(1);

    var actual = getNormalizedFile('tmp_transfo_concat/process_function');
    var expected = getNormalizedFile('test/concat/expected/process_function');
    test.equal(actual, expected, 'should have processed file content.');

    test.done();
  }
};
