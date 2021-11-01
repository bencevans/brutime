# brutime

Node.js module for scraping data from [Brunel University](https://brunel.ac.uk)'s timetabling portal.

⚠️ This README is out of date and shall be updated soon once the puppeteer rewrites are complete.

## Install

    $ npm install --save brutime

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

```js
try {
  await bruTime.login(studentId, password);
} catch (err) {
  console.error(err);
}
```

### Course Timetable

#### Get Course Timetable Options

#### Get Course Timetable

## Testing

```sh
$  export BRUNEL_ID=YOUR_STUDENT_ID
$  export BRUNEL_PASSWORD=YOUR_STUDENT_PASSWORD
$ npm test
```

## Licence

MIT © [Ben Evans](http://bensbit.co.uk)
