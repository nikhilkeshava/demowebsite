//convert json into csv
$(document).ready(function () {
    $('#btnCSV').click(function () {

        var file_to_read = document.getElementById("txtJson").files[0];
        var ReportName = $('#txtReportName').val();
        var fileread = new FileReader();
        fileread.onload = function(e) {
          var content = e.target.result;
          // console.log(content);
          var intern = JSON.parse(content); // Array of Objects.
          console.log(intern); // You can index every object
          Export_JSON_to_CSV(intern, ReportName, true);         
        };
        fileread.readAsText(file_to_read);
        // var ReportName = $('#txtReportName').val();
        if (ReportName == '') {
            alert("Report Name should not Empty, Please Enter Report Name.");
            return;
        }
       
       
    });
});

function Export_JSON_to_CSV(JSONString, ReportName, isShowHeader) {
    var arrJsonData = typeof JSONString != 'object' ? JSON.parse(JSONString) : JSONString;
    var CSV = '';
    CSV += ReportName + '\r\n\n';
    if (isShowHeader) {
        var row = "";
        for (var index in arrJsonData[0]) {
            row += index + ',';
        }
        row = row.slice(0, -1);
        CSV += row + '\r\n';
    }
    for (var i = 0; i < arrJsonData.length; i++) {
        var row = "";
        for (var index in arrJsonData[i]) {
            row += '"' + arrJsonData[i][index] + '",';
        }
        row.slice(0, row.length - 1);
        CSV += row + '\r\n';
    }
    if (CSV == '') {
        alert("Invalid JsonData");
        return;
    }
    var fileName = "CSV_";
    fileName += ReportName.replace(/ /g, "_");
    var uri = 'Data:text/csv;charset=utf-8,' + escape(CSV);
    var link = document.createElement("a");
    link.href = uri;
    link.style = "visibility:hidden";
    link.download = fileName + ".csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}


//convert csv to json
function Upload() {
    var fileUpload = document.getElementById("fileUpload");
    var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv)$/;
    if (regex.test(fileUpload.value.toLowerCase())) {
        if (typeof (FileReader) != "undefined") {
            var reader = new FileReader();
            reader.onload = function (e) {
                var lines=e.target.result.split('\r');
                for(let i = 0; i<lines.length; i++){
                lines[i] = lines[i].replace(/\s/,'')//delete all blanks
                }
                var result = [];

                var headers=lines[0].split(",");

                for(var i=1;i<lines.length;i++){

                    var obj = {};
                    var currentline=lines[i].split(",");

                    for(var j=0;j<headers.length;j++){
                        obj[headers[j]] = currentline[j];
                    }

                    result.push(obj);

                }

                //return result; //JavaScript object
              
                var result=JSON.stringify(result,undefined,4);
               
                var ReportName = document.getElementById('filecsv').value;
                Export_CSV_to_JSON(result, ReportName, true);
              
               
                
            }
            reader.readAsText(fileUpload.files[0]);
        } else {
            alert("This browser does not support HTML5.");
        }
    } else {
        alert("Please upload a valid CSV file.");
    }
}
function Export_CSV_to_JSON(JSONString, ReportName, isShowHeader) {
   
   var fileName = "json_";
   fileName += ReportName.replace(/ /g, "_");
   var uri = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSONString);
   var link = document.createElement("a");
   link.href = uri;
   link.style = "visibility:hidden";
   link.download = fileName + ".json";
   document.body.appendChild(link);
   link.click();
   document.body.removeChild(link);
}