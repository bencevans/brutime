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
  t.ok(await scraper._ensureInitialisedAndAuthenticated());
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
