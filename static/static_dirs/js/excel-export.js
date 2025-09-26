// THIS ENTIRE SCRIPT HANDLES EXCEL EXPORT //

document.getElementById("entryTableID").addEventListener("input", function () {
    const tableTitle = document.getElementById("titleImage");
    const value = this.value.trim();
    tableTitle.innerHTML = value !== "" ? "<b>Table ID:</b> " + value : "<b>Table ID:</b> ";
});

let uploadedWorkbook = null;
let uploadedFileName = null;

document.getElementById("upload-excel").addEventListener("change", function (e) {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
        const data = new Uint8Array(e.target.result);
        uploadedWorkbook = XLSX.read(data, { type: "array" });
    };

    reader.readAsArrayBuffer(file);
});

document.getElementById("exportEx").addEventListener("click", function () {
    const manualID = document.getElementById("entryTableID");
    const tableTitle = document.getElementById("titleImage");
    const table = document.getElementById("table");

    const baseFileName = manualID.value.trim() !== "" ? manualID.value.trim() : "measurements";
    const fileName = baseFileName + ".xlsx";
    const sheetName = baseFileName;

    // Update table title
    tableTitle.innerHTML = "<b>Table ID:</b> " + baseFileName;

    const newSheet = XLSX.utils.table_to_sheet(table);

    if (uploadedWorkbook) {
        if (uploadedWorkbook.SheetNames.includes(sheetName)) {
            const confirmOverwrite = confirm(`A sheet named "${sheetName}" already exists. Do you want to overwrite it and create a new file?`);
            if (!confirmOverwrite) return;

            // Remove existing sheet before replacing
            const index = uploadedWorkbook.SheetNames.indexOf(sheetName);
            delete uploadedWorkbook.Sheets[sheetName];
            uploadedWorkbook.SheetNames.splice(index, 1);
        }

        XLSX.utils.book_append_sheet(uploadedWorkbook, newSheet, sheetName);
        XLSX.writeFile(uploadedWorkbook, uploadedFileName || fileName); // Safe fallback
    } else {
        const newWb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(newWb, newSheet, sheetName);
        XLSX.writeFile(newWb, fileName);
    }

    // Reset upload state
    document.getElementById("upload-excel").value = "";
    uploadedWorkbook = null;
    uploadedFileName = null;
});


document.getElementById("resetUpload").addEventListener("click", function () {
    document.getElementById("upload-excel").value = "";
    uploadedWorkbook = null;
});