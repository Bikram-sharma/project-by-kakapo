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
        card.className = "h-[250px] bg-white rounded shadow flex flex-col relative";

        const icon = document.createElement("i");
        icon.className = "fa-solid fa-download absolute bottom-2 right-2 text-blue-600 cursor-pointer";
        icon.title = "Download";
      
        icon.onclick = ()=> downloadImage(photo.src.large);

        

        const img = document.createElement("img");
        img.src = photo.src.medium;
        img.alt = photo.photographer;
        img.className = "w-full h-full object-cover z-1";

        card.appendChild(img);
        card.appendChild(icon);
        imageContainer.appendChild(card);
      }); 
    })
    .catch(function (error) {
      console.error("Error fetching images:", error);
    });
}


function downloadImage(url) {
  fetch(url, { mode: 'cors' })
    .then(res => res.blob())
    .then(blob => {
      const link = document.createElement("a");
      const objectUrl = URL.createObjectURL(blob);
      const imageName = url.split('?')[0].split('/').pop() || 'image.jpg';
      link.href = objectUrl;
      link.download = imageName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(objectUrl);
    })
    .catch(err => console.error('Download failed:', err));
}

// function downloadImage(url){
//   const link= document.createElement("a");
//   link.href = url;
//   const image = url.split('?')[0].split('/').pop() || 'image.jpg'; 
//   link.setAttribute("download", image)
//   document.body.appendChild(link);
//   link.click();
//   document.body.removeChild(link);
// }


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
    text: "Log out successfully!",
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
