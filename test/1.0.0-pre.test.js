var AJV = require('ajv')
var fs = require('fs')
var glob = require('glob')
var path = require('path')
var tape = require('tape')

tape.test('1.0.0-pre', function (suite) {
  var schemas = {}
  var ajv = new AJV()

  glob.sync('1.0.0-pre/schemas/*.json').forEach(function (file) {
    var schema = JSON.parse(fs.readFileSync(file))
    ajv.addSchema(schema, schema.$id)
  })

  glob.sync('1.0.0-pre/schemas/*.json').forEach(function (file) {
    suite.test(file, function (test) {
      var basename = path.basename(file, '.json')
      var schema = JSON.parse(fs.readFileSync(file))
      schemas[basename] = schema
      test.assert(ajv.validateSchema(schema), 'valid JSON schema')
      test.deepEqual(ajv.errors, null, 'no validation errors')
      test.end()
    })
  })

  glob.sync('1.0.0-pre/examples/*.valid.json').forEach(function (file) {
    suite.test(file, function (test) {
      var basename = path.basename(file, '.json')
      var schemaName = basename.split('-')[0]
      var schema = schemas[schemaName]
      var parsed = JSON.parse(fs.readFileSync(file))
      test.assert(ajv.validate(schema, parsed), 'valid')
      test.deepEqual(ajv.errors, null, 'no validation errors')
      test.end()
    })
  })

  glob.sync('1.0.0-pre/examples/*.invalid.json').forEach(function (file) {
    suite.test(file, function (test) {
      var basename = path.basename(file, '.json')
      var schemaName = basename.split('-')[0]
      var schema = schemas[schemaName]
      var parsed = JSON.parse(fs.readFileSync(file))
      test.assert(!ajv.validate(schema, parsed), 'invalid')
      test.end()
    })
  })
})
