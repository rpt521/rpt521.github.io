// pokeapp.js
// - fetch() pokemon by name or ID
// - cache responses (localStorage + in-memory)
// - display image
// - load/play audio if available (cries), otherwise disable
// - populate 4 move dropdowns
// - allow selecting 4 moves
// - "Add to Team" saves choices and displays them

// -------------------- DOM --------------------
const searchInput = document.getElementById("searchInput");
const findBtn = document.getElementById("findBtn");

const pokemonImg = document.getElementById("pokemonImg");
const pokemonAudio = document.getElementById("pokemonAudio");
const audioSource = document.getElementById("audioSource");

const moveSelects = [
  document.getElementById("move1"),
  document.getElementById("move2"),
  document.getElementById("move3"),
  document.getElementById("move4"),
];

const teamArea = document.querySelector(".team-area");
const addToTeamBtn = document.getElementById("addToTeamBtn");
const teamListEl = document.getElementById("teamList"); // exists after you add team area

// -------------------- STATE --------------------
let currentPokemon = null; // last fetched pokemon JSON
const team = []; // { id, name, sprite, moves: [..] }

// -------------------- CACHE --------------------
// In-memory cache prevents repeat reads within a session.
const memCache = new Map();

// localStorage cache persists across reloads.
// TTL keeps cache from becoming stale.
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
const LS_PREFIX = "poke:pokemon:";

function now() {
  return Date.now();
}

function normQuery(q) {
  return String(q || "").trim().toLowerCase();
}

function cacheKey(q) {
  return LS_PREFIX + normQuery(q);
}

function getCached(q) {
  const key = cacheKey(q);

  // 1) in-memory
  if (memCache.has(key)) return memCache.get(key);

  // 2) localStorage
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.data || !parsed.savedAt) return null;

    if (now() - parsed.savedAt > CACHE_TTL_MS) {
      localStorage.removeItem(key);
      return null;
    }

    memCache.set(key, parsed.data);
    return parsed.data;
  } catch {
    return null;
  }
}

function setCached(q, data) {
  const key = cacheKey(q);
  memCache.set(key, data);

  try {
    localStorage.setItem(
      key,
      JSON.stringify({ savedAt: now(), data })
    );
  } catch {
    // If storage is full or blocked, we still have memCache.
  }
}

// -------------------- UI HELPERS --------------------
function clearMoves() {
  moveSelects.forEach((sel, i) => {
    sel.innerHTML = "";
    const opt = document.createElement("option");
    opt.value = "";
    opt.textContent = `Move ${i + 1}`;
    sel.appendChild(opt);
  });
}

function fillMoves(moveNames) {
  // Same list in each dropdown
  moveSelects.forEach((sel, i) => {
    sel.innerHTML = "";
    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = `Move ${i + 1}`;
    sel.appendChild(placeholder);

    moveNames.forEach((name) => {
      const opt = document.createElement("option");
      opt.value = name;
      opt.textContent = name;
      sel.appendChild(opt);
    });
  });

  // Auto-select first 4 (if possible)
  moveSelects.forEach((sel) => {
    if (sel.options.length > 1) sel.selectedIndex = 1;
  });
}

function chooseSprite(poke) {
  // Prefer pixel sprite (classic), fall back to official artwork if needed
  return (
    poke?.sprites?.front_default ||
    poke?.sprites?.other?.["official-artwork"]?.front_default ||
    ""
  );
}

function setImage(poke) {
  const sprite = chooseSprite(poke);

  // If sprite is missing, keep your default placeholder
  if (!sprite) return;

  pokemonImg.src = sprite;
  pokemonImg.alt = poke.name || "Pokemon";
}

function resetAudio() {
  audioSource.src = "";
  pokemonAudio.load();

  // Disable controls visually/interaction when no audio
  pokemonAudio.controls = true; // keep UI consistent
  pokemonAudio.style.opacity = "0.45";
}

function setAudioFromPokemon(poke) {
  // Some PokeAPI responses include cries fields; if not present, we gracefully disable.
  const cry =
    poke?.cries?.latest ||
    poke?.cries?.legacy ||
    "";

  if (!cry) {
    resetAudio();
    return;
  }

  audioSource.src = cry;
  pokemonAudio.load();
  pokemonAudio.style.opacity = "1";
}

function extractMoveNames(poke) {
  const arr = Array.isArray(poke?.moves) ? poke.moves : [];
  return arr
    .map((m) => m?.move?.name)
    .filter(Boolean)
    .sort();
}

function getSelectedMoves() {
  return moveSelects
    .map((sel) => sel.value)
    .filter((v) => v && v.trim().length > 0);
}

function hasDuplicates(list) {
  return new Set(list).size !== list.length;
}

function renderTeam() {
  if (!teamListEl) return;

  teamListEl.innerHTML = "";

  team.forEach((member) => {
    const card = document.createElement("div");
    card.className = "team-card";

    const img = document.createElement("img");
    img.src = member.sprite || "";
    img.alt = member.name;

  

    const ul = document.createElement("ul");
    member.moves.forEach((mv) => {
      const li = document.createElement("li");
      li.textContent = mv;
      ul.appendChild(li);
    });

    card.appendChild(img);

    card.appendChild(ul);

    teamListEl.appendChild(card);
  });
}
// used AI to write up a reset function post add to team
function resetSearchUI(){
  // clear input
  searchInput.value = "";

  // reset current pokemon
  currentPokemon = null;

  // restore placeholder image (your local png path)
  pokemonImg.src = "assets/screenshots/pokemon0.png";
  pokemonImg.alt = "MissingNo placeholder";

  // clear moves back to placeholders
  clearMoves();

  // clear audio
  resetAudio();
}

// -------------------- FETCH --------------------
async function fetchPokemon(q) {
  const query = normQuery(q);
  if (!query) throw new Error("Enter a Pokémon name or ID.");

  // cache hit?
  const cached = getCached(query);
  if (cached) return cached;

  const url = `https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(query)}`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error("Pokémon not found. Try a name or an ID from 1 to 151.");
  }

  const data = await res.json();
  setCached(query, data);

  // Also cache by canonical ID/name to reduce future calls
  if (data?.id) setCached(String(data.id), data);
  if (data?.name) setCached(String(data.name), data);

  return data;
}

async function loadPokemon(q) {
  // reset UI parts before loading
  clearMoves();
  resetAudio();

  const data = await fetchPokemon(q);
  currentPokemon = data;

  setImage(data);
  setAudioFromPokemon(data);

  const moveNames = extractMoveNames(data);
  fillMoves(moveNames);
}

// -------------------- EVENTS --------------------
findBtn.addEventListener("click", async () => {
  try {
    await loadPokemon(searchInput.value);
  } catch (err) {
    alert(err.message || "Something went wrong.");
  }
});

searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    findBtn.click();
  }
});

addToTeamBtn.addEventListener("click", () => {
  if (!currentPokemon) {
    alert("Search and load a Pokémon first.");
    return;
  }

  const selectedMoves = getSelectedMoves();

  if (selectedMoves.length !== 4) {
    alert("Please select 4 moves.");
    return;
  }

  if (hasDuplicates(selectedMoves)) {
    alert("Please select 4 different moves (no duplicates).");
    return;
  }

  if (team.length >= 6) {
    alert("Team is full (max 6).");
    return;
  }

  // Optional: prevent duplicate pokemon in team
  if (team.some((m) => m.id === currentPokemon.id)) {
    alert("That Pokémon is already on your team.");
    return;
  }

  team.push({
    id: currentPokemon.id,
    name: currentPokemon.name,
    sprite: chooseSprite(currentPokemon),
    moves: selectedMoves,
  });
  if (team.length === 1) {
  teamArea.style.display = "block";
}

  renderTeam();
  resetSearchUI();
});

// Initial UI state: keep your placeholder image; blank moves + disabled audio
clearMoves();
resetAudio();
