// THIS SCRIPT HANDLES COPYING ENTIRE HTML TABLE TO USER CLIPBOARD //

document.getElementById("copyTable").addEventListener("click", function () {
    const table = document.getElementById("table");
    if (!table) {
        alert("Table not found.");
        return;
    }

    let tableText = "";
    for (let row of table.rows) {
        let rowText = [];
        for (let cell of row.cells) {
            rowText.push(cell.innerText.trim());
        }
        tableText += rowText.join("\t") + "\n"; // tab-delimited
    }

    // Copy to clipboard using Clipboard API
    navigator.clipboard.writeText(tableText)
        .then(() => {
            alert("Table copied to clipboard! You can now paste it into Excel or another file.");
        })
        .catch(err => {
            console.error("Failed to copy table:", err);
            alert("Copying failed. Please try again.");
        });
});
