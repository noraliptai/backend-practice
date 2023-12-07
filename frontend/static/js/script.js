console.log("loaded")

const formComponent = () => `
    <form id="form">
        <input type="text" name="name" placeholder="enter name">
        <input type="password" name="password" placeholder="enter password">
        
        <button>Send</button>
    </form>
`

const root = document.getElementById("root")

root.insertAdjacentHTML("beforeend", formComponent())

/* Megakadályozzuk a form alapvető működését, mert mi akarjuk definiálni hogy hogyan küldje az adatot */
const formElement = document.querySelector("form")
formElement.addEventListener("submit", (event) => {
    event.preventDefault()

    const userName = document.querySelector(`input[name="name"]`).value
    const userPassword = document.querySelector(`input[name="password"]`).value

    fetch("/users/new-user", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: userName,
            password: userPassword
        })
    })
        .then(res => res.json())
        .then(resJson => console.log(resJson))
})