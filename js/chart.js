
function rand(min, max) {
  return Math.floor(Math.random() * (+max - +min) + +min)
}


    // Load the Visualization API and the corechart package.
   google.charts.load('current', {'packages':['corechart']});

    // Set a callback to run when the Google Visualization API is loaded.
    google.charts.setOnLoadCallback(drawBasic);

    // Callback that creates and populates a data table,
    // instantiates the pie chart, passes in the data and
    // draws it.

    let date = new Date();
    let dates = [];
    let test = [];
    let count = 0;
    const interval = 10;
    for (let i = 1; i < 100; i++) {
      test.push([date.getHours() - 10 + rand(1,8), rand(1, 59), 0 ]);
    }
    console.log(test)

    test = test.sort((a, b) => {
      let j = new Date(date.getYear(), date.getMonth(), date.getDay(), a[0], a[1], a[2]);
      let g = new Date(date.getYear(), date.getMonth(), date.getDay(), b[0], b[1], b[2]);
      return j.getTime() - g.getTime();

    })

    let startHour = test[0][0];
    let endHour = test[test.length - 1][0];
    let newDate = new Date();
    let oldDate = new Date();
    newDate.setSeconds(0);
    oldDate.setSeconds(0);
    oldDate.setMinutes(0);
    oldDate.setHours(startHour);

    for (let i = startHour; i <= endHour; i++) {
      newDate.setHours(i);

      for (let j = 0; j < 60 / interval; j++) {
        newDate.setMinutes(j * interval);

        if (oldDate.getMinutes() === (60 - interval)) {
          oldDate.setHours(oldDate.getHours() - 1)
        }

        count = test.filter((e) => {
          let g = new Date();
          g.setHours(e[0]);
          g.setMinutes(e[1]);
          g.setSeconds(e[2]);
          return g < newDate && g > oldDate
        }).length

        if (oldDate.getMinutes() === (60 - interval)) {
          oldDate.setHours(oldDate.getHours() + 1)
        }


        oldDate.setMinutes(j * interval);
        dates.push([[newDate.getHours() - 3,newDate.getMinutes(),newDate.getSeconds()],count])


      }

      oldDate.setHours(i + 1);

    }







    function drawBasic() {
      var data = new google.visualization.DataTable();
      data.addColumn('timeofday', 'Время');
      data.addColumn('number', 'Количество пользователей');

      data.addRows(dates);
      var options = {
        hAxis: {
          title: 'Время',
        },
        colors: ['#5E04D5'],
        animation: {
          duration: 500,
          easing: 'inAndOut',
          startup: true
        },
        fontName: 'Montserrat'

      };

      var chart = new google.visualization.LineChart(document.getElementById('chart_div'));

      chart.draw(data, options);
  }
