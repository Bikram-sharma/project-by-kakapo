import { API_KEY } from "./config.js";

const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const imageContainer = document.getElementById("imageContainer");
const logOutButton = document.getElementById("logout");
const userName = document.getElementById("username");

if (!localStorage.getItem("user")) {
  window.location.href = "./login.html";
}

userName.innerText = `${localStorage.getItem("user")}!` || "Guest";

function search(query) {
  axios
    .get(`https://api.pexels.com/v1/search?query=${query}&per_page=20`, {
      headers: {
        Authorization: API_KEY,
      },
    })
    .then(function (response) {
      const pics = response.data.photos;
      imageContainer.innerHTML = "";

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
        card.className = "h-[250px] bg-white rounded shadow overflow-hidden";

        const img = document.createElement("img");
        img.src = photo.src.medium;
        img.alt = photo.photographer;
        img.className = "w-full h-full object-cover";

        card.appendChild(img);
        imageContainer.appendChild(card);
      });
    })
    .catch(function (error) {
      console.error("Error fetching images:", error);
    });
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

  localStorage.setItem("user", "");
  setTimeout(() => (window.location.href = "./login.html"), 1000);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    verifySearch();
  }
});
