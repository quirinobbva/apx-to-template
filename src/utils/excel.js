import * as xlsx from 'xlsx';
import { readJson } from "./readJson";
import { getSectionsHost } from './readHost'
//import * as fs from 'fs';

const { inputOutputTypes } = require('./parametry');
const { templateCompareCaseThree, templateCompareCaseFour } = require('./readJson');

const OUTPUT_ATTRIBUTES = "OUTPUT_ATTRIBUTES";
const INPUT_ATTRIBUTES = "INPUT_ATTRIBUTES";
const OUTPUT_FORMAT = "OUTPUT_FORMAT";
const INPUT_FORMAT = "INPUT_FORMAT";

//const originalKeysCaseOne = JSON.stringify([ "__EMPTY","__EMPTY_1", "__EMPTY_3", "__EMPTY_4", "__EMPTY_5"]);
//const originalKeysCaseTwo = JSON.stringify([" ","__EMPTY","__EMPTY_2", "__EMPTY_3", "__EMPTY_4"]);

const originalKeysCaseOne = JSON.stringify([" ","__EMPTY","__EMPTY_1", "__EMPTY_3", "__EMPTY_4", "__EMPTY_5"]).replace('[','').replace(']','');
const originalKeysCaseTwo = JSON.stringify(["__EMPTY","__EMPTY_1", "__EMPTY_3", "__EMPTY_4", "__EMPTY_5"]).replace('[','').replace(']','');
const originalKeysCaseThree = JSON.stringify([" ","__EMPTY","__EMPTY_2", "__EMPTY_3", "__EMPTY_4"]).replace('[','').replace(']','');

const checkMinimalCellsCaseOne = (element) => {
    if(element["__EMPTY"] !== undefined && element["__EMPTY_2"] !== undefined && element["__EMPTY_3"] !== undefined && element["__EMPTY_5"] !== undefined){
        return true;
    }
    return false;
}

const checkMinimalCellsCaseTwo = (element) => {
    if(element[" "] !== undefined && element["__EMPTY"] !== undefined && element["__EMPTY_2"] !== undefined && element["__EMPTY_4"] !== undefined){
        return true;
    }
    return false;
}

const checkMinimalCellsCaseThree = (element) => {
    if(element[" "] !== undefined && element["__EMPTY_1"] !== undefined && element["__EMPTY_2"] !== undefined && element["__EMPTY_4"] !== undefined){
        return true;
    }
    return false;
}

export async function readAPX(fileData) {
    const workBook = xlsx.read(fileData);
    let data = [];
    const sheets = workBook.SheetNames
    let temp = 0;
    for(let i = 0; i < sheets.length; i++)
    {
            temp = xlsx.utils.sheet_to_json(workBook.Sheets[workBook.SheetNames[i]]) 
            temp.forEach((res) => {
                data.push(res)
            }
        )
    }
    return await readJson(data);
    //await fs.writeFileSync(jsonFilePath, JSON.stringify(data,null,4));
}

export async function readHostExcelFile(fileData) {
    const workBook = xlsx.read(fileData);
    let data = [];
    const sheets = workBook.SheetNames
    let temp = 0;
    if(sheets.length){
        for(let i = 0; i < 1; i++)
        {
                temp = xlsx.utils.sheet_to_json(workBook.Sheets[workBook.SheetNames[i]]) 
                temp.forEach((res) => {
                    data.push(res)
                }
            )
        }
        let attributes = await getHostAttributes(data);
        return attributes.length ? attributes: false;
    }
    //return await readJson(data);
}

export async function WriteFile(data, headers, outputFilename){
    let workSheet = xlsx.utils.json_to_sheet(data, { header: headers, skipHeader: true });
    let workBook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workBook, workSheet, "BackendData");
    //console.log(workBook);
    await xlsx.writeFile(workBook, outputFilename, { bookType: "csv" });
}

export function getHostAttributes(data){
    let sections = getSectionsHost(data,{});
    //console.log(sections);
    let formatInput = undefined;
    let formatOutput = undefined;
    let attributes = [];
    let attributeTemplate = {}
    
    sections.forEach( (section) => {
        //console.log(section);
        switch (section.sectionType) {
            case INPUT_FORMAT:
                section.section.forEach(element =>{
                    let keys = Object.keys(element);
                    //if(JSON.stringify(keys) === originalKeysCaseOne){
                    if (JSON.stringify(keys).indexOf(originalKeysCaseOne) !== -1){
                        formatInput = String(element["__EMPTY"]).trim();
                    }
                    if (JSON.stringify(keys).indexOf(originalKeysCaseTwo) !== -1){
                        formatInput = String(element["__EMPTY"]).trim();
                    }
                    //if (JSON.stringify(keys) === originalKeysCaseTwo){
                    if (JSON.stringify(keys).indexOf(originalKeysCaseThree) !== -1){
                        formatInput = String(element[" "]).trim();
                    }
                });
                break;
            case OUTPUT_FORMAT:
                section.section.forEach(element =>{
                    let keys = Object.keys(element);
                    if(JSON.stringify(keys).indexOf(originalKeysCaseOne) !== -1){
                        formatOutput = String(element["__EMPTY"]).trim();
                    }
                    if (JSON.stringify(keys).indexOf(originalKeysCaseTwo) !== -1){
                        formatOutput = String(element["__EMPTY"]).trim();
                    }
                    if (JSON.stringify(keys).indexOf(originalKeysCaseThree) !== -1){
                        formatOutput = String(element[" "]).trim();
                    }
                });
                break;
            case INPUT_ATTRIBUTES:
                section.section.forEach(element =>{
                    attributeTemplate = {};
                    //console.log(element);
                    if(checkMinimalCellsCaseOne(element) && formatInput !== undefined){
                        templateCompareCaseThree(element, attributeTemplate);
                        attributeTemplate.field = formatInput.concat("-",String(element["__EMPTY"]).trim());
                        attributeTemplate.description = String(element["__EMPTY_2"]).trim();
                        attributeTemplate.inputOutput = inputOutputTypes.input.type;
                    }else if(checkMinimalCellsCaseThree(element) && formatInput !== undefined){
                        templateCompareCaseFour(element, attributeTemplate);
                        attributeTemplate.field = formatInput.concat("-",String(element[" "]).trim());
                        attributeTemplate.description = String(element["__EMPTY_1"]).trim();
                        attributeTemplate.inputOutput = inputOutputTypes.input.type;
                    }else if(checkMinimalCellsCaseTwo(element) && formatInput !== undefined){
                        templateCompareCaseFour(element, attributeTemplate);
                        attributeTemplate.field = formatInput.concat("-",String(element[" "]).trim());
                        attributeTemplate.description = String(element["__EMPTY"]).trim();
                        attributeTemplate.inputOutput = inputOutputTypes.input.type;
                    }
                    //console.log(attributeTemplate);
                    if (attributeTemplate.field !== undefined && attributeTemplate.description !== undefined && attributeTemplate.type !== undefined && attributeTemplate.inputOutput !== undefined && attributeTemplate.required !== undefined){
                        //attributes.push([attributeTemplate.field, attributeTemplate.description, attributeTemplate.type, attributeTemplate.inputOutput, attributeTemplate.required]);
                        attributes.push({...attributeTemplate});
                    }
                });
                formatInput = undefined;
                break;
            case OUTPUT_ATTRIBUTES:
                section.section.forEach(element =>{
                    attributeTemplate = {};
                    if(checkMinimalCellsCaseOne(element) && formatOutput !== undefined){
                        templateCompareCaseThree(element, attributeTemplate);
                        attributeTemplate.field = formatOutput.concat("-",String(element["__EMPTY"]).trim());
                        attributeTemplate.description = String(element["__EMPTY_2"]).trim();
                        attributeTemplate.inputOutput = inputOutputTypes.output.type;
                    }else if(checkMinimalCellsCaseThree(element) && formatOutput !== undefined){
                        templateCompareCaseFour(element, attributeTemplate);
                        attributeTemplate.field = formatOutput.concat("-",String(element[" "]).trim());
                        attributeTemplate.description = String(element["__EMPTY_1"]).trim();
                        attributeTemplate.inputOutput = inputOutputTypes.output.type;
                    }else if(checkMinimalCellsCaseTwo(element) && formatOutput !== undefined){
                        templateCompareCaseFour(element, attributeTemplate);
                        attributeTemplate.field = formatOutput.concat("-",String(element[" "]).trim());
                        attributeTemplate.description = String(element["__EMPTY"]).trim();
                        attributeTemplate.inputOutput = inputOutputTypes.output.type;
                    }
                    if (attributeTemplate.field !== undefined && attributeTemplate.description !== undefined && attributeTemplate.type !== undefined && attributeTemplate.inputOutput !== undefined && attributeTemplate.required !== undefined){
                        //attributes.push([attributeTemplate.field, attributeTemplate.description, attributeTemplate.type, attributeTemplate.inputOutput, attributeTemplate.required]);
                        attributes.push({...attributeTemplate});
                    }
                    //console.log(attributeTemplate);
                });
                formatOutput = undefined;
                break;
            default:
                break;
        }
    })
    attributes.unshift({field:"Field", description:"Description", type:"Type", inputOutput :"Input-output", required:"Required"});
    return attributes;
}