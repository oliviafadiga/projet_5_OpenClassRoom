// Variable de pointage de la page
const page = document.location.href;
//----------------------------------------------------------------
// 1--- Récupération des produits de l'api pour les informations
//----------------------------------------------------------------
if (page.match("cart")) {
  fetch("http://localhost:3000/api/products")
    .then((res) => res.json())
    .then((objetProduits) => {
      console.log(objetProduits);
      // appel de la fonction affichagePanier si response obtenu
      affichagePanier(objetProduits);
    })
    // catch pour afficher erreur si resp. non obtenu
    .catch((err) => {
      document.querySelector("#cartAndFormContainer").innerHTML =
        "<h1>erreur 404</h1>";
      console.log("erreur 404, sur ressource api: " + err);
    });
} else {
  console.log("sur page confirmation");
}
//--------------------------------------------------------------
// 2--- Fonction détermine les conditions d'affichage des produits du panier
//--------------------------------------------------------------
function affichagePanier(index) {
  // on récupère le panier converti
  let panier = JSON.parse(localStorage.getItem("panierDansLocal"));
  // si il y a un panier avec une taille differante de 0 (donc supérieure à 0)
  if (panier && panier.length != 0) {
    // zone de correspondance clef/valeur de l'api et du panier grâce à l'id produit choisit dans le localStorage
    for (let choix of panier) {
      console.log(choix);
      for (let g = 0, h = index.length; g < h; g++) {
        if (choix._id === index[g]._id) {
          // création et ajout de valeurs à panier qui vont servir pour les valeurs dataset
          choix.name = index[g].name;
          choix.prix = index[g].price;
          choix.image = index[g].imageUrl;
          choix.description = index[g].description;
          choix.alt = index[g].altTxt;
        }
      }
    }
    affiche(panier);
  } else {
    // si il n'y a pas de panier on créait un H1 informatif et quantité appropriées
    document.querySelector("#totalQuantity").innerHTML = "0";
    document.querySelector("#totalPrice").innerHTML = "0";
    document.querySelector("h1").innerHTML = "Votre panier est vide";
  }
  // reste à l'écoute grâce aux fonctions suivantes pour modifier l'affichage
  modifQuantite();
  suppression();
}
//--------------------------------------------------------------
//Fonction d'affichage d'un panier (tableau)
//--------------------------------------------------------------
function affiche(indexé) {
  // on déclare et on pointe la zone d'affichage
  let zonePanier = document.getElementById("cart__items");
  zonePanier.innerHTML += indexé
    .map(
      (choix) =>
        `<article class="cart__item" data-id="${choix._id}" data-couleur="${choix.couleur}" data-quantité="${choix.quantité}" data-prix="${choix.prix}"> 
    <div class="cart__item__img">
      <img src="${choix.image}" alt="${choix.alt}">
    </div>
    <div class="cart__item__content">
      <div class="cart__item__content__titlePrice">
        <h2>${choix.name}</h2>
        <span>couleur : ${choix.couleur}</span>
        <p data-prix="${choix.prix}">${choix.prix} €</p>
      </div>
      <div class="cart__item__content__settings">
        <div class="cart__item__content__settings__quantity">
          <p>Qté : </p>
          <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${choix.quantité}">
        </div>
        <div class="cart__item__content__settings__delete">
          <p class="deleteItem" data-id="${choix._id}" data-couleur="${choix.couleur}">Supprimer</p>
        </div>
      </div>
    </div>
  </article>`
    )
    .join(""); //on remplace les virgules de jonctions des objets du tableau par un vide
  // reste à l'écoute des modifications de quantité pour l'affichage et actualiser les données
  totalProduit();
}
//--------------------------------------------------------------
// fonction modifQuantite on modifie dynamiquement les quantités du panier
//--------------------------------------------------------------
function modifQuantite() {
  const cart = document.querySelectorAll(".cart__item");
  cart.forEach((cart) => {
    cart.addEventListener("change", (eq) => {
      // vérification d'information de la valeur du clic et son positionnement dans les articles
      let panier = JSON.parse(localStorage.getItem("panierDansLocal"));
      // boucle pour modifier la quantité du produit du panier grace à la nouvelle valeur
      for (article of panier)
        if (
          article._id === cart.dataset.id &&
          cart.dataset.couleur === article.couleur
        ) {
          article.quantité = eq.target.value;
          localStorage.panierDansLocal = JSON.stringify(panier);
          // on met à jour le dataset quantité
          cart.dataset.quantité = eq.target.value;
          // on joue la fonction pour actualiser les données
          totalProduit();
        }
    });
  });
}
//--------------------------------------------------------------
// fonction supression on supprime un article dynamiquement du panier et donc de l'affichage
//--------------------------------------------------------------
function suppression() {
  // déclaration de variables
  const cartdelete = document.querySelectorAll(".cart__item .deleteItem");
  // pour chaque élément cartdelete
  cartdelete.forEach((cartdelete) => {
    // On écoute s'il y a un clic dans l'article concerné
    cartdelete.addEventListener("click", () => {
      // appel de la ressource du local storage
      let panier = JSON.parse(localStorage.getItem("panierDansLocal"));
      for (let d = 0, c = panier.length; d < c; d++)
        if (
          panier[d]._id === cartdelete.dataset.id &&
          panier[d].couleur === cartdelete.dataset.couleur
        ) {
          // déclaration de variable utile pour la suppression
          const num = [d];
          // création d'un tableau miroir, voir mutation
          let nouveauPanier = JSON.parse(
            localStorage.getItem("panierDansLocal")
          );
          //suppression de 1 élément à l'indice num
          nouveauPanier.splice(num, 1);
          //affichage informatif
          if (nouveauPanier && nouveauPanier.length == 0) {
            // si il n'y a pas de panier on créait un H1 informatif et quantité appropriées
            document.querySelector("#totalQuantity").innerHTML = "0";
            document.querySelector("#totalPrice").innerHTML = "0";
            document.querySelector("h1").innerHTML =
              "Vous n'avez pas d'article dans votre panier";
          }
          // on renvoit le nouveau panier converti dans le local storage et on joue la fonction
          localStorage.panierDansLocal = JSON.stringify(nouveauPanier);
          totalProduit(); // logique mais pas obligatoire à cause du reload plus bas qui raffraichit l'affichage; serait necessaire avec suppression sans reload
          // on recharge la page qui s'affiche sans le produit grace au nouveau panier
          return location.reload();
        }
    });
  });
}
//--------------------------------------------------------------
// fonction ajout nombre total produit et coût total
//--------------------------------------------------------------
function totalProduit() {
  // déclaration variable en tant que nombre
  let totalArticle = 0;
  // déclaration variable en tant que nombre
  let totalPrix = 0;
  // on pointe l'élément
  const cart = document.querySelectorAll(".cart__item");
  // pour chaque élément cart
  cart.forEach((cart) => {
    //je récupère les quantités des produits grâce au dataset
    totalArticle += JSON.parse(cart.dataset.quantité);
    // je créais un opérateur pour le total produit grâce au dataset
    totalPrix += cart.dataset.quantité * cart.dataset.prix;
  });
  // je pointe l'endroit d'affichage nombre d'article
  document.getElementById("totalQuantity").textContent = totalArticle;
  // je pointe l'endroit d'affichage du prix total
  document.getElementById("totalPrice").textContent = totalPrix;
}
//--------------------------------------------------------------
//  formulaire
//--------------------------------------------------------------
if (page.match("cart")) {
  // les données du client seront stockées dans cet objet pour la commande sur page panier
  var contactClient = {};
  localStorage.contactClient = JSON.stringify(contactClient);
  var prenom = document.querySelector("#firstName");
  prenom.classList.add("regex_texte");
  var nom = document.querySelector("#lastName");
  nom.classList.add("regex_texte");
  var ville = document.querySelector("#city");
  ville.classList.add("regex_texte");
  var adresse = document.querySelector("#address");
  adresse.classList.add("regex_adresse");
  var email = document.querySelector("#email");
  email.classList.add("regex_email");
  var regexTexte = document.querySelectorAll(".regex_texte");
  // modification du type de l'input type email à text à cause d'un comportement de l'espace blanc non voulu vis à vis de la regex
  document.querySelector("#email").setAttribute("type", "text");
}
//--------------------------------------------------------------
//regex
//--------------------------------------------------------------
// /^ début regex qui valide les caratères
let regexLettre = /^[a-záàâäãåçéèêëíìîïñóòôöõúùûüýÿæœ\s-]{1,31}$/i;
// /^ début regex qui valide les caratères chiffre lettre et caratères spéciaux
let regexChiffreLettre = /^[a-z0-9áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœ\s-]{1,60}$/i;
let regValideEmail = /^[a-z0-9æœ.!#$%&’*+/=?^_`{|}~"(),:;<>@[\]-]{1,60}$/i;
let regMatchEmail =
  /^[a-zA-Z0-9æœ.!#$%&’*+/=?^_`{|}~"(),:;<>@[\]-]+@([\w-]+\.)+[\w-]{2,4}$/i;
//--------------------------------------------------------------
// Ecoute et attribution de point(pour sécurité du clic) si ces champs sont ok d'après la regex
//--------------------------------------------------------------
if (page.match("cart")) {
  regexTexte.forEach((regexTexte) =>
    regexTexte.addEventListener("input", (e) => {
      // valeur sera la valeur de l'input en dynamique
      valeur = e.target.value;
      // regNormal sera la valeur de la réponse regex, 0 ou -1
      let regNormal = valeur.search(regexLettre);
      if (regNormal === 0) {
        contactClient.firstName = prenom.value;
        contactClient.lastName = nom.value;
        contactClient.city = ville.value;
      }
      if (
        contactClient.city !== "" &&
        contactClient.lastName !== "" &&
        contactClient.firstName !== "" &&
        regNormal === 0
      ) {
        contactClient.regexNormal = 3;
      } else {
        contactClient.regexNormal = 0;
      }
      localStorage.contactClient = JSON.stringify(contactClient);
      valideClic();
    })
  );
}
//------------------------------------
// le champ écouté via la regex regexLettre fera réagir, grâce à texteInfo, la zone concernée
//------------------------------------
texteInfo(regexLettre, "#firstNameErrorMsg", prenom);
texteInfo(regexLettre, "#lastNameErrorMsg", nom);
texteInfo(regexLettre, "#cityErrorMsg", ville);
//--------------------------------------------------------------
// Ecoute et attribution de point(pour sécurité du clic) si ces champs sont ok d'après la regex
//--------------------------------------------------------------
if (page.match("cart")) {
  let regexAdresse = document.querySelector(".regex_adresse");
  regexAdresse.addEventListener("input", (e) => {
    // valeur sera la valeur de l'input en dynamique
    valeur = e.target.value;
    // regNormal sera la valeur de la réponse regex, 0 ou -1
    let regAdresse = valeur.search(regexChiffreLettre);
    if (regAdresse == 0) {
      contactClient.address = adresse.value;
    }
    if (contactClient.address !== "" && regAdresse === 0) {
      contactClient.regexAdresse = 1;
    } else {
      contactClient.regexAdresse = 0;
    }
    localStorage.contactClient = JSON.stringify(contactClient);
    valideClic();
  });
}
//------------------------------------
// le champ écouté via la regex regexChiffreLettre fera réagir, grâce à texteInfo, la zone concernée
//------------------------------------
texteInfo(regexChiffreLettre, "#addressErrorMsg", adresse);
//--------------------------------------------------------------
// Ecoute et attribution de point(pour sécurité du clic) si ce champ est ok d'après les regex
//--------------------------------------------------------------
if (page.match("cart")) {
  let regexEmail = document.querySelector(".regex_email");
  regexEmail.addEventListener("input", (e) => {
    // valeur sera la valeur de l'input en dynamique
    valeur = e.target.value;
    let regMatch = valeur.match(regMatchEmail);
    // quand le resultat sera correct, le console log affichera une autre réponse que null; regValide sera la valeur de la réponse regex, 0 ou -1
    let regValide = valeur.search(regValideEmail);
    if (regValide === 0 && regMatch !== null) {
      contactClient.email = email.value;
      contactClient.regexEmail = 1;
    } else {
      contactClient.regexEmail = 0;
    }
    localStorage.contactClient = JSON.stringify(contactClient);
    valideClic();
  });
}
//------------------------------------
// texte sous champ email
//------------------------------------
if (page.match("cart")) {
  email.addEventListener("input", (e) => {
    // valeur sera la valeur de l'input en dynamique
    valeur = e.target.value;
    let regMatch = valeur.match(regMatchEmail);
    let regValide = valeur.search(regValideEmail);
    // si valeur est toujours un string vide et la regex différante de 0 (regex à -1 et le champ est vide mais pas d'erreur)
    if (valeur === "" && regMatch === null) {
      document.querySelector("#emailErrorMsg").textContent =
        "Veuillez renseigner votre email.";
      document.querySelector("#emailErrorMsg").style.color = "white";
      // si valeur n'est plus un string vide et la regex différante de 0 (regex à -1 et le champ n'est pas vide donc il y a une erreur)
    } else if (regValide !== 0) {
      document.querySelector("#emailErrorMsg").innerHTML =
        "Caractère non valide";
      document.querySelector("#emailErrorMsg").style.color = "white";
      // pour le reste des cas (quand la regex ne décèle aucune erreur et est à 0 peu importe le champ vu qu'il est validé par la regex)
    } else if (valeur != "" && regMatch == null) {
      document.querySelector("#emailErrorMsg").innerHTML =
        "Caratères acceptés pour ce champ. Forme email pas encore valide";
      document.querySelector("#emailErrorMsg").style.color = "white";
    } else {
      document.querySelector("#emailErrorMsg").innerHTML =
        "Forme email valide.";
      document.querySelector("#emailErrorMsg").style.color = "white";
    }
  });
}

//--------------------------------------------------------------
// fonction d'affichage individuel des paragraphes sous input sauf pour l'input email
//--------------------------------------------------------------
function texteInfo(regex, pointage, zoneEcoute) {
  if (page.match("cart")) {
    zoneEcoute.addEventListener("input", (e) => {
      // valeur sera la valeur de l'input en dynamique
      valeur = e.target.value;
      index = valeur.search(regex);
      // si valeur est toujours un string vide et la regex différante de 0 (regex à -1 et le champ est vide mais pas d'erreur)
      if (valeur === "" && index != 0) {
        document.querySelector(pointage).textContent =
          "Vous devez renseigner tous les champs.";
        // si valeur n'est plus un string vide et la regex différante de 0 (regex à -1 et le champ n'est pas vide donc il y a une erreur)
      } else if (valeur !== "" && index != 0) {
        document.querySelector(pointage).innerHTML = "Reformulez cette donnée";
        // pour le reste des cas (quand la regex ne décèle aucune erreur et est à 0 peu importe le champ vu qu'il est validé par la regex)
      } else {
        document.querySelector(pointage).innerHTML = "Entrée valide.";
      }
    });
  }
}
//--------------------------------------------------------------
// Fonction de validation/d'accés au clic du bouton du formulaire
//--------------------------------------------------------------
let commande = document.querySelector("#order");
// la fonction sert à valider le clic de commande de manière interactive
function valideClic() {
  let contactRef = JSON.parse(localStorage.getItem("contactClient"));
  let somme =
    contactRef.regexNormal + contactRef.regexAdresse + contactRef.regexEmail;
  if (somme === 5) {
    commande.setAttribute("value", "Commander !");
  } else {
    commande.setAttribute("value", "Veuillez Remplir le formulaire");
  }
}
//----------------------------------------------------------------
// Envoi de la commande
//----------------------------------------------------------------
if (page.match("cart")) {
  commande.addEventListener("click", (e) => {
    // empeche de recharger la page on prévient le reload du bouton
    e.preventDefault();
    valideClic();
    envoiCommande();
  });
}
//----------------------------------------------------------------
// fonction récupérations des id puis mis dans un tableau
//----------------------------------------------------------------
// définition du panier quine comportera que les id des produits choisi du local storage
let panierId = [];
function tableauId() {
  // appel des ressources
  let panier = JSON.parse(localStorage.getItem("panierDansLocal"));
  // récupération des id produit dans panierId
  if (panier && panier.length > 0) {
    for (let indice of panier) {
      panierId.push(indice._id);
    }
  } else {
    console.log("le panier est vide");
    document.querySelector("#order").setAttribute("value", "Panier vide!");
  }
}
//----------------------------------------------------------------
// fonction récupération des donnée client et panier avant transformation
//----------------------------------------------------------------
let contactRef;
let commandeFinale;
function orderRequest() {
  contactRef = JSON.parse(localStorage.getItem("contactClient"));
  // définition de l'objet commande
  commandeFinale = {
    contact: {
      firstName: contactRef.firstName,
      lastName: contactRef.lastName,
      address: contactRef.address,
      city: contactRef.city,
      email: contactRef.email,
    },
    products: panierId,
  };
}
//----------------------------------------------------------------
// fonction sur la validation de l'envoi pour la commande
//----------------------------------------------------------------
function envoiCommande() {
  tableauId();
  orderRequest();
  // vision sur le orderRequest que l'on veut envoyer
  console.log(commandeFinale);
  let somme =
    contactRef.regexNormal + contactRef.regexAdresse + contactRef.regexEmail;
  // si le panierId contient des articles et que le clic est autorisé
  if (panierId.length != 0 && somme === 5) {
    // envoi à la ressource api
    fetch("http://localhost:3000/api/products/order", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(commandeFinale),
    })
      .then((res) => res.json())
      .then((data) => {
        // envoyé à la page confirmation, autre écriture de la valeur "./confirmation.html?commande=${data.orderId}"
        window.location.href = `./confirmation.html?commande=${data.orderId}`;
      })
      .catch(function (err) {
        console.log(err);
        alert("erreur");
      });
  }
}
