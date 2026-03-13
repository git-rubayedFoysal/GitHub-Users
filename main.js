/**
 * The function fetches user data from the GitHub API, creates cards with user information, and allows
 * users to flip the card to view more details.
 */
const parent = document.querySelector("#parent");
const title = document.querySelector("h1");
const template = document.querySelector("#cardTemplate");

async function users() {
  try {
    const response = await fetch("https://api.github.com/users");
    if (!response.ok) {
      throw new Error("Data is not present.");
    }
    const data = await response.json();

    data.forEach((user) => {
      const clone = template.content.cloneNode(true);
      const img = clone.querySelector("img");
      const h2 = clone.querySelector("h2");
      const link = clone.querySelector("a");

      img.src = user.avatar_url;
      h2.textContent = user.login;
      link.href = user.html_url;

      const cardEle = clone.querySelector(".card");
      cardEle.dataset.api = user.url;
      // save the original contents so we can restore on toggle
      cardEle.dataset.orig = cardEle.innerHTML;

      parent.append(clone);
    });
  } catch (error) {
    title.textContent = error;
  }
}

users();

function show(e) {
  const card = e.target.closest(".card");
  if (!card) return;

  // toggle back to original if already flipped
  if (card.classList.contains("flip")) {
    card.classList.remove("flip");
    if (card.dataset.orig) {
      card.innerHTML = card.dataset.orig;
      card.classList.add("flip-rev");
    }
    return;
  }

  const url = card.dataset.api;
  if (!url) return;

  card.classList.remove("flip-rev");
  card.classList.add("flip");

  async function getData() {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Data not present.");
      }
      const info = await response.json();
      card.innerHTML = `
            <p><span>Name:</span> ${info.name}</p>
            <p><span>Email:</span> ${info.email}</p>
            <p><span>Location:</span> ${info.location}</p>
            <p><span>Followers:</span> ${info.followers}</p>
            <p><span>Following:</span> ${info.following}</p>
          `;
    } catch (error) {
      title.textContent = error;
    }
  }

  getData();
}
// delegate clicks from parent container
parent.addEventListener("click", show);
