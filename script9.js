// js to modify article page


/*
Objectives 
1) Filter Articles button shows the filter checkbox menu (and hides the add-new form)
2) Add New Article button shows the add-new form (and hides the filter menu)
3) Checking/unchecking filter boxes hides/shows articles by type
4) Adding a new article appends it to the list with correct styles
*/

// 1) Show filter menu, hide add-new form
function showFilter() {
    const filterForm = document.getElementById("filterContent");
    const newForm = document.getElementById("newContent");

    if (filterForm) filterForm.style.display = "block";
    if (newForm) newForm.style.display = "none";
}

// 2) Show add-new form, hide filter menu
function showAddNew() {
    const filterForm = document.getElementById("filterContent");
    const newForm = document.getElementById("newContent");

    if (filterForm) filterForm.style.display = "none";
    if (newForm) newForm.style.display = "flex";
}

// 3) Filter articles based on checkbox states
function filterArticles() {
  
    const opinionOn = document.getElementById("opinionCheckbox")?.checked ?? true;
    const recipeOn = document.getElementById("recipeCheckbox")?.checked ?? true;
    const updateOn = document.getElementById("updateCheckbox")?.checked ?? true;

    toggleArticlesByClass("opinion", opinionOn);
    toggleArticlesByClass("recipe", recipeOn);
    toggleArticlesByClass("update", updateOn);
}

function toggleArticlesByClass(className, shouldShow) {
    const articles = document.querySelectorAll(`#articleList article.${className}`);
    for (const a of articles) {
        a.style.display = shouldShow ? "block" : "none";
    }
}

// 4) Add a new article with correct structure/styles
function addNewArticle() {
  
    const titleEl = document.getElementById("inputHeader");
    const textEl = document.getElementById("inputArticle");

    const title = (titleEl?.value ?? "").trim();
    const text = (textEl?.value ?? "").trim();

    if (!title || !text) {
        alert("Please enter both a Title and Text for the new article.");
        return;
    }

   
    const isOpinion = document.getElementById("opinionRadio")?.checked;
    const isRecipe = document.getElementById("recipeRadio")?.checked;
    const isUpdate = document.getElementById("lifeRadio")?.checked;

    let articleClass = "opinion";
    let markerText = "Opinion";

    if (isRecipe) {
        articleClass = "recipe";
        markerText = "Recipe";
    } else if (isUpdate) {
        articleClass = "update";
        markerText = "Update";
    } else if (isOpinion) {
        articleClass = "opinion";
        markerText = "Opinion";
    } else {
        alert("Please select an article Type (Opinion, Recipe, or Life Update).");
        return;
    }

    const articleList = document.getElementById("articleList");
    if (!articleList) return;

    // Create a new unique article 
    const nextNum = articleList.querySelectorAll("article").length + 1;

    const article = document.createElement("article");
    article.className = articleClass;
    article.id = `a${nextNum}`;

    // Match the structure of existing articles
    const marker = document.createElement("span");
    marker.className = "marker";
    marker.textContent = markerText;

    const h2 = document.createElement("h2");
    h2.textContent = title;

    const pText = document.createElement("p");
    pText.textContent = text;

    const pLink = document.createElement("p");
    const a = document.createElement("a");
    a.href = "moreDetails.html";
    a.textContent = "Read more...";
    pLink.appendChild(a);

    article.appendChild(marker);
    article.appendChild(h2);
    article.appendChild(pText);
    article.appendChild(pLink);

    articleList.appendChild(article);

    // Clear form inputs + radios
    titleEl.value = "";
    textEl.value = "";
    const opinionRadio = document.getElementById("opinionRadio");
    const recipeRadio = document.getElementById("recipeRadio");
    const lifeRadio = document.getElementById("lifeRadio");
    if (opinionRadio) opinionRadio.checked = false;
    if (recipeRadio) recipeRadio.checked = false;
    if (lifeRadio) lifeRadio.checked = false;

    // Keep current filters applied after adding
    filterArticles();
}
