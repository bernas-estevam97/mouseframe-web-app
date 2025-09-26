const year = new Date().getFullYear();
  if (year > 2010) {
    document.getElementById("year").textContent = `-${year}`;
  }