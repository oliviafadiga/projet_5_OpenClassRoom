//------------------------------------------------------------------------
// 1---- Récupération des produits sur l'api avec un fetch
//------------------------------------------------------------------------
fetch("http://localhost:3000/api/products")
  // quand tu as la promese donne le résultat en json
  .then((res) => res.json())
  // ce que l'on a reçu en json sera appelé objetProduits
  .then((objetProduits) => {
    console.table(objetProduits);
    // appel de la fonction d'affichage des produits
    affichageDesKanaps(objetProduits);
  })
  // Catch dans le cas d'une erreur remplace le contenu h1 par erreur 404
  .catch((err) => {
    document.querySelector(".titles").innerHTML = "<h1>erreur 404</h1>";
    console.log("erreur 404 :" + err);
  });
//----------------------------------------------------------------------
// 2---- Création de la fonction d'affichage des produits de l'api sur la page index
//----------------------------------------------------------------------
function affichageDesKanaps(index) {
  // déclaration la variable de la zone d'article
  let zoneProduit = document.querySelector("#items");
  // boucle pour chaque indice(nommé 'article') dans index
  for (let article of index) {
    // création et ajout des zones d'articles
    zoneProduit.innerHTML += `<a href="./product.html?_id=${article._id}">
   <article>
     <img src="${article.imageUrl}" alt="${article.altTxt}">
     <h3 class="productName">${article.name}</h3>
     <p class="productDescription">${article.description}</p>
   </article>
  </a>`;
  }
}
