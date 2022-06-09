const OUTPUT_ATTRIBUTES = "OUTPUT_ATTRIBUTES";
const INPUT_ATTRIBUTES = "INPUT_ATTRIBUTES";
const OUTPUT_FORMAT = "OUTPUT_FORMAT";
const INPUT_FORMAT = "INPUT_FORMAT";


export const getSectionsHost = (data, attributeTemplate) =>{

    const input = 'IDENTIFICACION FORMATO DE ENTRADA';
    const output = 'IDENTIFICACION FORMATO DE SALIDA';
    const attributesDescription = 'DESCRIPCION DE LOS ATRIBUTOS'

    const inputFormatRegex = new RegExp(`${input}`, 'i');
    const outputFormatRegex = new RegExp(`${output}`,'i');
    const attributesDescriptionRegex = new RegExp(`${attributesDescription}`,'i');

    let sections = [];


    let startInputFormatIndex = 0;   
    let lastInputFormatIndex = 0;    
    let startOutputFormatIndex = 0;  
    let lastOutputFormatIndex = 0;   
    let lastInputIndexAux = 0;  
    let lastOutputIndexAux = 0;  

    data.forEach((element, index) => {
        // Tranformamos a string el objeto y le quitamos los accentos
        let row  = JSON.stringify(element).normalize("NFD").replace(/[\u0300-\u036f]/g, "");

        //Verificamos si inicia una seccion de formatos de entrada
        if (row.search(inputFormatRegex) !== -1){
            //console.log("start input format",row,index);
            startInputFormatIndex = index;
            startOutputFormatIndex = 0;
        }

        //Verificamos si inicia una seccion de formatos de salida
        if ( row.search(outputFormatRegex) !== -1){
            //console.log("start output format",row,index);
            startOutputFormatIndex = index;
            startInputFormatIndex = 0;
        }

        //Verificamos si termina una seccion de formatos de entrada/salida
        if(row.search(attributesDescriptionRegex) !== -1){
            if(startInputFormatIndex !== 0){
                lastInputFormatIndex = index;
            }else if (startOutputFormatIndex !== 0){
                lastOutputFormatIndex = index;
            }
        }
    
        //Si el rango de formatos de entrada esta definido ...
        if(startInputFormatIndex !== 0 && startInputFormatIndex < lastInputFormatIndex){
            /*si se inicio una nueva seccion de formatos de entrada entonces debemos
              verificar si existen atributos de entrada, en caso afirmativo se insertan
              como una nueva seccion de atributos de entrada
            */
            if(lastInputIndexAux !== 0 && lastInputIndexAux < startInputFormatIndex){
                //console.log(`Seccion input attributes  ${lastInputIndexAux} - ${startInputFormatIndex}`);
                sections.push({
                    section: data.slice(lastInputIndexAux,startInputFormatIndex + 1),
                    sectionType: INPUT_ATTRIBUTES
                });
                lastInputIndexAux = 0;
            }
            // ... lo insertamos como un nueva seccion de formatos de entrada
            //console.log(`Seccion input format  ${startInputFormatIndex} - ${lastInputFormatIndex}`);
            sections.push({
                section: data.slice(startInputFormatIndex,lastInputFormatIndex + 1),
                sectionType: INPUT_FORMAT
            });
            
            
            startInputFormatIndex = 0;
            lastInputIndexAux = lastInputFormatIndex;
            lastInputFormatIndex = 0;
        }
    
        //Si el rango de formatos de salida esta definido ...
        if(startOutputFormatIndex !== 0 && startOutputFormatIndex < lastOutputFormatIndex){
            
            /*si se inicio una nueva seccion de formatos de salida entonces debemos
              verificar si existen atributos de entrada anteriores, en caso afirmativo se insertan
              como una nueva seccion de atributos de entrada
            */
            if(lastInputIndexAux !== 0 && lastInputIndexAux < startOutputFormatIndex){
                //console.log(`Seccion input attributes  ${lastInputIndexAux +1 } - ${startOutputFormatIndex -1}`);
                sections.push({
                    section: data.slice(lastInputIndexAux + 1,startOutputFormatIndex),
                    sectionType: INPUT_ATTRIBUTES

                });
                lastInputIndexAux = 0;
            }
            
            /*si se inicio una nueva seccion de formatos de salida entonces debemos
              verificar si existen atributos de salida, en caso afirmativo se insertan
              como una nueva seccion de atributos de salida
            */
            if(lastOutputIndexAux !== 0 && lastOutputIndexAux < startOutputFormatIndex){
                //console.log(`Seccion output attributes  ${lastOutputIndexAux} - ${startOutputFormatIndex}`);
                sections.push({
                    section: data.slice(lastOutputIndexAux,startOutputFormatIndex + 1),
                    sectionType: OUTPUT_ATTRIBUTES
                });
                lastOutputIndexAux = 0;
            }
    
            // ... lo insertamos como un nueva seccion de formatos de salida
            //console.log(`Seccion output format  ${startOutputFormatIndex} - ${lastOutputFormatIndex}`);
            sections.push({
                section: data.slice(startOutputFormatIndex,lastOutputFormatIndex + 1),
                sectionType: OUTPUT_FORMAT

            });
            
            startOutputFormatIndex = 0;
            lastOutputIndexAux = lastOutputFormatIndex;
            lastOutputFormatIndex = 0;
        }
    })
    
    /*si se inicio una nueva seccion de formatos de entrada y no se cerro
      entonces debemos verificar si existen atributos de entrada, en caso
      afirmativo se insertan como una nueva seccion de atributos de entrada
    */
    if (lastInputIndexAux !== 0 && lastInputIndexAux !== data.length){
        //console.log(`Seccion input attributes  ${lastInputIndexAux + 1 } - ${data.length-1}`);
        sections.push({
            section: data.slice(lastInputIndexAux + 1 ,data.length - 1),
            sectionType: INPUT_ATTRIBUTES
        });

    /*si se inicio una nueva seccion de formatos de salida y no se cerro
      entonces debemos verificar si existen atributos de salida, en caso
      afirmativo se insertan como una nueva seccion de atributos de salida
    */    
    }else if (lastOutputIndexAux !== 0 && lastOutputIndexAux !== data.length){
        //console.log(`Seccion output attributes  ${lastOutputIndexAux + 1 } - ${data.length-1}`);
        sections.push({
            section: data.slice(lastOutputIndexAux + 1 ,data.length - 1),
            sectionType: OUTPUT_ATTRIBUTES
        });
    }
    //console.log(sections.length);

    return sections;
}



