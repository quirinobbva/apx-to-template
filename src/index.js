import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import UploadFile from './UploadFile'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <UploadFile keys ={["field","description","type","inputOutput","required"]} outputFilePath = {"plantilla.csv"}/>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
