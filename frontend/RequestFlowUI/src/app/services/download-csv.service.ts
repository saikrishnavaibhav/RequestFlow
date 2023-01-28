import { Injectable } from '@angular/core';
import { CSVRecord } from '../new-request/new-request.component';

@Injectable({
  providedIn: 'root'
})
export class DownloadCsvService {

  constructor() { }

  downloadFile(data:CSVRecord[], filename = 'data') {
    let csvData = this.ConvertToCSV(data, [
        'name', 'age', 'average', 'approved', 'description'
    ]);
    console.log(csvData)
    let blob = new Blob(['\ufeff' + csvData], {
        type: 'text/csv;charset=utf-8;'
    });
    let dwldLink = document.createElement("a");
    let url = URL.createObjectURL(blob);
    
    navigator.userAgent.indexOf('Chrome') == -1;
    dwldLink.setAttribute("href", url);
    dwldLink.setAttribute("download", filename + ".csv");
    dwldLink.style.visibility = "hidden";
    document.body.appendChild(dwldLink);
    dwldLink.click();
    document.body.removeChild(dwldLink);
}
ConvertToCSV(objArray: CSVRecord[], headerList:String[]) {
    // let array =
    //     typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    // let str = '';
    // let row = 'S.No, ';
    // for (let index in headerList) {
    //     row += headerList[index] + ', ';
    // }
    // row = row.slice(0, -1);
    // str += row + '\r\n';
    // for (let i = 0; i & lt; array.length; i++) {
    //     let line = (i + 1) + & #039;&# 039;;
    //     for (let index in headerList) {
    //         let head = headerList[index];
    //         line += & #039;, &# 039; + array[i][head];
    //     }
    //     str += line + & #039;\r\n&# 039;;
    // }
    // return str;

}
}
