import { CountUp } from './CountUp.min.js';

function rand(min, max) {
  return Math.floor(Math.random() * (+max - +min) + +min)
}

function countDatesByInterval(d, interval = 10) {
  let dates = [];
  let test = [];
  let count = 0;

  // if (d.length > 1) {
    d = d.sort((a, b) => {
      let j = new Date(date.getYear(), date.getMonth(), date.getDay(), a[0], a[1], a[2]);
      let g = new Date(date.getYear(), date.getMonth(), date.getDay(), b[0], b[1], b[2]);
      return j.getTime() - g.getTime();

    })
  // }

  let startHour = d[0][0];
  let endHour = d[d.length - 1][0];

  if (startHour === endHour) {
    startHour -= 1;
    endHour += 1;
  }

  let newDate = new Date();
  let oldDate = new Date();
  newDate.setSeconds(0);
  oldDate.setSeconds(0);
  oldDate.setMinutes(0);
  oldDate.setHours(startHour);


  for (let i = startHour; i <= endHour; i++) {
    newDate.setHours(i);
    ticks.push([i - 3,0,0]);

    for (let j = 0; j < 60 / interval; j++) {
      newDate.setMinutes(j * interval);

      if (oldDate.getMinutes() === (60 - interval)) {
        oldDate.setHours(oldDate.getHours() - 1)
      }

      count = d.filter((e) => {
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
      dates.push([[newDate.getHours(),newDate.getMinutes(), 0, 0],count])


    }

    oldDate.setHours(i + 1);

  }

  return dates;

}


function drawBasic() {
  var data = new google.visualization.DataTable();
  data.addColumn('timeofday', 'Время');
  data.addColumn('number', 'Количество пользователей');

  data.addRows(dat);
  var options = {
    colors: ['#5E04D5'],
    // legend: 'none',
    chartArea: {
      bottom: 50,
      width: '90%',
      height: '80%',
    },
    height: 300 ,
    legend: {
      position: 'in'
    },
    fontName: 'Montserrat',
    hAxis: {
       format: 'HH:mm',
       ticks:ticks,

    },

  };

  var chart = new google.visualization.LineChart(document.getElementById('chart_div'));

  chart.draw(data, options);
}

const date = new Date();

const options = {
  startVal: 5,
  duration: 4,
};

const ticks = []
let dat = []


window.onload = async () => {
  // const url = "https://bot.diffind.com/api/api/";
  const url = "https://localhost:5001/api/api/";

  const apiKey = localStorage.getItem("apiKey");
  const eventId = localStorage.getItem("eventId");

  let methodName = `getInfoAboutUsers?eventId=${eventId}&apiKey=${apiKey}`;


  let response = await fetch(url + methodName, {
      method: "POST",
      headers: {
          "Content-Type": "application/json;charset=utf-8"
      },
      // body: JSON.stringify(data)
  });

  let result = await response.json();

  new CountUp('totalCount', result.totalCount, options).start();
  new CountUp('networkingCount', result.networking, options).start();
  new CountUp('meetCount', result.meet, options).start();
  new CountUp('contactCount', result.contacts, options).start();
  new CountUp('bookCount', result.averageContacts, options).start();


  methodName = `getUserActivity?eventId=${eventId}&apiKey=${apiKey}`;


  response = await fetch(url + methodName, {
      method: "POST",
      headers: {
          "Content-Type": "application/json;charset=utf-8"
      },
  });

  result = await response.json();

  result.forEach((e) => {
    let temp = new Date(e);
    dat.push([temp.getHours(), temp.getMinutes(), temp.getSeconds()])
  })



  dat = countDatesByInterval(dat, 5);


  google.charts.load('current', {'packages':['corechart']});

  google.charts.setOnLoadCallback(drawBasic);

  let question = document.getElementById("question");
  let participant = document.getElementById("participant");
  let survey_type = document.getElementById("survey_type");
  let results = document.getElementById("results");

  methodName = `getSurvey?eventId=${eventId}&apiKey=${apiKey}`;


  response = await fetch(url + methodName, {
      method: "POST",
      headers: {
          "Content-Type": "application/json;charset=utf-8"
      },
  });

  result = await response.json();




  result.sv.forEach((e) => {
    let sp = document.createElement("span");
    sp.innerText = e.question;
    question.appendChild(sp);

    let sp1 = document.createElement("span");
    sp1.innerText = e.countOfRespondents
    participant.appendChild(sp1);


    let sp2 = document.createElement("span");
    sp2.innerText = e.type
    survey_type.appendChild(sp2);

    let sp3 = document.createElement("span");
    sp3.innerText = "скачать в xls (временно не доступно)"
    results.appendChild(sp3);

  })


  let ev = document.getElementById("event");
  let parent = document.getElementById("parent");
  let child = document.getElementById("child");
  let offer = document.getElementById("offer");

  methodName = `getTags?eventId=${eventId}&apiKey=${apiKey}`;


  response = await fetch(url + methodName, {
      method: "POST",
      headers: {
          "Content-Type": "application/json;charset=utf-8"
      },
  });

  result = await response.json();

  let sp4 = document.createElement("span");
  sp4.innerText = result.nameOdEvent;
  ev.appendChild(sp4);

  let sp5 = document.createElement("span");
  sp5.innerText = result.parentTags.join(", ")
  parent.appendChild(sp5);


  let sp6 = document.createElement("span");
  sp6.innerText = result.childTags.join(", ")
  child.appendChild(sp6);

  let sp7 = document.createElement("span");
  sp7.innerText = "скачать в xls (временно не доступно)"
  offer.appendChild(sp7);


}
