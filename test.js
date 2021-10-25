import test from "tape";
import { INVALID_CREDENTIALS } from "./errors.js";
import Scraper from "./index.js";

/**
 * Authentication Tests
 */

test("create an instance", async function (t) {
  t.plan(1);
  const scraper = new Scraper();
  await scraper.init();
  t.ok(scraper._ensureInitialised());
  await scraper.close();
});

test("login with invalid login", async (t) => {
  t.plan(1);
  const scraper = new Scraper();
  await scraper.init();

  try {
    await scraper.login("invalid", "invalid");
  } catch (e) {
    t.equal(
      e,
      INVALID_CREDENTIALS,
      "should throw an invalid credentials error"
    );
  }

  await scraper.close();
});

test("login with valid credentials", async (t) => {
  t.plan(1);
  const scraper = new Scraper();
  await scraper.init();
  await scraper.login(process.env.BRUNEL_ID, process.env.BRUNEL_PASSWORD);
  t.ok(await scraper.ensureInitialisedAndAuthenticated());
  await scraper.close();
});

test("Get Course Timetable Options", async (t) => {
  const scraper = new Scraper();
  await scraper.init();
  await scraper.login(process.env.BRUNEL_ID, process.env.BRUNEL_PASSWORD);
  const options = await scraper.getCourseOptions();

  t.ok(Array.isArray(options.levels), "should return an array of levels");
  t.ok(options.levels.length > 0, "should return at least one level");

  for (const level of options.levels) {
    t.ok(typeof level.id === "string", "level id is a string");
    t.ok(level.id.length > 0, "level id is not empty string");
    t.ok(typeof level.name === "string", "level name is a string");
    t.ok(level.name.length > 0, "level name is not empty string");
  }

  t.ok(Array.isArray(options.courses), "should return an array of courses");
  t.ok(options.courses.length > 0, "should return at least one course");

  options.courses.forEach((course) => {
    t.ok(typeof course.id === "string", "course id is a string");
    t.ok(course.id.length > 0, "course id is not empty string");
    t.ok(typeof course.name === "string", "course name is a string");
    t.ok(course.name.length > 0, "course name is not empty string");
  });

  // Check options with search string

  const optionsWithSearch = await scraper.getCourseOptions({
    courseSearchString: "Computer",
  });

  t.ok(
    Array.isArray(optionsWithSearch.courses),
    "should return an array of courses"
  );
  t.ok(
    optionsWithSearch.courses.length > 0,
    "should return at least one course"
  );
  t.ok(
    optionsWithSearch.courses.length < options.courses.length,
    "should return less courses"
  );

  // Check options with level id
  const optionsWithLevel = await scraper.getCourseOptions({
    levelId: options.levels[0].id,
  });

  t.ok(
    Array.isArray(optionsWithLevel.courses),
    "should return an array of courses"
  );
  t.ok(
    optionsWithLevel.courses.length > 0,
    "should return at least one course"
  );
  t.ok(
    optionsWithLevel.courses.length < options.courses.length,
    "should return less courses"
  );

  await scraper.close();

  t.end();
});

// test("create an instance with invalid login/password", function (t) {
//   t.plan(1);
//   brutime = new Brutime({
//     login: "404",
//     password: "not found",
//   });
//   t.ok(brutime, "creates an instance of BruTime");
// });

// test("login in with an invalid login", function (t) {
//   t.plan(1);
//   brutime.login(function (err) {
//     t.throws(
//       function () {
//         throw err;
//       },
//       /invalid login/,
//       "showing invalid login message"
//     );
//   });
// });

// test("create an valid instance", function (t) {
//   t.plan(1);
//   brutime = new Brutime({
//     login: process.env.LOGIN,
//     password: process.env.PASSWORD,
//   });
//   t.ok(brutime);
// });

// test("login with a valid username and password", function (t) {
//   t.plan(1);
//   brutime.login(function (err) {
//     t.error(err);
//     t.end();
//   });
// });

// /**
//  * My Modules
//  */

// test("list my modules without prior login", function (t) {
//   t.plan(3);
//   brutime = new Brutime({
//     login: process.env.LOGIN,
//     password: process.env.PASSWORD,
//   });
//   t.ok(brutime, "created BruTime instance");
//   brutime.listMyModules(function (err, myModules) {
//     t.error(err, "hasn't errored");
//     t.ok(myModules.length > 0, "array of modules exists");
//   });
// });

// test("list my modules without prior login and an invalid login/password", function (t) {
//   t.plan(2);
//   var brutime = new Brutime({
//     login: "404",
//     password: "not found",
//   });
//   t.ok(brutime, "created BruTime instance");
//   brutime.listMyModules(function (err, myModules) {
//     t.throws(function () {
//       throw err;
//     }, /invalid login/);
//   });
// });

// test("listing my modules", function (t) {
//   t.plan(3);
//   brutime.listMyModules(function (err, myModules) {
//     if (err) {
//       throw err;
//     }
//     t.ok(myModules instanceof Array, "myModules is an array");
//     t.ok(myModules.length > 0, "myModules has at least one module in array");
//     t.ok(typeof myModules[0] === "string", "module is string");
//   });
// });

// /**
//  * My Modules Timetable
//  */

// test("list events from my modules", function (t) {
//   t.plan(2);
//   brutime.getMyModulesTimetable({}, function (err, timetable) {
//     t.error(err);
//     t.equal(timetable.length, 7, "7 days are returned by default");
//   });
// });
