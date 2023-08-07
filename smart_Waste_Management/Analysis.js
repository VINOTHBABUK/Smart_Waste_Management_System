const firebaseConfig = {
  apiKey: "AIzaSyCEsylIm412gqUfcc9gnPTMmHJbX0O0KaE",
  authDomain: "dustbin-monitor-1102f.firebaseapp.com",
  databaseURL: "https://dustbin-monitor-1102f-default-rtdb.firebaseio.com",
  projectId: "dustbin-monitor-1102f",
  storageBucket: "dustbin-monitor-1102f.appspot.com",
  messagingSenderId: "5065718611",
  appId: "1:5065718611:web:1aa84f7f92744a7f8e3fa6",
  measurementId: "G-YGTVSNME62",
};
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const barChartCanvas1 = document.getElementById("barChart1").getContext('2d');
const barChartCanvas2 = document.getElementById("barChart2").getContext('2d');
const barChartCanvas3 = document.getElementById("barChart3").getContext('2d');
//const barChartCanvas4 = document.getElementById("barChart4");
    var purple_orange_gradient = barChartCanvas2.createLinearGradient(0, 0, 0, 600);
    purple_orange_gradient.addColorStop(0, '#97ABFF');
    purple_orange_gradient.addColorStop(1, '#97ABFF');
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

function fetchCityDropdownValues() {
  const cityDropdown = document.getElementById("cityDropdown");
  const areaDetailRef = database.ref("area_detail");
  areaDetailRef.once("value", (snapshot) => {
    const uniqueCities = new Set();
    snapshot.forEach((childSnapshot) => {
      const data = childSnapshot.val();
      const city = data.City;
      if (city) {
        uniqueCities.add(city);
      }
    });
    uniqueCities.forEach((city) => {
      const option = document.createElement("option");
      option.value = city;
      option.textContent = city;
      cityDropdown.appendChild(option);
    });
    const dropdownRow = document.getElementById("dropdownRow");
    dropdownRow.style.display = "table-row";
  });
}
fetchCityDropdownValues();
function filterTableByCity(selectedCity) {
  const rows = table.querySelectorAll("tr");
  let filteredRowCounter = 0;
  rows.forEach((row, index) => {
    const cityCell = row.querySelector("td:nth-child(3)");
    const cityName = cityCell.textContent.trim();

    if (selectedCity === "" || selectedCity === cityName) {
      row.style.display = "table-row";

      const snoCell = row.querySelector("td:nth-child(1)");
      snoCell.textContent = ++filteredRowCounter;
    } else {
      row.style.display = "none";
    }
  });
}
const table = document.querySelector("table > tbody");
const addButton = document.getElementById("addButton");
const formContainer = document.getElementById("formContainer");
const dataForm = document.getElementById("dataForm");
const cancel = document.getElementsByClassName("can")[0];
addButton.addEventListener("click", () => {
  formContainer.style.display = "flex";
});
cancel.addEventListener("click", () => {
  formContainer.style.display = "none";
});
dataForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const address = document.getElementById("address").value;
  const city = document.getElementById("city").value;
  const level = document.getElementById("level").value;
  const weight = document.getElementById("weight").value;
  const status = document.getElementById("status").value;

  var addressName = document.getElementById("address").value;

  //weekly

  if (addressName) {
    // Generate 4 random values for the new address
    const randomValues = generateRandomData(4);

    // Create a new reference to the Weekly node for the selected city
    const weeklyRef = database.ref(`Weekly/${address}`);

    // Store the random values under Week1, Week2, Week3, and Week4
    for (let i = 1; i <= 4; i++) {
      weeklyRef
        .child(`Week${i}`)
        .set(randomValues[i - 1])
        .then(() => {
          console.log(`Week${i} values for ${address} added successfully.`);
        })
        .catch((error) => {
          console.error(`Error adding Week${i} values for ${address}: `, error);
        });
    }
  }
  //level
  var lvl = document.getElementById("level").value;
  var dbRef = firebase.database().ref("Levels");
  dbRef.child(addressName).once("value", function (snapshot) {
    console.log("correct??????");
    if (snapshot.exists()) {
      dbRef
        .child(addressName)
        .update(lvl)
        .then(function () {
          console.log("Address updated successfully!");
        })
        .catch(function (error) {
          console.error("Error updating address: ", error);
        });
    } else {
      dbRef
        .child(addressName)
        .set(lvl)
        .then(function () {
          console.log("Address added successfully!");
        })
        .catch(function (error) {
          console.error("Error adding address: ", error);
        });
    }
  });
  function generateRandomValue() {
    return Math.floor(Math.random() * 100) + 1;
  }

  var values = {};

  for (let i = 1; i <= 5; i++) {
    values["value" + i] = generateRandomValue();
  }

  var dbRef1 = firebase.database().ref("Address");

  dbRef1.child(addressName).once("value", function (snapshot) {
    if (snapshot.exists()) {
      dbRef1
        .child(addressName)
        .update(values)
        .then(function () {
          console.log("Address updated successfully!");
        })
        .catch(function (error) {
          console.error("Error updating address: ", error);
        });
    } else {
      dbRef1
        .child(addressName)
        .set(values)
        .then(function () {
          console.log("Address added successfully!");
        })
        .catch(function (error) {
          console.error("Error adding address: ", error);
        });
    }
  });

  database.ref("sno_counter").transaction(
    (currentSno) => {
      return (currentSno || 0) + 1;
    },
    (error, committed, snapshot) => {
      if (error) {
        console.log("Error incrementing sno counter: " + error);
      } else if (committed) {
        const sno = snapshot.val();
        const data = {
          sno: sno,
          Address: address,
          City: city,
          Level: level,
          Weight: weight,
          Status: status,
        };
        console.log(data);
        database.ref("area_detail").push(data);
      }
    }
  );

  dataForm.reset();
  formContainer.style.display = "none";
});

// let day = 1;
let sum = 0;
let prev = 0;
// let weekValues = [];
// let weekNumber = 1;

// setInterval(() => {
//   database
//     .ref(`Address/Gents Hostel`)
//     .update({ [`value${day}`]: sum ? sum : prev });

//   console.log("day " + day + " completed ", sum);
//   sum = 0;

//   if (day < 6) {
//     day++;
//   } else {
//     day = 1;
//     const simple = database
//       .ref("Address/Gents Hostel")
//       .on("value", (snapshot) => {
//         const values = Object.values(snapshot.val());
//         const weeklyAverage = values.reduce((acc, a) => acc + a, 0) / 6;

//         const databaseRef = firebase.database().ref(`Weekly/Gents Hostel`);
//         databaseRef
//           .child(`Week${weekNumber}`)
//           .set(weeklyAverage)
//           .then(() => {
//             console.log(`Week${weekNumber} average stored successfully.`);
//           })
//           .catch((error) => {
//             console.error(`Error storing Week${weekNumber} average:`, error);
//           });

//         console.log(`Week${weekNumber} average calculated: `, weeklyAverage);

//         weekNumber++;
//         weekValues = [];

//         if (weekNumber > 5) {
//           weekNumber = 1;
//         }
//       });

//     weekValues = [];
//   }

//   weekValues.push(sum);
// }, 1000 * 10);

const levelRef = database.ref("sensor/Level").on("value", (snapshot) => {
  const levelValue = snapshot.val();
  var Address = document.getElementById("address").value;
  console.log(levelValue, prev, sum);

  if (levelValue === 0) {
    sum += prev;
  }

  prev = levelValue;

  const levelNumber = parseFloat(levelValue);
  // const addressCells = document.querySelectorAll(".address-cell");

  database
    .ref("area_detail/-Nb0emh-D4benuOBDLu1")

    .update({ Level: levelValue, Weight: levelValue });
  const databaseRef = firebase.database().ref("Levels");
  console.log("worked");
  function updateGentsHostelLevel(levelValue) {
    const gentsHostelLevel = levelValue; // Modify this calculation as per your requirement
    databaseRef
      .child("Gents Hostel")
      .set(gentsHostelLevel)
      .then(() => {
        console.log("GentsHostel level updated successfully.");
      })
      .catch((error) => {
        console.error("Error updating Gents_Hostel level:", error);
      });

    const database1 = firebase.database().ref("bin");

    const binchange = levelValue;
    database1.child("bin1/level").set(binchange);
  }
  updateGentsHostelLevel(levelValue);

  if (levelNumber > 75) {
    database.ref("area_detail/-Nb0emh-D4benuOBDLu1").update({ Status: "high" });
  } else if (levelNumber >= 50 && levelNumber <= 75) {
    database
      .ref("area_detail/-Nb0emh-D4benuOBDLu1")
      .update({ Status: "Medium" });
  } else {
    database.ref("area_detail/-Nb0emh-D4benuOBDLu1").update({ Status: "Low" });
  }
});

let currAddr = "";
function fetchSensorData() {
  database.ref("area_detail").on("value", (snapshot) => {
    table.innerHTML = "";

    snapshot.forEach((childSnapshot) => {
      const data = childSnapshot.val();
      const { sno, Address, City, Level, Weight, Status } = data;

      const markup = `
            <tr>
              <td>${sno}</td>
              <td class="address-cell">${Address}</td>
              <td>${City}</td>
              <td>${Level}</td>
              <td>${Weight}</td>
              <td>${Status}</td>
            </tr>
          `;

      table.insertAdjacentHTML("beforeend", markup);

      const addressCells = document.querySelectorAll(".address-cell");

      addressCells.forEach((cell) => {
        cell.addEventListener("click", () => {
          const address = cell.textContent;
          currAddr = address;
          setTimeout(() => {
            updateChart(`${address}`);
            // update1( barChart2);
          }, 20);
          //  alert(`Clicked address: ${address}`);

          scrollToTop("top");
        });
      });
      const firstRow = document.querySelector("table > tbody > tr");
      if (firstRow) {
        const cells = firstRow.querySelectorAll("td");
        if (cells.length >= 4) {
          firstAddressName = cells[1].textContent;
          firstLevelValue = cells[3].textContent;
          currAddr = firstAddressName;
        }
      }

      //  updateChart(firstAddressName);

      updateFillLevel(parseFloat(firstLevelValue));

      // updateChart(firstAddressName);

      function scrollToTop(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    });
  });
}

fetchSensorData();
cityDropdown.addEventListener("change", () => {
  const selectedCity = cityDropdown.value;
  filterTableByCity(selectedCity);
});

let barChart1, barChart2, barChart3, barChart4;

database.ref("Address/Gents Hostel").on("value", (list) => {
  updateChart(currAddr);
});
function updateChart(selectedCity) {
  console.log("CHART: ", selectedCity);
  const cityRef = database.ref(`Address/${selectedCity}`);
  // console.log(cityRef);
  cityRef
    .once("value")
    .then((snapshot) => {
      console.log("hi");
      const data = snapshot.val();
      const labels = Object.keys(data);
      const values = Object.values(data);

      barChart1.data.labels = ["sun", "Mon", "Tue", "Wed", "Thu", "Fri"];
      barChart1.data.datasets[0].data = values;
      barChart1.update();

      const weeklyValues = [];
      const weeklyRef = database.ref(`Weekly/${selectedCity}`);

      for (let i = 1; i <= 4; i++) {
        weeklyRef
          .child(`Week${i}`)
          .once("value")
          .then((snapshot) => {
            const weekValue = snapshot.val();
            weeklyValues.push(weekValue);
          })
          .then(() => {
            if (weeklyValues.length === 4) {
              barChart2.data.labels = ["Week1", "Week2", "Week3", "Week4"];
              barChart2.data.datasets[0].data = weeklyValues;
              barChart2.update();
            }
          });
      }

      barChart3.data.labels = ["Jan", "Feb", "Mar", "Apr"];
      barChart3.data.datasets[0].data = [23, 56, 78, 65];
      barChart3.update();
    })
    .catch((error) => {
      console.error("Error fetching data from Firebase:", error);
    });

  const levelRef = database.ref(`Levels/${selectedCity}`);

  levelRef.on("value", (snapshot) => {
    console.log("INFO ", selectedCity);
    const level = snapshot.val();

    if (level) {
      updateFillLevel(level);
    }
  });
}
function generateRandomData(length) {
  const data = [];
  for (let i = 0; i < length; i++) {
    data.push(Math.floor(Math.random() * 100));
  }
  return data;
}

barChart1 = new Chart(barChartCanvas1, {
  type: "bar",
  data: {
    labels: [],
    datasets: [
      {
        label: "DAY WISE",
        backgroundColor: purple_orange_gradient,
       hoverBackgroundColor: purple_orange_gradient,
       hoverBorderWidth: 2,
       hoverBorderColor: '#97ABFF',
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
        data: [],
      },
    ],
  },
  options: chartOptions,
});
barChart2 = new Chart(barChartCanvas2, {
  type: "bar",
  data: {
    labels: [],
    datasets: [
      {
        label: "WEEK WISE",
        backgroundColor: purple_orange_gradient,
               hoverBackgroundColor: purple_orange_gradient,
               hoverBorderWidth: 2,
               hoverBorderColor: '#97ABFF',
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
        data: [],
      },
    ],
  },
  options: chartOptions,
});
barChart3 = new Chart(barChartCanvas3, {
  type: "bar",
  data: {
    labels: [],
    datasets: [
      {
        label: "MONTH WISE",
        backgroundColor: purple_orange_gradient,
               hoverBackgroundColor: purple_orange_gradient,
               hoverBorderWidth: 2,
               hoverBorderColor: '#97ABFF',
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
        data: [],
      },
    ],
  },
  options: chartOptions,
});

const bin = document.getElementById("bin");
const percentage = document.getElementById("percentage");

function updateFillLevel(level) {
  bin.style.height = level + "%";
  percentage.textContent = level + "%";

  bin.className = level >= 75 ? "red-fill" : "blue-fill";
}

function fetchbinlevel() {
  const levelRef = database.ref("sensor/Level");

  levelRef.on("value", async (snapshot) => {
    const level = snapshot.val();

    if (level) {
      //  updateFillLevel(level);
      if (level >= 75) {
        await fetch(
          `http://127.0.0.1:3000/?phone=8056111363&message=the dustbin above the limit${level}`
        );
        console.log("message sent");
      }
    }
  });
}

fetchbinlevel();
const lineChartData = {
  labels: ["Label 1", "Label 2", "Label 3", "Label 4", "Label 5"],
  datasets: [
    {
      label: "Line Chart",
      data: [20, 15, 25, 10, 30],
      borderColor: "rgba(255, 99, 132, 1)",
      borderWidth: 2,
      fill: false,
    },
  ],
};
const lineChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      grid: {
        lineWidth: 2,
      },
    },
    y: {
      beginAtZero: true,
      grid: {
        lineWidth: 2,
      },
    },
  },
};
