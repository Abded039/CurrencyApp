"use strict";

// Selectors

let sections = document.querySelector(".sections");
let mainContent = document.querySelector(".mainContent");
let alertsDiv = document.querySelectorAll(".alert");
let shareBtnAlert = document.querySelector(".shareBtnAlert");
let arrayOfSections = Array.from(mainContent.children);
let headerSections = Array.from(sections.children);
let fromSelect = document.querySelector(".from-select");
let toSelect = document.querySelector(".to-select");
let arrows = document.querySelector(".arrows");

headerSections.forEach((section, index) => {
  section.addEventListener("click", (e) => {
    let targetedSection = e.currentTarget;
    if (!targetedSection.classList.contains("active")) {
      headerSections.forEach((section) => {
        section.classList.remove("active");
      });
      targetedSection.classList.add("active");
    }

    if (index == 0) {
      manageSwitching(index, arrayOfSections);
    } else if (index == 1) {
      manageSwitching(index, arrayOfSections);
    } else if (index == 2) {
      manageSwitching(index, arrayOfSections);
    } else {
      manageSwitching(index, arrayOfSections);
    }
  });
});

function manageSwitching(index, arrayOfSections) {
  arrayOfSections.forEach((section) => {
    if (index == arrayOfSections.indexOf(section)) {
      section.style.display = "block";
      section.style.left = "0%";
    } else {
      section.style.left = "105%";
      section.style.display = "none";
    }
  });
}

shareBtnAlert.addEventListener("click", () => {
  alertsDiv.forEach((alert) => alert.classList.toggle("opacity"));
});

fetch(`https://v6.exchangerate-api.com/v6/9108d07921bc0cecbdea94d1/latest/USD`)
  .then((response) => response.json())
  .then((rates) => {
    for (const rate in rates.conversion_rates) {
      let fromOption = document.createElement("option");
      fromOption.innerHTML = rate;
      fromOption.value = `${rate}`;
      fromSelect.appendChild(fromOption);
      let toOption = document.createElement("option");
      toOption.innerHTML = rate;
      toOption.value = rate;
      toSelect.appendChild(toOption);
      let dateSpan = document.querySelector(".dateSpan");
      let fullDate = rates.time_last_update_utc;
      dateSpan.innerHTML = fullDate.split(" ").splice(1, 3).join(" ");
    }
  });

document.querySelector(".inputAmount").addEventListener("input", (e) => {
  fetchData();
});

arrows.addEventListener("click", () => {
  let stock;
  stock = fromSelect.value;
  fromSelect.value = toSelect.value;
  toSelect.value = stock;
  let icon = arrows.querySelector("i");
  if (icon.classList.contains("rotateRight")) {
    icon.classList.remove("rotateRight");
    icon.classList.add("rotateLeft");
  } else {
    icon.classList.remove("rotateLeft");
    icon.classList.add("rotateRight");
  }
});

function fetchData() {
  let amount = document.querySelector(".inputAmount").value;
  let from = document.querySelector(".from-select").value;
  let to = document.querySelector(".to-select").value;
  let baseRate = document.querySelector(".baseRate");
  let convertedRate = document.querySelector(".convertedRate");
  let baseSpan = document.querySelector(".baseSpan");
  let rateSpan = document.querySelector(".rateSpan");

  if (amount && from && to) {
    fetch(
      `https://v6.exchangerate-api.com/v6/9108d07921bc0cecbdea94d1/latest/${from}`
    )
      .then((response) => response.json())
      .then((data) => {
        let allRates = data.conversion_rates;
        let convertedAmount = (allRates[to] * amount).toFixed(4);
        baseRate.innerHTML = `${amount}.00 ${from} =`;
        convertedRate.innerHTML = `${convertedAmount} ${to}`;
        baseSpan.innerHTML = `1 ${from} = ${allRates[to]} ${to}`;
        fetch(
          `https://v6.exchangerate-api.com/v6/9108d07921bc0cecbdea94d1/latest/${to}`
        )
          .then((response) => response.json())
          .then((secondData) => {
            let allRates = secondData.conversion_rates;
            rateSpan.innerHTML = `1 ${to} = ${allRates[from]} ${from}`;
          });
      });
  } else {
    baseRate.innerHTML = "";
    convertedRate.innerHTML = "Please Fill All The Fields";
    baseSpan.innerHTML = "";
    rateSpan.innerHTML = "";
  }
}
