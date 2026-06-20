var jpdbBaseURL = "http://api.login2explore.com:5577";
var jpdbIRL = "/api/irl";
var jpdbIML = "/api/iml";
var studentDBName = "SCHOOL-DB";
var studentRelationName = "STUDENT-TABLE";
var connToken = "90935137|-31949241290956141|90958599"; 


$(document).ready(function() {
    $("#rollNo").focus();
});

function saveRecNo2LS(jsonObj) {
    var lvData = JSON.parse(jsonObj.data);
    localStorage.setItem("recno", lvData.rec_no);
}

function getRollNoAsJsonObj() {
    var rollNo = $("#rollNo").val();
    var jsonStr = {
        rollNo: rollNo
    };
    return JSON.stringify(jsonStr);
}

function fillData(jsonObj) {
    saveRecNo2LS(jsonObj);
    var data = JSON.parse(jsonObj.data).record;
    $("#fullName").val(data.fullName);
    $("#className").val(data.className);
    $("#birthDate").val(data.birthDate);
    $("#address").val(data.address);
    $("#enrollDate").val(data.enrollDate);
}

function resetForm() {
    $("#rollNo").val("");
    $("#fullName").val("");
    $("#className").val("");
    $("#birthDate").val("");
    $("#address").val("");
    $("#enrollDate").val("");
    
  
    $("#rollNo").prop("disabled", false);
    $("#fullName").prop("disabled", true);
    $("#className").prop("disabled", true);
    $("#birthDate").prop("disabled", true);
    $("#address").prop("disabled", true);
    $("#enrollDate").prop("disabled", true);
    
   
    $("#save").prop("disabled", true);
    $("#update").prop("disabled", true);
    $("#reset").prop("disabled", true);
    
    $("#rollNo").focus();
}

function validateData() {
    var rollNo = $("#rollNo").val();
    var fullName = $("#fullName").val();
    var className = $("#className").val();
    var birthDate = $("#birthDate").val();
    var address = $("#address").val();
    var enrollDate = $("#enrollDate").val();

    if (rollNo === "") { alert("Roll No is required"); $("#rollNo").focus(); return ""; }
    if (fullName === "") { alert("Full Name is required"); $("#fullName").focus(); return ""; }
    if (className === "") { alert("Class is required"); $("#className").focus(); return ""; }
    if (birthDate === "") { alert("Birth Date is required"); $("#birthDate").focus(); return ""; }
    if (address === "") { alert("Address is required"); $("#address").focus(); return ""; }
    if (enrollDate === "") { alert("Enrollment Date is required"); $("#enrollDate").focus(); return ""; }

    var jsonStrObj = {
        rollNo: rollNo,
        fullName: fullName,
        className: className,
        birthDate: birthDate,
        address: address,
        enrollDate: enrollDate
    };
    return JSON.stringify(jsonStrObj);
}

function checkStudentExists() {
    var rollNoJsonObj = getRollNoAsJsonObj();
    var getRequest = createGET_BY_KEYRequest(connToken, studentDBName, studentRelationName, rollNoJsonObj);
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseURL, jpdbIRL);
    jQuery.ajaxSetup({async: true});

    if (resJsonObj.status === 400) {
        
        $("#save").prop("disabled", false);
        $("#reset").prop("disabled", false);
        
        $("#fullName").prop("disabled", false);
        $("#className").prop("disabled", false);
        $("#birthDate").prop("disabled", false);
        $("#address").prop("disabled", false);
        $("#enrollDate").prop("disabled", false);
        
        $("#fullName").focus();
    } else if (resJsonObj.status === 200) {
       
        
        $("#rollNo").prop("disabled", true);
        fillData(resJsonObj);
        
        $("#update").prop("disabled", false);
        $("#reset").prop("disabled", false);
        
        $("#fullName").prop("disabled", false);
        $("#className").prop("disabled", false);
        $("#birthDate").prop("disabled", false);
        $("#address").prop("disabled", false);
        $("#enrollDate").prop("disabled", false);
        
        $("#fullName").focus();
    }
}

function getRecNoFromLS() {
    return localStorage.getItem("recno");
}

function saveData() {
    var jsonStrObj = validateData();
    if (jsonStrObj === "") { return; }
    var putRequest = createPUTRequest(connToken, jsonStrObj, studentDBName, studentRelationName);
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(putRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({async: true});
    
    alert("Record Saved Successfully!");
    resetForm();
}

function updateData() {
    var jsonChg = validateData();
    if (jsonChg === "") { return; }
    var updateRequest = createUPDATERecordRequest(connToken, jsonChg, studentDBName, studentRelationName, getRecNoFromLS());
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({async: true});
    
    alert("Record Updated Successfully!");
    resetForm();
}