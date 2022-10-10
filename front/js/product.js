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
    // la fontion afficherProduit pour afficher les produits
    afficherProduit(objetProduits);
  })
  .catch((err) => {
    document.querySelector(".item").innerHTML = "<h1>erreur 404</h1>";
    console.log("erreur 404, sur ressource api: " + err);
  });

//------------------------------------------------------------------------
// Création d'objet articleClient
//------------------------------------------------------------------------
// déclaration objet articleClient prêt à être modifiée par les fonctions suivantes d'évènements
let articleClient = {};
// id du procuit
articleClient._id = id;
//------------------------------------------------------------------------
// Déclaration de tableaux utiles (voir mutation)
//------------------------------------------------------------------------
// déclaration tableau qui sera le 1er, unique et destiné à initialiser le panier
let choixProduitClient = [];
// déclaration tableau qui sera ce qu'on récupère du local storage appelé panierDansLocal et qu'on convertira en JSon (importance dans Panier())
let produitsEnregistres = [];
// déclaration tableau qui sera un choix d'article/couleur non effectué donc non présent dans le panierDansLocal
let produitsTemporaires = [];
// déclaration tableau qui sera la concaténation des produitsEnregistres et de produitsTemporaires
let produitsAPousser = [];
//------------------------------------------------------------------------
// 3--- fonction d'affichage du produit de l'api
//------------------------------------------------------------------------

function afficherProduit(produit) {
  // déclaration des variables pointage des éléments
  let imageAlt = document.querySelector("article div.item__img");
  let titre = document.getElementById("title");
  let prix = document.getElementById("price");
  let description = document.getElementById("description");
  let couleurOption = document.getElementById("colors");
  // boucle for pour chercher un indice
  for (let choix of produit) {
    //si id (définit par l'url) est identique à un _id d'un des produits du tableau, on récupère son indice de tableau qui sert pour les éléments produit à ajouter
    if (id === choix._id) {
      //ajout des éléments de manière dynamique
      imageAlt.innerHTML = `<img src="${choix.imageUrl}" alt="${choix.altTxt}">`;
      titre.textContent = `${choix.name}`;
      prix.textContent = `${choix.price}`;
      description.textContent = `${choix.description}`;
      // boucle pour chercher les couleurs pour chaque produit en fonction de sa clef/valeur (la logique: tableau dans un tableau = boucle dans boucle)
      for (let couleur of choix.colors) {
        // ajout des balises d'option couleur avec leur valeur
        couleurOption.innerHTML += `<option value="${couleur}">${couleur}</option>`;
      }
    }
  }
  console.log("affichage effectué");
}
//------------------------------------------------------------------------
// 4---- Enregistrement du choix couleur dynamiquement
//------------------------------------------------------------------------
// définition des variables
let choixCouleur = document.querySelector("#colors");
// On écoute ce qu'il se passe dans #colors
choixCouleur.addEventListener("input", (ec) => {
  let couleurProduit;
  // on récupère la valeur de la cible de l'évenement dans couleur
  couleurProduit = ec.target.value;
  // on ajoute la couleur à l'objet panierClient
  articleClient.couleur = couleurProduit;
  //ça reset la couleur et le texte du bouton si il y a une action sur les inputs dans le cas d'une autre commande du même produit
  document.querySelector("#addToCart").style.color = "white";
  document.querySelector("#addToCart").textContent = "Ajouter au panier";
  console.log(couleurProduit);
});

//-------------------------------------------------------------------------
// 5--- Enrgistrement de la quantité de produit dynamiquement
//------------------------------------------------------------------------
// définition des variables
let choixQuantité = document.querySelector('input[id="quantity"]');
let quantitéProduit;
// On écoute ce qu'il se passe dans input[name="itemQuantity"]
choixQuantité.addEventListener("input", (eq) => {
  // on récupère la valeur de la cible de l'évenement dans couleur
  quantitéProduit = eq.target.value;
  // on ajoute la quantité à l'objet panierClient
  articleClient.quantité = quantitéProduit;
  //ça reset la couleur et le texte du bouton si il y a une action sur les inputs dans le cas d'une autre commande du même produit
  document.querySelector("#addToCart").style.color = "white";
  document.querySelector("#addToCart").textContent = "Ajouter au panier";
  console.log(quantitéProduit);
});
//------------------------------------------------------------------------
// 6 --- La validation suite au clic sur le bouton ajouter au panier
//------------------------------------------------------------------------
// déclaration variable
let validerProduit = document.getElementById("addToCart");
// On écoute ce qu'il se passe sur le bouton #addToCart pour faire l'action :
validerProduit.addEventListener("click", () => {
  //conditions de validation du bouton ajouter au panier
  if (
    // les valeurs sont créées dynamiquement au click, et à l'arrivée sur la page, tant qu'il n'y a pas d'action sur la couleur et/ou la quantité, c'est 2 valeurs sont undefined.
    articleClient.quantité < 1 ||
    articleClient.quantité > 100 ||
    articleClient.quantité === undefined ||
    articleClient.couleur === "" ||
    articleClient.couleur === undefined
  ) {
    // joue l'alerte
    alert(
      "Pour valider le choix de cet article, veuillez sélectionner une couleur, et/ou une quantité valide"
    );
    // si ça passe le controle
  } else {
    // joue panier
    Panier();
    console.log("clic effectué");
    //effet visuel d'ajout de produit
    document.querySelector("#addToCart").style.color = "rgb(0, 205, 0)";
    document.querySelector("#addToCart").textContent =
      "Produit ajouté au panier!";
  }
});

//-------------------------------------------------------------------------
// 7----- fonction ajoutPremierProduit qui ajoute l'article choisi dans le tableau vierge
//-------------------------------------------------------------------------
function ajoutPremierProduit() {
  console.log(produitsEnregistres);
  //si produitsEnregistres est null c'est qu'il n'a pas été créé
  if (produitsEnregistres === null) {
    // pousse le produit choisit dans choixProduitClient
    choixProduitClient.push(articleClient);
    console.log(articleClient);
    // dernière commande, envoit choixProduitClient dans le local storage sous le nom de panierDansLocal de manière JSON stringifié
    return (localStorage.panierDansLocal = JSON.stringify(choixProduitClient));
  }
}

//-------------------------------------------------------------------------
// 8----- fonction ajoutUnAutreProduit qui ajoute l'article dans le tableau non vierge et fait un tri
//-------------------------------------------------------------------------
function ajoutUnAutreProduit() {
  // vide/initialise produitsAPousser pour recevoir les nouvelles données
  produitsAPousser = [];
  // pousse le produit choisit dans produitsTemporaires
  produitsTemporaires.push(articleClient);
  // combine produitsTemporaires et/dans produitsEnregistres, ça s'appele produitsAPousser
  // autre manière de faire: produitsAPousser = produitsEnregistres.concat(produitsTemporaires);
  produitsAPousser = [...produitsEnregistres, ...produitsTemporaires];
  // vide/initialise produitsTemporaires maintenant qu'il a été utilisé
  produitsTemporaires = [];
  // dernière commande, envoit produitsAPousser dans le local storage sous le nom de panierDansLocal de manière JSON stringifié
  return (localStorage.panierDansLocal = JSON.stringify(produitsAPousser));
}
//--------------------------------------------------------------------
// 9 ------fonction Panier qui ajuste la quantité si le produit est déja dans le tableau, sinon le rajoute si tableau il y a, ou créait le tableau avec un premier article choisi
//--------------------------------------------------------------------
function Panier() {
  // variable qui sera ce qu'on récupère du local storage appelé panierDansLocal et qu'on a convertit en JSon
  produitsEnregistres = JSON.parse(localStorage.getItem("panierDansLocal"));
  // si produitEnregistrés existe (si des articles ont déja été choisis et enregistrés par le client)
  if (produitsEnregistres) {
    for (let choix of produitsEnregistres) {
      //comparateur d'égalité des articles actuellement choisis et ceux déja choisis
      if (choix._id === id && choix.couleur === articleClient.couleur) {
        //information client
        alert("RAPPEL: Vous aviez déja choisit cet article.");
        // on modifie la quantité d'un produit existant dans le panier du localstorage
        //définition de additionQuantité qui est la valeur de l'addition de l'ancienne quantité parsée et de la nouvelle parsée pour le même produit
        let additionQuantite =
          parseInt(choix.quantité) += parseInt(quantitéProduit);
        // on convertit en JSON le résultat précédent dans la zone voulue
        choix.quantité = JSON.stringify(additionQuantite);
        // dernière commande, on renvoit un nouveau panierDansLocal dans le localStorage
        return (localStorage.panierDansLocal =
          JSON.stringify(produitsEnregistres));
      }
    }
    // appel fonction ajoutUnAutreProduit si la boucle au dessus ne retourne rien donc n'a pas d'égalité
    return ajoutUnAutreProduit();
  }
  // appel fonction ajoutPremierProduit si produitsEnregistres n'existe pas
  return ajoutPremierProduit();
}
//--------------------------------------------------------------------------------------------------
