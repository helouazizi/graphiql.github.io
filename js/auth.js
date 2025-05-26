import { HomePage } from "./home.js";
import { logincomponent ,showMessage} from "./component.js";
export async function Auth() {

let login = logincomponent()
document.body.append(login)

  let form = document.getElementById("login-form")



  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log(e);

    const email = document.getElementById("userinput").value
    const password = document.getElementById("passwordinput").value
    console.log(email, password, "values");


    const credentials = btoa(`${email}:${password}`);

    const res = await fetch("https://learn.zone01oujda.ma/api/auth/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${credentials}`
      },
      body: JSON.stringify({ email, password })

    });

    if (!res.ok) {
      showMessage("Invalid  Credentials ")
      return;
    }

    const data = await res.json();


    sessionStorage.setItem("token", data); // or data.token if response includes a ke
    await HomePage()
    logOut()
  });
}
export  function logOut(){
  
  let logout =  document.getElementById('logout')
 
  if (logout) {
    logout.addEventListener("click", ()=>{
      sessionStorage.clear()
      location.reload()
    })
  }

}


