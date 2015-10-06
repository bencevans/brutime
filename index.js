var Request = require('request')
var Cheerio = require('cheerio')
var debug = require('debug')('brutime')
var _ = require('underscore')

function cheerioFormBodyToRequest (cheerioForm) {
  var output = {}
  cheerioForm.forEach(function (item) {
    output[item.name] = item.value
  })
  return output
}

function BruTime (options) {
  var BASE_URL = 'https://teaching.brunel.ac.uk/SWS-' + (options.year || '1516') + '/'
  var ACTION_URL = BASE_URL + 'default.aspx'

  var self = this

  var request = Request.defaults({
    followAllRedirects: true,
    jar: Request.jar()
  })

  var nextFormData = {}

  /*
  * Options Validation
  */

  // Student ID
  if (typeof options.login !== 'string' || !options.login) {
    throw new Error('login required')
  }
  // Password
  if (typeof options.password !== 'string' || !options.password) {
    throw new Error('password required')
  }

  /*
  * Private (Low-Level) Methods
  */

  // POST Based Requests, Fills in VIEWSTATE etc.
  this._action = function (formData, callback) {
    var req = request({
      method: 'POST',
      uri: ACTION_URL
    }, function (err, res, body) {
      if (err) {
        return callback(err)
      }
      var $ = Cheerio.load(body)
      nextFormData = cheerioFormBodyToRequest($('form').serializeArray())
      callback(err, res, body, $)
    })

    var form = req.form()

    // Flatten arrays into separate keys and add to form
    _.each(_.extend(nextFormData, formData), function (value, key) {
      if (value instanceof Array) {
        _.each(value, function (value) {
          form.append(key, value)
        })
      } else {
        form.append(key, value)
      }
    })
  }

  // Handles Login if the first request redirects to login page (err, req, res, body, $)
  this._authenticatedAction = function (formData, callback) {
    this._action(formData, function (err, res, body, $) {
      if (err) {
        return callback(err)
      }
      if (res.request.path.match(/login\.aspx/)) {
        self.login(function (err) {
          if (err) {
            return callback(err)
          }
          self._authenticatedAction(formData, callback)
        })
      } else {
        callback(null, res, body, $)
      }
    })
  }

  /*
  * Public Methods
  */

  this.login = function (callback) {
    request(BASE_URL + 'login.aspx', function (req, res, body) {
      if (res.request.path.match(/\/login.aspx/)) {
        debug('Authentication Required')
      }

      var $ = Cheerio.load(body)
      var formData = cheerioFormBodyToRequest($('form').serializeArray())
      debug('formData: ', formData)

      request({
        method: 'POST',
        uri: BASE_URL + 'login.aspx',
        form: _.extend(formData, {
          tUserName: options.login,
          tPassword: options.password,
          bLogin: 'Login'
        })
      }, function (err, res, body) {
        if (err) {
          return callback(err)
        }
        if (res.request.path.match(/\/login.aspx/)) {
          return callback(new Error('invalid login/password'))
        }
        var $ = Cheerio.load(body)
        nextFormData = cheerioFormBodyToRequest($('form').serializeArray())
        callback()
      })
    })
  }

  this.listMyModules = function (callback) {
    this._authenticatedAction({
      __EVENTTARGET: 'LinkBtn_studentmodules'
    }, function (err, res, body, $) {
      if (err) {
        return callback(err)
      }
      var myModules = $('select[name="dlObject"] option').toArray().map(function (moduleOptionEl) {
        return moduleOptionEl.attribs.value
      })
      callback(null, myModules)
    })
  }

  this.getMyTimetable = function (options, callback) {
    // options = {
    //   period: '1-12',
    //   days: '1-7'
    // }
    self.listMyModules(function (err, myModules) {
      if (err) {
        return callback(err)
      }
      self._authenticatedAction({
        tLinkType: 'studentmodules',
        'dlObject': myModules,
        lbWeeks: options.period || '1-12',
        lbDays: options.days || '1-7',
        dlType: 'TextSpreadsheet;swsurl;SWSCUST Object TextSpreadsheet&combined=yes',
        bGetTimetable: 'View Timetable'
      }, function (err, res, body, $) {
        if (err) {
          return callback(err)
        }
        callback(null, [[], [], [], [], [], [], []])
      })
    })
  }

  this.listModules = function (options, callback) {
    // options = {
    //   level: '2', // 0 = Foundation, 1 = Level 1, 2 = Level 2, 2p = Placement, 3 = Level 3 ...
    //   query: 'CS' // Search Query Filter
    // }
  }

  this.getModulesTimetable = function (options, callback) {
    // options = {
    //   modules: ['CS2001'],
    //   period: '1-12',
    //   days: '1-7'
    // }
  }

  return this
}

module.exports = BruTime
