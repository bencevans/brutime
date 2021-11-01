# brutime

Node.js module for scraping data from [Brunel University](https://brunel.ac.uk)'s timetabling portal.

## Install

    $ npm install --save github:bencevans/brutime

## Usage

### Import BruTime

```js
import BruTime from "brutime";
```

### Create an Instance

```js
const bruTime = new BruTime();

// Creates an instance of puppeteer/chromium
await bruTime.init();

// You can also pass in a puppeteer options object for example the following
// to show the browser window and enable devtools.
await bruTime.init({
  headless: false,
  devtools: true,
});
```

### Login

- Students: Should use your Student ID and network password.
- Staff: Should use your network username and password.

Both the student id/staff login and password should be strings.

```js
try {
  await bruTime.login(studentId, password);
} catch (err) {
  console.error(err);
}
```

### Course Timetable

#### Get Course Timetable Options

    TODO: Look in example.js in the meantime.

#### Get Course Timetable

    TODO: Look in example.js in the meantime.

## Testing

```sh
$  export BRUNEL_ID=YOUR_STUDENT_ID
$  export BRUNEL_PASSWORD=YOUR_STUDENT_PASSWORD
$ npm test
```

## Related

- [bencevans/parse-weeks](https://github.com/bencevans/parse-weeks) - Parse a comma separated list of ranges and numbers into an array of all numbers covered.
- [bencevans/brucal](https://github.com/bencevans/brucal) - (deprecated) - iCal Web Service for Brunel Timetables. Automatically add your Brunel timetable to Google Calendar, GNOME Calendar or any other calendar application providing support for Web iCal.
- ... [Add Your Project](https://github.com/bencevans/brutime/edit/main/README.md)

## Licence

MIT © [Ben Evans](http://bensbit.co.uk)
