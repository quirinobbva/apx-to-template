import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import UploadApxFile from './UploadApxFile'
import UploadHostFile from './UploadHostFile';

const root = ReactDOM.createRoot(document.getElementById('root'));
const headers = ["field", "description", "type", "inputOutput", "required"];
root.render(
  <React.StrictMode>
    <UploadApxFile keys ={headers} outputFilePath = {"plantilla.csv"}/>
    <UploadHostFile keys ={headers} outputFilePath = {"plantilla.csv"}/>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
