import { Auth, logOut } from "./auth.js";
import { HomePage } from "./home.js";
async function main() {
    let token = sessionStorage.getItem("token");
    if (!token) {
        await Auth();    
    } else {
       await HomePage();
       logOut()
    }
}

document.addEventListener('DOMContentLoaded',()=>{
    main();
})

