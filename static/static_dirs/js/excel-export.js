// THIS ENTIRE SCRIPT HANDLES EXCEL EXPORT //

document.getElementById("entryTableID").addEventListener("input", function () {
    const tableTitle = document.getElementById("titleImage");
    const value = this.value.trim();
    tableTitle.innerHTML = value !== "" ? "<b>Table ID:</b> " + value : "<b>Table ID:</b> ";
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
    const newWb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(newWb, newSheet, sheetName);
    XLSX.writeFile(newWb, fileName);
});