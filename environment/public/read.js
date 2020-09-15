var articlesPanel;
function FindArticles(login) {
    $.ajax({
        url: `/api/users/login/${login}/articles`,
        contentType: "application/json",
        method: "GET",
        success: function (types) {
            types.forEach(type => {
                var typeElement = document.createElement('div');
                typeElement.classList.add('panel-footer');
                typeElement.innerText = type.type;
                articlesPanel.appendChild(typeElement);
                type.articles.forEach((article => {
                    var articleElement = document.createElement('li');
                    articleElement.classList.add('list-group-item');
                    articleElement.innerHTML = `<a href=${article.url} title=${article.name}>${article.name}</a>`;
                    articlesPanel.appendChild(articleElement);
                }));
            })
        }
    })
}

$(document).ready(function () {
    articlesPanel = document.getElementById('articles-panel');
    var currentUser = localStorage.getItem("currentUser");
    if (currentUser && currentUser !== 'null') {
        console.log(currentUser);
        $("#main").html(currentUser);
    }
    var email = localStorage.getItem("EMAIL");
    console.log(email);
    if (email) {
        FindArticles(email);
    }
});
