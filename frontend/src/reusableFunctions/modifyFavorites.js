
export function modifyFavorites(product, favorites){
    var newFavorites = [...favorites];
    if(newFavorites.find(element => element.id === product.id.toString()) !== undefined){
        newFavorites.splice(newFavorites.findIndex(prod => prod.id === product.id), 1);
        sessionStorage.removeItem(product.id.toString());
        if(window.location.href.includes("favorites")){
           window.location.reload(); 
        }
    }
    else{
        newFavorites.push(product);
        sessionStorage.setItem(product.id.toString(), JSON.stringify(product));
    }
    return newFavorites;
}