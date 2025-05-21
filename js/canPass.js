const accessToken = localStorage.getItem("accessToken");

if(accessToken == null){
    window.location.href = "./index.html"
}