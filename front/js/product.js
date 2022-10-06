//--------------------------------------------------------------------------
// 1--- Récupération de l'id du produit avec l' URL
//--------------------------------------------------------------------------
const url = new URL(document.location.href);
const params = new URLSearchParams(url.search);
console.log(document.location);
console.log(params);
const id = params.get("_id");
console.log(id);

//--------------------------------------------------------------------------
// 2--- Récupération des produits de l'api et traitement des données (voir script.js)
//--------------------------------------------------------------------------
fetch("http://localhost:3000/api/products")
  .then((res) => res.json())
  .then((objetProduits) => {
    // la fontion lesProduits pour afficher les produits
    lesProduits(objetProduits);
  })
  .catch((err) => {
    document.querySelector(".item").innerHTML = "<h1>erreur 404</h1>";
    console.log("erreur 404, sur ressource api: " + err);
  });

//------------------------------------------------------------------------
// 3--- fonction d'affichage du produit de l'api sur la page product
//------------------------------------------------------------------------
function lesProduits(produit) {
  // déclaration des variables pointage des éléments
  let imageAlt = document.querySelector("article div.item__img");
  let titre = document.querySelector("#title");
  let prix = document.querySelector("#price");
  let description = document.querySelector("#description");
  let couleurOption = document.querySelector("#colors");
  // boucle for pour chercher un indice
  for (let choix of produit) {
    //si id (définit par l'url) est identique à un _id d'un des produits du tableau
    if (id === choix._id) {
      //ajout des éléments de manière dynamique
      imageAlt.innerHTML = `<img src="${choix.imageUrl}" alt="${choix.altTxt}">`;
      titre.textContent = `${choix.name}`;
      prix.textContent = `${choix.price}`;
      description.textContent = `${choix.description}`;
      // boucle pour chercher les couleurs pour chaque produit en fonction de sa clef/valeur
      for (let couleur of choix.colors) {
        // ajout des balises d'option couleur avec leur valeur
        couleurOption.innerHTML += `<option value="${couleur}">${couleur}</option>`;
        console.log(couleur);
      }
    }
  }
}

//------------------------------------------------------------------------
// Création d'objet qui enregistre le choix de l'utilisateur
//------------------------------------------------------------------------
// déclaration objet choixArticleClient
let choixArticleClient = {};
// id du procuit
choixArticleClient._id = id;

//------------------------------------------------------------------------
// 4--- choix couleur dynamique
//------------------------------------------------------------------------
// définition des variables
let choixCouleur = document.querySelector("#colors");
//  écoute ce qu'il se passe dans #colors
choixCouleur.addEventListener("input", (ec) => {
  let couleurProduit;
  // récupère la valeur de la cible de l'évenement dans couleur
  couleurProduit = ec.target.value;
  // ajoute la couleur à l'objet choixArticleClient
  choixArticleClient.couleur = couleurProduit;
  console.log(couleurProduit);
});

//-------------------------------------------------------------------------
// 5--- choix quantité dynamique
//------------------------------------------------------------------------
// définition des variables
let choixQuantité = document.querySelector('input[id="quantity"]');
let quantitéProduit;
// On écoute ce qu'il se passe dans input[name="itemQuantity"]
choixQuantité.addEventListener("input", (eq) => {
  // on récupère la valeur de la cible de l'évenement dans couleur
  quantitéProduit = eq.target.value;
  // on ajoute la quantité à l'objet choixArticleClient
  choixArticleClient.quantity = quantitéProduit;
  console.log(quantitéProduit);
});
console.log(choixArticleClient);
