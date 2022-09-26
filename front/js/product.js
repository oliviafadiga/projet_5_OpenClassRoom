//--------------------------------------------------------------------------
// Récupération de l'id du produit via l' URL
//--------------------------------------------------------------------------
const params = new URLSearchParams(document.location.href);
console.log(document.location)
const id = params.get("_id");
console.log(id); 