const test = require('tape')
const Brutime = require('./')

var brutime

/**
* Authentication Tests
*/

test('create an instance without login/password', function (t) {
  t.plan(1)
  t.throws(function () {
    brutime = new Brutime({})
  }, /login required/)
})

test('create an instance missing password', function (t) {
  t.plan(1)
  t.throws(function () {
    brutime = new Brutime({
      login: '123124'
    })
  }, /password required/)
})

test('create an instance with invalid login/password', function (t) {
  t.plan(1)
  brutime = new Brutime({
    login: '404',
    password: 'not found'
  })
  t.ok(brutime, 'creates an instance of BruTime')
})

test('login in with an invalid login', function (t) {
  t.plan(1)
  brutime.login(function (err) {
    t.throws(function () {
      throw err
    }, /invalid login/, 'showing invalid login message')
  })
})

test('create an valid instance', function (t) {
  t.plan(1)
  brutime = new Brutime({
    login: process.env.LOGIN,
    password: process.env.PASSWORD
  })
  t.ok(brutime)
})

test('login with a valid username and password', function (t) {
  t.plan(1)
  brutime.login(function (err) {
    t.error(err)
    t.end()
  })
})

/**
* My Modules
*/

test('list my modules without prior login', function (t) {
  t.plan(3)
  brutime = new Brutime({
    login: process.env.LOGIN,
    password: process.env.PASSWORD
  })
  t.ok(brutime, 'created BruTime instance')
  brutime.listMyModules(function (err, myModules) {
    t.error(err, 'hasn\'t errored')
    t.ok(myModules.length > 0, 'array of modules exists')
  })
})

test('list my modules without prior login and an invalid login/password', function (t) {
  t.plan(2)
  var brutime = new Brutime({
    login: '404',
    password: 'not found'
  })
  t.ok(brutime, 'created BruTime instance')
  brutime.listMyModules(function (err, myModules) {
    t.throws(function () {
      throw err
    }, /invalid login/)
  })
})

test('listing my modules', function (t) {
  t.plan(3)
  brutime.listMyModules(function (err, myModules) {
    if (err) {
      throw err
    }
    t.ok(myModules instanceof Array, 'myModules is an array')
    t.ok(myModules.length > 0, 'myModules has at least one module in array')
    t.ok(typeof myModules[0] === 'string', 'module is string')
  })
})
