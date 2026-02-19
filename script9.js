//js to modify article page

//When the user clicks the "Filter Articles" button, a menu appears with the checkboxes to filter. 
function showFilter()
{
    document.getElementById("filterContent").style.display = "block";
}

//When the user clicks the "Add New Article" button, a form appears.
function showAddNew()
{
    document.getElementById("newContent").style.display = "block";
}

//When the user checks/unchecks a box for filtering, each of the articles of that type are hidden/shown accordingly.
function filterArticles()
{
    var checkboxes = document.getElementsByClassName("filterCheckbox");
    for (var i = 0; i < checkboxes.length; i++) {
        var checkbox = checkboxes[i];
        var articleType = checkbox.value;
        var articles = document.getElementsByClassName(articleType);
        for (var j = 0; j < articles.length; j++) {
            if (checkbox.checked) {
                articles[j].style.display = "block";
            } else {
                articles[j].style.display = "none";
            }
        }
    }
}



//When the user enters a new article and presses "Add New Article", the content appears in the list with the correct styles.
function addNewArticle()
{
    var title = document.getElementById("newTitle").value;
    var label = document.getElementById("newLabel").value;
    var text = document.getElementById("newText").value;

    var newArticle = document.createElement("div");
    newArticle.className = "article " + label.toLowerCase();
    newArticle.innerHTML = "<h2>" + title + "</h2><p>" + text + "</p>";
    document.getElementById("articleList").appendChild(newArticle);

    // Clear the form
    document.getElementById("newTitle").value = "";
    document.getElementById("newLabel").value = "";
    document.getElementById("newText").value = "";
}
