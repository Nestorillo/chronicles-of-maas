document.addEventListener("DOMContentLoaded", function () {
    const loginBtn = document.getElementById("nav-login");
    const registerBtn = document.getElementById("nav-register");
    const logoutBtn = document.getElementById("nav-logout");
    const deleteBookBtn = document.getElementById("delete-book");

    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
        if (loginBtn) loginBtn.style.display = "none";
        if (registerBtn) registerBtn.style.display = "none";
        if (logoutBtn) logoutBtn.style.display = "inline";
        if (deleteBookBtn) deleteBookBtn.style.display = "inline-block";

        if (logoutBtn) {
            logoutBtn.addEventListener("click", function (e) {
                e.preventDefault();
                localStorage.removeItem("accessToken");
                localStorage.removeItem("user");
                window.location.href = "./index.html";
            });
        }
    } else {
        if (logoutBtn) logoutBtn.style.display = "none";
        if (loginBtn) loginBtn.style.display = "inline";
        if (registerBtn) registerBtn.style.display = "inline";
        if (deleteBookBtn) deleteBookBtn.style.display = "none";
    }
});