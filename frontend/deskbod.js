import { API_KEY, WE_API_KEY } from "./config.js";

const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const imageContainer = document.getElementById("imageContainer");
const logOutButton = document.getElementById("logout");
const userName = document.getElementById("username");
const weather = document.getElementById("weather");

if (!sessionStorage.getItem("user")) {
  window.location.href = "./login.html";
}

userName.innerText = `${sessionStorage.getItem("user")}!` || "Guest";

function search(query) {
  axios
    .get(`https://api.pexels.com/v1/search?query=${query}&per_page=20`, {
      headers: {
        Authorization: API_KEY,
      },
    })
    .then(function (response) {
      const pics = response.data.photos;
      imageContainer.replaceChildren();
      if (pics.length === 0) {
        const message = document.createElement("div");
        message.className =
          "text-black col-span-4 text-center py-10 text-xl font-semibold";
        message.textContent = `No results found for "${query}". Try another keyword.`;
        imageContainer.appendChild(message);
        return;
      }

      pics.forEach((photo) => {
        const card = document.createElement("div");
        card.className =
          "h-[250px] bg-white rounded shadow grid items-center relative p-5 group";

        const layer = document.createElement("div");

        layer.className =
          "w-full h-full text-white bg-black/30 rounded p-2 absolute hidden group-hover:grid items-center text-center";

        // layer.innerHTML = "Click to download!";

        const downloadButton = document.createElement("button");
        downloadButton.className =
          "bg-blue-600 hover:bg-blue-700 w-40 h-10 m-auto rounded-full";
        downloadButton.innerText = "Download!";
        downloadButton.title = "Download";
        downloadButton.onclick = () => downloadImage(photo.src.large);

        const img = document.createElement("img");
        img.src = photo.src.medium;
        img.alt = photo.photographer;
        img.className = "w-full h-full object-cover absolute z-1";
        layer.appendChild(downloadButton);
        card.appendChild(img);
        card.appendChild(layer);
        imageContainer.appendChild(card);
      });
    })
    .catch(function (error) {
      console.error("Error fetching images:", error);
    });
}

function downloadImage(url) {
  fetch(url, { mode: "cors" })
    .then((res) => res.blob())
    .then((blob) => {
      const link = document.createElement("a");
      const objectUrl = URL.createObjectURL(blob);
      const imageName = url.split("?")[0].split("/").pop() || "image.jpg";
      link.href = objectUrl;
      link.download = imageName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(objectUrl);
    })
    .catch((err) => console.error("Download failed:", err));
}

const defaultKeywords = [
  "nature",
  "travel",
  "mountains",
  "cityscape",
  "wallpapers",
];
const randomQuery =
  defaultKeywords[Math.floor(Math.random() * defaultKeywords.length)];
search(randomQuery);

const verifySearch = () => {
  const query = searchInput.value.trim();
  if (!query) {
    Toastify({
      text: "Please type something!",
      duration: 2000,
      gravity: "top", // top or bottom
      position: "center", // left, center or right
      backgroundColor: "green",
    }).showToast();
    return;
  } else {
    search(query);
  }
};

searchButton.addEventListener("click", verifySearch);

logOutButton.addEventListener("click", () => {
  Toastify({
    text: "Logged out successfully!",
    duration: 2000,
    gravity: "top", // top or bottom
    position: "center", // left, center or right
    backgroundColor: "green",
  }).showToast();

  sessionStorage.setItem("user", "");
  setTimeout(() => (window.location.href = "./login.html"), 1000);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    verifySearch();
  }
});

// fro weather

axios
  .get(
    `https://api.openweathermap.org/data/2.5/weather?lat=27.4713546&lon=89.6336729&appid=${WE_API_KEY}&units=metric`
  )
  .then((response) => {
    let place = response.data.name;
    let temperature = response.data.main.temp;
    let description = response.data.weather[0].description;
    const date = new Date().toDateString();

    weather.innerText = ` ${date} ${place} ${temperature}°C ${description}`;
    console.log(response.data.name);
  });
