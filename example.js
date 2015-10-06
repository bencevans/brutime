var BruTime = require('./')

var timetable = new BruTime({
  login: process.env.LOGIN,
  password: process.env.PASSWORD
})

timetable.login(function (err) {
  if (err) {
    throw err
  }
  console.log('Logged In')

  timetable.listMyModules(function (err, myModules) {
    if (err) {
      throw err
    }
    console.log('My Modules: ' + myModules.join(', '))

    timetable.getMyTimetable({
      period: 't', // t = this week, n = next week, 3 = or any number is the week number, 1-12 = term 1, 1-52 = all terms
      days: '1-5' // 1-5 = Monday to Friday, 1-7 = Monday to Sunday, 1 = Monday, 2 = Tuesday ...
    }, function (err, timetable) {
      if (err) {
        throw err
      }
      console.log(timetable)
    })
  })
})
