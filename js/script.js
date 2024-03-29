let login = document.getElementById("login");
let err = document.querySelector('.form__err');
const url = "https://bot.diffind.com/api/api/";


function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

login.addEventListener("click", async (e) => {
    e.preventDefault();

    let input = [...document.querySelectorAll('.form__input')].map((a) => {
      let obj = {};
      obj[a.dataset.json] = a.value;
      return obj;
    });

    let data = {};
    input.map((el) => {
      Object.assign(data, el)
    })

    if (validateEmail(data.orgEmail)) {
      document.querySelector('[data-json="orgEmail"]').classList.remove("form__input-invalid");
      err.innerText = "";

      let methodName = "getEventId";

      let response = await fetch(url + methodName, {
          method: "POST",
          headers: {
              "Content-Type": "application/json;charset=utf-8"
          },
          body: JSON.stringify(data)
      });

      // let response = await fetch("./test.json");
      let result = await response.json();

      let eventId = result.eventId;
      localStorage.setItem("eventId", eventId);
      localStorage.setItem("apiKey", eventId);
    } else {
      document.querySelector('[data-json="orgEmail"]').classList.add("form__input-invalid");
      err.innerText = "Введите почту в корректном формате"
    }



})
