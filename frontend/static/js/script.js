const rootElement = document.getElementById("root")
let usersData = []

console.log("loaded")

const formComponent = () => `
    <form id="form">
        <input type="text" name="name" placeholder="enter name">
        <input type="password" name="password" placeholder="enter password">
        
        <button>Send</button>
    </form>
`

const userCardComponent = (userData) => `
    <div class="card">
        <h3>${userData.id}</h3>
        <h2>${userData.name}</h2>
    </div>
`

const init = () => {
    

    rootElement.insertAdjacentHTML("beforeend", formComponent())

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
            .then(resJson => {
                if (resJson === "ok") {
                    usersData.push(userCardComponent({
                        id: usersData.length + 1,
                        name: userName
                    }))
                rootElement.insertAdjacentHTML("beforeend", usersData[usersData.length - 1])
                }
            })
    })

    fetch("/users")
        .then(res => res.json())
        .then (data => {
            usersData = data.map(user => userCardComponent(user))
            console.log(usersData)
            rootElement.insertAdjacentHTML("beforeend", usersData.join(""))
        })
}

init()