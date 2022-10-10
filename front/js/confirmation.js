(function Commande() {
  sessionStorage.clear();
  localStorage.clear();
  // valeur du numero de commande
  let numCom = new URLSearchParams(document.location.search).get("commande");
  //   console.log(numCom);
  // merci et mise en page
  document.querySelector(
    "#orderId"
  ).innerHTML = `<br>${numCom}<br>Merci pour votre achat livraison en cours !`;
  console.log("valeur de l'orderId venant de l'url: " + numCom);
  //réinitialisation du numero de commande
  numCom = undefined;
})();
