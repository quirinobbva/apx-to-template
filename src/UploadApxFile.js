import React, {useEffect, useState} from 'react';
import {readAPX} from './utils/excel.js';
import { WriteFile } from './utils/excel.js';
import './index.css'
const UploadApxFile = (props) => {

    const [csvData, setCsvData] = useState(false);

    const changeHandler = async (event) => {
        let file = event.target.files[0];
        if(file !== undefined && file !== null && file){
            let data = await file.arrayBuffer();
            let attributes = await readAPX(data);
            if(attributes){
                WriteFile(attributes, props.keys, props.outputFilePath)
                setCsvData(attributes);
            }
        }
    };

    const onClickDownloadHandler = () =>{
        if(csvData){
            WriteFile(csvData, props.keys, props.outputFilePath)
        }
    }

    const onClickInputFileHandler = (e) => {
        e.target.value = null;
        setCsvData(false);
    }

     useEffect (()=>{
         //console.log(csvData);
     }, [csvData])

    return(
        <div className='button-container'>
            <label className='button'>
                <input type="file" name="apxFile" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" onChange={changeHandler} onClick={onClickInputFileHandler}/>
                Upload your APX file
            </label>
            {csvData ? <button className='button' onClick={onClickDownloadHandler}>Download Again</button> : <></>}
        </div>
    )
}

export default UploadApxFile;