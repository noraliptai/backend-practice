const rootElement = document.getElementById("root")
let usersData = []

console.log("loaded")

const skeleton = () => `
  <header></header>
  <div class="cards"></div>
`

const formComponent = () => `
    <form>
        <div>
            <input type="text" name="name" placeholder="enter name">
            <input type="password" name="password" placeholder="enter password" required>
        </div>

        <button>send</button>
    </form>
`

const userCardComponent = (userData) => `
    <div class="card">
        <h3>${userData.id}</h3>
        <h2>${userData.name}</h2>
        <span class="material-symbols-outlined">delete</span>
    </div>
`


const init = () => {
    

    rootElement.insertAdjacentHTML("beforeend", skeleton())

    const headerElement = document.querySelector("header")
    const cardsElement = document.querySelector(".cards")
  
    headerElement.insertAdjacentHTML("beforeend", formComponent())

    const inputNameElement = document.querySelector('input[name="name"]')
    console.log(inputNameElement)
    inputNameElement.addEventListener('input', (event) => {
        if (event.data === "0" || event.data === "1" || event.data === "2") {
        console.log('cant write number')
        event.target.value = event.target.value.substring(0, event.target.value.length - 1)
        event.target.disabled = true
        }
    })

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
                usersData.push(userCardComponent(resJson))
                cardsElement.insertAdjacentHTML("beforeend", usersData[usersData.length - 1])
            })
    })

    fetch("/users")
        .then(res => {
            /* if (res.status === 201) return res.json()
            else throw Error ('error at reading file') */
            return res.json()
        })
        .then (data => {
            usersData = data.map(user => userCardComponent(user))
            console.log(usersData)
            cardsElement.insertAdjacentHTML("beforeend", usersData.join(""))
        })
        //.catch(err => console.log(err))
}

init()