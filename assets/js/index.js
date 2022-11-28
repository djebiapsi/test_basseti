filePrograms = "assets/program-v2.json"
fileMaterials = "assets/materials-v2.json"
/**
 * Fonction asynchrone qui cnvertit un fichier JSON en entrée en objet
 * javasript  en sortie
 * 
 * @param {String} filepath : route vers le fichier JSON
 * @returns response objet javascript correspondant au fichier JSON
 */
async function json2object(filepath){
    let rep = await fetch(filepath)
    let reponse = await rep.json();
    return reponse;
}

/**
 * Associe et trie de maniere croissante les valeurs de deux tableau 
 * @param {array} array1 
 * @param {array} array2 
 * @returns array
 */
function assosciateArray(array1, array2){
    
    let array = []
    array1.forEach((element, index) =>{
        let assoc = {}
        assoc["array1"] = element
        assoc["array2"] = array2[index]
        array.push(assoc)
    })
    
    array = array.sort(
        (a,b) =>  {return a.array1 - b.array1;});
    //console.log(array)
    return array
}

/**
 * Fonction qui modifie la DOM afin d'afficher les valeurs d'un array dans le tableau
 * @param {HTMLtr} parent1 
 * @param {HTMLtr} parent2 
 * @param {array} values 
 * @param {string} unit 
 */
function displayValue(parent1, parent2, values, unit = "") {
    //affichage des variable
    let children1 = [].slice.call(parent1.children)
    children1.forEach((children, key) => {
        children.innerHTML = values[key].array1 +" °C"
    })

    let children2 = [].slice.call(parent2.children)
    children2.forEach((children, key) => {
        children.innerHTML = values[key].array2 +" "+ unit
    })
}


//Initialisation des variables
let programs
let material
let title_modal = document.getElementById("name")
const tableMat = document.getElementById("material")
const tbody = document.getElementById("programs")
const tbCP = document.getElementById("coeffP_temp")
const tbMV = document.getElementById("mV_temp")
const trTempMV = document.getElementById("tempMv")
const trTempCP = document.getElementById("tempCp")
const trMV = document.getElementById("mV")
const trCP = document.getElementById("cp")


async function infoMat(id) {
    json2object(fileMaterials).then((mats) => {
        material = null
        mats.forEach(mat =>{
            //Isoler le materiau concerné
            
            if (mat.id == id) {
                material = mat
            }
            
        })
        if (material === null) {
            //Cache le tableau et afiche un message
            tableMat.classList.add('d-none')
            title_modal.innerHTML = "Aucun materiau attribué"
        }else{
            //raffiche le tableau
            tableMat.classList.remove('d-none')
            // console.log(material)
            //Nom de l'element présenté
            title_modal.innerHTML = material.name
            mV = material.properties.masseVolumique.data
            coeffPoisson = material.properties.coeffPoisson.data
            mV = assosciateArray(mV[0].Temperature,mV[1].Densite)
            coeffPoisson = assosciateArray(coeffPoisson[0].Temperature,coeffPoisson[1].nuX)
            //affichage des variable
            displayValue(trTempCP, trCP, coeffPoisson)
            displayValue(trTempMV, trMV, mV, )

        }
    })
}



json2object(filePrograms).then((prog) => {
    programs = prog['programs']
    programs.forEach(program => {
        tnew = tbody.insertRow()
        nom = tnew.insertCell(0)
        nom.innerHTML = program.sName
        pieces = tnew.insertCell(1)
        program.pieces.forEach(piece => {
            pieces.innerHTML += "<a href='#' onClick='infoMat("+piece.idMaterial+")' data-bs-target='#details' data-bs-toggle='modal'><span class='badge bg-warning mx-3'>" + piece.sName + "</span></a>"
        })
        
    });
})



