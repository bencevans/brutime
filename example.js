import Scraper from "./index.js";

(async () => {
  const scraper = new Scraper();

  console.log("Starting up browser");
  await scraper.init();

  console.log("Logging in to timetabling");
  await scraper.login(process.env.BRUNEL_ID, process.env.BRUNEL_PASSWORD);

  console.log("Finding course options");
  const courseOptions = await scraper.getCourseOptions();
  console.log(courseOptions);

  console.log("Finding course options with 'Computer' search");
  const computerCourseOptions = await scraper.getCourseOptions({
    courseSearchString: "Computer",
  });
  console.log(computerCourseOptions);

  console.log("Finding foundation course options");
  const foundationCourseOptions = await scraper.getCourseOptions({
    levelId: "1",
  });
  console.log(foundationCourseOptions);

  const timetable = await scraper.getCourseTimetable({
    courseIds: [foundationCourseOptions.courses[0].id],
  });
  console.log(timetable);

  await scraper.close();
})();
