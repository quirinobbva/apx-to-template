import { inputOutputTypes, requiredTypes,dataTypes } from './parametry';
let originalKeysCaseOne = JSON.stringify([ '__EMPTY_1', '__EMPTY_2', '__EMPTY_3', '__EMPTY_4', '__EMPTY_5' ]);
let originalKeysCaseTwo = JSON.stringify([ '__EMPTY','__EMPTY_1', '__EMPTY_2', '__EMPTY_3', '__EMPTY_4' ]);
let attributeTemplate = {};

// const equals = (a, b) => JSON.stringify(a) === JSON.stringify(b);

const elementExitsInObject = (a,types) => {
    let keys = Object.keys(types);
    for(let i = 0; i < keys.length; i++){
        let type = undefined;
        for (let j = 0; j < types[keys[i]].simils.length; j++){
            if(types[keys[i]].simils[j].toLowerCase() === a.toLowerCase()){
                type = types[keys[i]].type
            }
        }
        if (type){
            return type;
        }
    }
}

const templateCompareCaseOne = (element) =>{
    let aux = undefined;
    aux = elementExitsInObject(element["__EMPTY_1"].trim(), inputOutputTypes);
    if (aux !== undefined){
        attributeTemplate.inputOutput = aux;
    }

    aux = undefined;
    aux = elementExitsInObject(element["__EMPTY_3"].trim(), requiredTypes);
    if (aux !== undefined){
        attributeTemplate.required = aux;
    }

    aux = element['__EMPTY_2'].trim();
    if (aux[aux.length -1] === ']'){
        attributeTemplate.type = dataTypes.Object.type;
    } else {
        aux = elementExitsInObject(element["__EMPTY_4"].trim(), dataTypes);
        if (aux !== undefined){
            attributeTemplate.type = aux;
        }
    }
}

const templateCompareCaseTwo = (element) =>{
    let aux = undefined;
    aux = elementExitsInObject(element["__EMPTY"].trim(), inputOutputTypes);
    if (aux !== undefined){
        attributeTemplate.inputOutput = aux;
    }

    aux = undefined;
    aux = elementExitsInObject(element["__EMPTY_2"].trim(), requiredTypes);
    if (aux !== undefined){
        attributeTemplate.required = aux;
    }

    aux = element['__EMPTY_1'].trim();
    if (aux[aux.length -1] === ']'){
        attributeTemplate.type = dataTypes.Object.type;
    } else {
        aux = elementExitsInObject(element["__EMPTY_3"].trim(), dataTypes);
        if (aux !== undefined){
            attributeTemplate.type = aux;
        }
    }
}

export function readJson(jsonData) {
    //console.log(jsonData);
    let apx = jsonData
    let attributes = [];
    //console.log("#####",apx);
    apx.forEach((element)=>{
        let keys = Object.keys(element);
        attributeTemplate = {};
        switch (JSON.stringify(keys)) {
            case originalKeysCaseOne:
                templateCompareCaseOne(element);
                attributeTemplate.field = element["__EMPTY_2"].trim();
                attributeTemplate.description = element["__EMPTY_5"].trim();
                break;
            case originalKeysCaseTwo:
                templateCompareCaseTwo(element);
                attributeTemplate.field = element["__EMPTY_1"].trim();
                attributeTemplate.description = element["__EMPTY_4"].trim();
                break;
            default:
                break;
        }

        if (attributeTemplate.field !== undefined && attributeTemplate.description !== undefined && attributeTemplate.type !== undefined && attributeTemplate.inputOutput !== undefined && attributeTemplate.required !== undefined){
            //attributes.push([attributeTemplate.field, attributeTemplate.description, attributeTemplate.type, attributeTemplate.inputOutput, attributeTemplate.required]);
            attributes.push({...attributeTemplate});
        }
        
    })
    //console.log("########", attributes);
    attributes.unshift({field:"Field", description:"Description", type:"Type", inputOutput :"Input-output", required:"Required"});

    return attributes;
}
