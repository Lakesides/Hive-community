document.addEventListener("DOMContentLoaded", function () {
    const allButtons = document.querySelectorAll(".searchBtn");
    const searchBar = document.querySelector(".searchBar");
    const searchInput = document.getElementById("searchInput");
    const searchClose = document.getElementById("searchClose");

    for (var i = 0; i < allButtons.length; i++) {
        allButtons[i].addEventListener("click", function () {
            searchBar.style.visibility = "visible";
            searchBar.classList.add("open");
            this.setAttribute("aria-expanded", "true");
        });
    }

        searchClose.addEventListener("click", function () {
        searchBar.style.visibility = "hidden";
        searchBar.classList.remove("open");
        this.setAttribute("aria-expanded", "false");
    });
})

const sidebar = document.querySelector(".links");
sidebar.addEventListener("click", function() {
    document.querySelector(".sidebar").classList.toggle("active");
})


const toggleBtn = document.querySelector(".toggle-btn");
toggleBtn.addEventListener("click", function() {
    document.querySelector(".sidebar").classList.toggle("active");
})

const header = document.querySelector(".header__logo");
header.addEventListener("click", function() {
    document.querySelector(".sidebar").classList.toggle("active");
})

const bodyEl = document.querySelector(".body"); 
const iconEl = document.querySelector("#icon-el");
const mode = document.querySelector(".mode");
const sideBar = document.querySelector(".sidebar");

iconEl.addEventListener("click", function() {
    if (iconEl.classList.value === "bi bi-moon-stars-fill") {
        bodyEl.style.background = "black";
        mode.textContent = "Light Mode";
        sideBar.style.backgroundColor = "black";
        document.querySelector("#blog").style.color = "white";
        document.querySelector("#blogger").style.color = "white";
        document.querySelector("#about").style.color = "white";
        document.querySelector("#contact").style.color = "white";
    }

    else {
        bodyEl.style.backgroundColor = "ivory";
        mode.textContent = "Dark Mode";
        sideBar.style.backgroundColor = "blueviolet";
        document.querySelector("#blog").style.color = "black";
        document.querySelector("#blogger").style.color = "black";
        document.querySelector("#about").style.color = "black";
        document.querySelector("#contact").style.color = "black";
    }
    iconEl.classList.toggle("bi-sun");
});


