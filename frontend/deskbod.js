  const apiKey = "xLqhmV2nn5IXBFh1EL530c04j296FrZc09oFy2WnkHVMywAMSxTAFIeu";
  const searchInput = document.getElementById("searchInput");
  const searchButton = document.getElementById("searchButton");
  const imageContainer = document.getElementById("imageContainer");

  searchButton.addEventListener("click", search);

  function search() {
    const n = searchInput.value.trim();

    if (n === "") {
      alert("Please type something");
      return;
    }

    axios
      .get(`https://api.pexels.com/v1/search?query=${n}&per_page=9`, {
        headers: {
          Authorization: apiKey
        }
      })
      .then(function (response) {
        const pics = response.data.photos;
        imageContainer.innerHTML = "";

         if (pics.length === 0) {
        const message = document.createElement("div");
        message.className = "text-white col-span-4 text-center py-10 text-xl font-semibold";
        message.textContent = `No results found for "${n}". Try another keyword.`;
        imageContainer.appendChild(message);
        return;
      }

        pics.forEach(photo => {
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
