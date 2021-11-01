import puppeteer from "puppeteer";
import {
  LOGIN_REQUIRED,
  INVALID_CREDENTIALS,
  NOT_IMPLIMENTED,
  NO_COURSES_SELECTED,
} from "./errors.js";

export default class Scraper {
  constructor() {
    this.baseUrl = "https://teaching.brunel.ac.uk/teaching/SWS-2122/";
    this.loginUrl =
      "https://teaching.brunel.ac.uk/teaching/SWS-2122/Login.aspx";
    this.defaultUrl =
      "https://teaching.brunel.ac.uk/teaching/SWS-2122/default.aspx";

    this.browser = null;
    this.page = null;
  }

  /**
   * Initialise the browser ready for scraping
   */
  async init(
    puppeteerOptions = {
      headless: false,
    }
  ) {
    this.browser = await puppeteer.launch(puppeteerOptions);
    this.page = await this.browser.newPage();
  }

  /**
   * Ensure that the browser has been initialised
   */
  async _ensureInitialised() {
    if (!this.browser) {
      await this.init();
    }
  }

  /**
   * Log in to the https://teaching.brunel.ac.uk website
   * @param {String} username Students: student number (eg 201234), Staff: network username (eg hlstikb)
   * @param {*} password network password
   */
  async login(username, password) {
    await this._ensureInitialised();

    await this.page.goto(this.baseUrl);

    await this.page.waitForSelector("#tUserName");
    await this.page.focus("#tUserName");
    await this.page.type("#tUserName", username);

    await this.page.waitForSelector("#tPassword");
    await this.page.focus("#tPassword");
    await this.page.type("#tPassword", password);

    await this.page.waitForSelector("#bLogin");
    await this.page.click("#bLogin");

    await this.page.waitForNetworkIdle();

    if (this.page.url().toLowerCase().includes("login")) {
      throw INVALID_CREDENTIALS;
    }
  }

  /**
   * Ensure that the browser has been initialised and that the user is logged in
   */
  async _ensureInitialisedAndAuthenticated() {
    await this._ensureInitialised();

    await this.page.goto(this.baseUrl);

    if (this.page.url().includes("Login")) {
      throw LOGIN_REQUIRED;
    }

    return true;
  }

  /**
   * Retreive available course timetable options including list of courses and levels.
   * @param {Object} opts An object containing any of `levelId` or `courseSearchString` to filter courses.
   * @returns {Promise<Object>} An object containing a list of courses, levels
   *        and other available options values to pass to getCourseTimetable()
   *
   * @example
   *
   *  // Get Course & Level Options
   *  const courseOptions = await scraper.getCourseOptions()
   *  console.log(courseOptions.courses)
   *  console.log(courseOptions.levels)
   *
   *  // Get options with course search filter
   *  const filteredCourseOptions = await scraper.getCourseOptions({
   *    courseSearchString: 'Computer Science'
   *  })
   *
   *  // Get options with level filter
   *  const foundationCourseOptions = await scraper.getCourseOptions({
   *    levelId: '0'
   *  })
   */
  async getCourseOptions(opts = { levelId: null, courseSearchString: null }) {
    if (!opts) opts = {};
    if (!opts.levelId) opts.levelId = null;
    if (!opts.courseSearchString) opts.courseSearchString = null;

    await this._ensureInitialisedAndAuthenticated();

    await this.page.waitForSelector("#LinkBtn_pos");
    await this.page.click("#LinkBtn_pos");

    if (opts.levelId) {
      await this.page.waitForSelector("#dlFilter");
      await this.page.select("#dlFilter", opts.levelId);
      await this.page.waitForNetworkIdle();
    }

    if (opts.courseSearchString) {
      await this.page.waitForSelector("#tWildcard");
      await this.page.type("#tWildcard", opts.courseSearchString);
      await this.page.click("#bWildcard");
    }

    await this.page.waitForNetworkIdle();

    return await this.page.evaluate(() => {
      const courseList = document.querySelector("#dlObject");

      return {
        levels: Array.from(document.getElementById("dlFilter").children)
          .map((level) => {
            return {
              name: level.textContent,
              id: level.getAttribute("value"),
            };
          })
          .filter((level) => level.id !== ""),
        courses: Array.from(courseList.children).map((courseOption) => {
          return {
            id: courseOption.value,
            name: courseOption.textContent,
          };
        }),
        periods: Array.from(document.getElementById("lbWeeks").children)
          .map((period) => {
            return {
              id: period.value,
              name: period.textContent,
            };
          })
          .filter((period) => period.id !== ""),
        days: Array.from(document.getElementById("lbDays").children)
          .map((day) => {
            return {
              id: day.value,
              name: day.textContent,
            };
          })
          .filter((day) => day.id !== ""),
      };
    });
  }

  /**
   * Retreive a timetable for one or more courses.
   * @param {Object} opts Object containing a list of courseIds, periodIds and
   * dayIds identifying the timetable to retrieve. These IDs can be found by calling `getCourseOptions()`.
   */
  async getCourseTimetable(
    opts = { courseIds: [], periodId: "1-51", daysId: "1-7" }
  ) {
    if (!opts) opts = {};
    if (!opts.courseIds) opts.courseIds = [];
    if (!opts.periodId) opts.periodId = "1-51";
    if (!opts.daysId) opts.daysId = "1-7";

    if (opts.courseIds.length === 0) {
      throw NO_COURSES_SELECTED;
    }

    if (opts.courseIds.length > 8) {
      throw TOO_MANY_COURSES;
    }

    await this._ensureInitialisedAndAuthenticated();

    // Navigate to Course Timetable Page
    await this.page.waitForNetworkIdle();
    await this.page.waitForSelector("#LinkBtn_pos");
    await this.page.click("#LinkBtn_pos");

    // Select Courses
    await this.page.waitForNetworkIdle();
    await this.page.waitForSelector("#dlObject");
    await this.page.select("#dlObject", ...opts.courseIds);

    // Select Period
    await this.page.waitForNetworkIdle();
    await this.page.waitForSelector("#lbWeeks");
    await this.page.select("#lbWeeks", opts.periodId);

    // Select Days
    await this.page.waitForNetworkIdle();
    await this.page.waitForSelector("#lbDays");
    await this.page.select("#lbDays", opts.daysId);

    // Click Submit
    await this.page.waitForNetworkIdle();
    await this.page.waitForSelector("#bSubmit");
    await this.page.click("#bSubmit");

    throw NOT_IMPLIMENTED;
  }

  async getModuleOptions() {
    throw NOT_IMPLIMENTED;
  }

  async getModuleTimetable() {
    throw NOT_IMPLIMENTED;
  }

  async getStudentOptions() {
    throw NOT_IMPLIMENTED;
  }

  async getStudentTimetable() {
    throw NOT_IMPLIMENTED;
  }

  async close() {
    await this.browser.close();
  }
}
