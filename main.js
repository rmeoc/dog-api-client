
import * as Msg from "./messages.js";


const breedsUrl = "https://dog.ceo/api/breeds/list/all";
const breedImagesUrl = (breed) => `https://dog.ceo/api/breed/${breed}/images/random/10`;
const subBreedImagesUrl = (breed, subBreed) => `https://dog.ceo/api/breed/${breed}/${subBreed}/images/random/10`;


async function loadThumbnails(headerText, url) {

    const response = await fetch(url);
    const json = await response.json();
    if (!response.ok || json.status !== "success") {
        throw json.message || Msg.unknownError;
    }

    const header = document.querySelector("#header");
    header.textContent = headerText;

    const imageArea = document.querySelector("#images");
    while (imageArea.firstChild) {
        imageArea.removeChild(imageArea.firstChild);
    }

    json.message.forEach(imageUrl => {

        const image = document.createElement("img");
        image.src = imageUrl;
        image.onclick = () => {
            window.open(imageUrl);
        }
        imageArea.appendChild(image);
    });
}

function createBreedItem(linkText, headerText, url) {

    const link = document.createElement("a");
    link.href="#";
    link.onclick = () => {
        loadThumbnails(headerText, url).catch(e => {
            alert(Msg.failedToRetrieveImages(e));
        });
        return false;
    }
    link.textContent = linkText;

    const item = document.createElement("li");
    item.appendChild(link);
    return item;
}

async function loadBreedsList() {

    const response = await fetch(breedsUrl);
    const json = await response.json();
    if (!response.ok || json.status !== "success") {
        throw json.message || "Unknown error";
    }

    const breedList = document.querySelector("#breeds");
    for (const breed in json.message) {

        const breedItem = createBreedItem(breed, breed, breedImagesUrl(breed));
        breedList.appendChild(breedItem);

        const subBreeds = json.message[breed];
        if (subBreeds.length !== 0) {

            const subBreedList = document.createElement("ul");
            breedItem.appendChild(subBreedList);

            subBreeds.forEach(subBreed => {
                subBreedList.appendChild(
                    createBreedItem(subBreed, `${breed} - ${subBreed}`, subBreedImagesUrl(breed, subBreed)));
            });
        }
    }
}

loadBreedsList().catch(e => alert(Msg.failedToRetrieveListOfBreeds(e)));
