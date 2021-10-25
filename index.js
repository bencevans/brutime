import puppeteer from "puppeteer";
import { LOGIN_REQUIRED, INVALID_CREDENTIALS } from "./errors.js";

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
  async init(puppeteerOptions = {}) {
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
   * Ensure that the browser has been initialised and that the user is logged in
   */
  async ensureInitialisedAndAuthenticated() {
    await this._ensureInitialised();

    await this.page.goto(this.baseUrl);

    if (this.page.url().includes("Login")) {
      throw LOGIN_REQUIRED;
    }

    return true;
  }

  async getCourseOptions(opts = { levelId: null, courseSearchString: null }) {
    if (!opts) opts = {};
    if (!opts.levelId) opts.levelId = null;
    if (!opts.courseSearchString) opts.courseSearchString = null;

    await this.ensureInitialisedAndAuthenticated();

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

    await this.page.waitForSelector("#dlObject");

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
      };
    });
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

    await this.page.waitForSelector("#tUserName");
    await this.page.focus("#tPassword");
    await this.page.type("#tPassword", password);

    await this.page.click("#bLogin");

    await this.page.waitForNetworkIdle();

    if (this.page.url().toLowerCase().includes("login")) {
      throw INVALID_CREDENTIALS;
    }
  }

  /**
   * List all courses
   * @returns {Promise<Array<{id: String, name: String}>>}
   */
  async listCourses() {
    await this.ensureInitialisedAndAuthenticated();

    await this.page.waitForSelector("#LinkBtn_pos");
    await this.page.click("#LinkBtn_pos");

    await this.page.waitForSelector("#dlObject");

    return await this.page.evaluate(() => {
      const courseList = document.querySelector("#dlObject");

      return Array.from(courseList.children).map((courseOption) => {
        return {
          id: courseOption.value,
          name: courseOption.textContent,
        };
      });
    });
  }

  /**
   * List all rooms
   * @returns {Promise<Array<{id: String, name: String}>>}
   */
  async listRooms() {
    await this.ensureInitialisedAndAuthenticated();

    await this.page.waitForSelector("#LinkBtn_locationsbyzone");
    await this.page.click("#LinkBtn_locationsbyzone");

    await this.page.waitForSelector("#dlObject");

    return await this.page.evaluate(() => {
      const courseList = document.querySelector("#dlObject");

      return Array.from(courseList.children).map((courseOption) => {
        return {
          id: courseOption.value,
          name: courseOption.textContent,
        };
      });
    });
  }

  async close() {
    await this.browser.close();
  }
}
