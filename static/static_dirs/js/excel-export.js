// THIS ENTIRE SCRIPT HANDLES EXCEL EXPORT //

// textContent, not innerHTML: the ID is typed by the user
function setTableTitle(value) {
    const label = document.createElement("b");
    label.textContent = "Table ID:";
    document.getElementById("titleImage").replaceChildren(label, " " + value);
}

document.getElementById("entryTableID").addEventListener("input", function () {
    setTableTitle(this.value.trim());
});


document.getElementById("exportEx").addEventListener("click", function () {
    const manualID = document.getElementById("entryTableID");
    const table = document.getElementById("table");

    const baseFileName = manualID.value.trim() !== "" ? manualID.value.trim() : "measurements";
    const fileName = baseFileName + ".xlsx";
    // Excel refuses sheet names longer than 31 characters or containing \ / ? * [ ] :
    const sheetName = baseFileName.replace(/[\\/?*[\]:]/g, "_").slice(0, 31);

    setTableTitle(baseFileName);

    const newSheet = XLSX.utils.table_to_sheet(table);
    const newWb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(newWb, newSheet, sheetName);
    XLSX.writeFile(newWb, fileName);
});
