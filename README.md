# Brutime

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/feross/standard)
[![Travis](https://img.shields.io/travis/bencevans/brutime.svg?style=flat-square)](https://travis-ci.org/bencevans/brutime)
[![Coveralls](https://img.shields.io/coveralls/bencevans/brutime.svg?style=flat-square)](https://coveralls.io/github/bencevans/brutime)

Brutime is a Node.JS library for scraping data from [Brunel University](https://brunel.ac.uk)'s timetabling portal.

## Install

    npm install --save brutime

## Usage

### Require brutime

```js
var BruTime = require('brutime')
```

### Create an instance of BruTime with your login/password.

```js
var timetable = new BruTime({
  login: '1156145',
  password: 'my password'
})
```

### `listMyModules()` - List your enrolled modules

```js
// List Enrolled Modules
timetable.listMyModules(function (err, myModules) {
  if (err) {
    throw err
  }
  // myModules === ['CS2001', 'CS2002', 'CS2003']
  console.log('My Modules: ' + myModules.join(', '))
  // Prints: CS2001, CS2002, CS2003
})
```

### `getMyModulesTimetable()` - List contact hours for your enrolled modules

```js
timetable.getMyModulesTimetable({
  period: '1-12',
  days: '1-7'
}, function (err, timetable) {
  if (err) {
    return console.error(err)
  }
  console.log(timetable)
})
```

## Testing

```sh
$ export LOGIN=YOUR_STUDENT_ID
$ export PASSWORD=YOUR_STUDENT_PASSWORD
$ npm test
```

## Licence

MIT
