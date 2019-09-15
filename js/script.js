let login = document.getElementById("login");
const url = "https://bot.diffind.com/api/api/";


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

    let methodName = "getEventId";

    let response = await fetch(url + methodName, {
        method: "POST",
        headers: {
            "Content-Type": "application/json;charset=utf-8"
        },
        body: JSON.stringify(data)
    });

    let response = await fetch("./test.json");
    let result = await response.json();

    let eventId = result.eventId;
    localStorage.setItem("eventId", eventId);
})
