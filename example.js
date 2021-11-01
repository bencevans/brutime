import Scraper from "./index.js";

(async () => {
  const scraper = new Scraper();

  console.log("Starting up browser");
  await scraper.init();

  console.log("Logging in to timetabling");
  await scraper.login(process.env.BRUNEL_ID, process.env.BRUNEL_PASSWORD);

  // console.log("Finding course options");
  // const courseOptions = await scraper.getCourseOptions();
  // console.log(courseOptions);

  // console.log("Finding course options with 'Computer' search");
  // const computerCourseOptions = await scraper.getCourseOptions({
  //   courseSearchString: "Computer",
  // });
  // console.log(computerCourseOptions);

  // console.log("Finding foundation course options");
  // const foundationCourseOptions = await scraper.getCourseOptions({
  //   levelId: "0",
  // });
  // console.log(foundationCourseOptions.courses);

  console.log("Finding Level 2 Computer Science Courses");
  const computerScienceLevel2Options = await scraper.getCourseOptions({
    levelId: "2",
    courseSearchString: "Computer Science",
  });
  console.log(computerScienceLevel2Options.courses);

  console.log(
    `Getting timetable for '${computerScienceLevel2Options.courses[0].name}'`
  );
  const timetable = await scraper.getCourseTimetable({
    courseIds: [computerScienceLevel2Options.courses[0].id],
  });

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  for (const i in timetable) {
    console.log();
    console.log(days[i]);
    for (const session of timetable[i]) {
      console.log(JSON.stringify(session));
    }
  }

  await scraper.close();
})();
