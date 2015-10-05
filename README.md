# Brutime

Brutime is a Node.JS library for scraping data from [Brunel University](https://brunel.ac.uk)'s timetabling portal.

## Install

    npm install --save brutime

## Usage

### Create an instance of BruTime with your login/password.

```js
var timetable = new BruTime({
  login: '1309253',
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

### TODO: `getMyModulesTimetable()` - List contact hours for your enrolled modules

```js
timetable.getMyModulesTimetable({
  period: '1-12',
  days: '1-7'
}, function (err, timetable) {
  console.log('Monday:')
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
