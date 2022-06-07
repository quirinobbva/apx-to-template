import React from "react";
import * as xlsx from 'xlsx';
import { readJson } from "./readJson";
//import * as fs from 'fs';

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

export async function WriteFile(data, headers, outputFilename){
    let workSheet = await xlsx.utils.json_to_sheet(data,{header: headers, skipHeader: true});
    let workBook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workBook, workSheet, "BackendData");
    console.log(workBook);
    await xlsx.writeFile(workBook, outputFilename, { bookType: "csv" });
}

export default readAPX;