// === Constants ===
const BASE = "https://fsa-crud-2aa9294fe819.herokuapp.com/api";
const COHORT = "/2504-FTB-EB-WEB-FT"; // Make sure to change this!
const RESOURCE = "/events";
const API = BASE + COHORT + RESOURCE;
// Global state variables
let parties = [];
let selectedParty = null;
/**
 *
 * @param {string} _ The url to fetch data from
 * @returns {Promise<any>} - A promise that resolves to the fetched JSON data
 */
async function fetchData(url) {
  try {
    // fetch  an API
    const response = await fetch(url);
    // check if the response is in 200 range
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    // parse response with JSON and save promise object
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Fetching data failed:", error);
    throw error;
  }
}
// === State ===
async function getParties() {
  try {
    const result = await fetchData(API);
    parties = result.data;
  } catch (error) {
    console.error(error);
  }
  render();
}
async function getParty(id) {
  try {
    const result = await fetch(`${API}/${id}`);
    const party = await result.json();
    selectedParty = party.data;
  } catch (error) {
    console.error(error);
  }
  render();
}
// === Components ===
function PartyListItem(party) {
  // make sure we have a valid object (not null or array)
  if (typeof party === "object" && party !== null && !Array.isArray(party)) {
    const listItem = document.createElement("li");
    //  make the selected link bold / add a class to modify in style sheet
    if (selectedParty && party.id === selectedParty.id) {
      listItem.classList.add("selected");
    }
    listItem.innerHTML = `<a href="#selected">${party.name}</a>`;
    listItem.addEventListener("click", () => getParty(party.id));
    return listItem;
  } else {
    console.error("PartyListItem expected a single party object: ", party);
  }
}
function PartyList() {
  const ul = document.createElement("ul");
  ul.setAttribute("class", "lineup");
  if (Array.isArray(parties)) {
    parties.forEach((party) => {
      ul.appendChild(PartyListItem(party));
    });
  } else {
    console.error("Expected a list of parties.");
  }
  return ul;
}
// Detailed information about the selected party
function PartyDetails() {
  if (!selectedParty) {
    const $p = document.createElement("section");
    $p.textContent = "Please select a party to learn more.";
    return $p;
  }
  const $section = document.createElement("section");
  $section.setAttribute("class", "party");
  $section.innerHTML = `<h3>${selectedParty.name} #${selectedParty.id}</h3><p>${selectedParty.date}<br />${selectedParty.location}</p><p>${selectedParty.description}</p>`;
  return $section;
}
// === Render ===
function render() {
  const $app = document.querySelector("#app");
  $app.innerHTML = `
      <h1>Party Planner</h1>
      <main>
        <section>
          <h2>Parties</h2>
          <PartyList></PartyList>
        </section>
        <section id="selected">
          <h2>Party Details</h2>
          <PartyDetails></PartyDetails>
        </section>
      </main>
    `;
  $app.querySelector("PartyList").replaceWith(PartyList());
  $app.querySelector("PartyDetails").replaceWith(PartyDetails());
}
async function init() {
  await getParties();
  render();
}
init();
