//------------------------------------------------------------------------
// Récupération des produits sur l'api
//------------------------------------------------------------------------ 
fetch("http://localhost:3000/api/products")
  // quand tu as la réponse donne le résultat en json
  .then((res) => res.json())
  // ce que l'on a reçu en json sera appelé objetProduits
  .then((objetProduits) => {
    // les informations en console sous forme de tableau
    console.table(objetProduits);
    // appel de la fonction d'affichage des produits
    AffichagelesKanaps(objetProduits);
  })
  // dans le cas d'une erreur remplace le contenu h1 par erreur 404 et renvoit en console l'erreur.
  .catch((err) => {
    document.querySelector(".titles").innerHTML = "<h1>erreur 404</h1>";
    console.log("erreur 404, sur ressource api:" + err);
  });
//----------------------------------------------------------------------
// fonction d'affichage des produits de l'api sur la page index
//----------------------------------------------------------------------
function AffichagelesKanaps(index)
{
 // déclaration de variable de la zone d'article
 let zoneArticle = document.querySelector("#items");
 // boucle pour chaque indice(nommé 'article') dans index
for (let article of index) 
{
   // création et ajout des zones d'articles
   zoneArticle.innerHTML += `<a href="./product.html?_id=${article._id}">
   <article>
     <img src="${article.imageUrl}" alt="${article.altTxt}">
     <h3 class="productName">${article.name}</h3>
     <p class="productDescription">${article.description}</p>
   </article>
  </a>`;
 }
}