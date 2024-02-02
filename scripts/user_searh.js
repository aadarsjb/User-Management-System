// After searching, the value remains in the search query fields
// Get the search query values from the URL parameters
const urlParams = new URLSearchParams(window.location.search);
const popQuery = urlParams.get("POP");
const ponQuery = urlParams.get("PON");
const geographyQuery = urlParams.get("Geography");

// Set the values of the search fields
const popInput = document.getElementById("POP");
const ponInput = document.getElementById("PON");
const geographyInput = document.getElementById("Geography");

popInput.value = popQuery || "";
ponInput.value = ponQuery || "";
geographyInput.value = geographyQuery || "";

// Sort table by column index
function sortTable(columnIndex, tableId) {
  var table, rows, switching, i, x, y, shouldSwitch;
  table = document.getElementById(tableId);
  switching = true;
  while (switching) {
    switching = false;
    rows = table.rows;
    for (i = 1; i < rows.length - 1; i++) {
      shouldSwitch = false;
      x = rows[i].getElementsByTagName("TD")[columnIndex];
      y = rows[i + 1].getElementsByTagName("TD")[columnIndex];
      if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
        shouldSwitch = true;
        break;
      }
    }
    if (shouldSwitch) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
    }
  }
}

function highlightPageLink(link) {
  var paginationLinks = document.getElementsByClassName("pagination-link");

  for (var i = 0; i < paginationLinks.length; i++) {
    paginationLinks[i].classList.remove("active");
  }

  link.classList.add("active");
}

// Function to create pagination links
function initializePagination() {
  var ivTable = document.getElementById("myTable");
  var ivRowCount = ivTable.rows.length - 1;
  var rowsPerPage = 40;
  var ivPageCount = Math.ceil(ivRowCount / rowsPerPage);
  createPaginationLinks(ivPageCount, 1, "pagination-iv", "myTable");
  showPage(1, "myTable");
}

function initializeOVPagination() {
  var ovTable = document.getElementById("myTable1");
  var ovRowCount = ovTable.rows.length - 1;
  var rowsPerPage = 40;
  var ovPageCount = Math.ceil(ovRowCount / rowsPerPage);
  createPaginationLinks(ovPageCount, 1, "pagination-ov", "myTable1");
  showPage(1, "myTable1");
}
function createPaginationLinks(pageCount, currentPage, containerId, tableId) {
  var container = document.getElementById(containerId);
  container.innerHTML = "";

  for (var i = 1; i <= pageCount; i++) {
    var link = document.createElement("a");
    link.href = "#";
    link.innerHTML = i;
    link.classList.add("pagination-link");
    container.appendChild(link);
  }

  var links = container.getElementsByTagName("a");
  for (var j = 0; j < links.length; j++) {
    links[j].addEventListener("click", function (e) {
      e.preventDefault();
      var pageNumber = parseInt(this.innerHTML);
      showPage(pageNumber, tableId);
      highlightPageLink(this);

      // Update the URL without triggering a page reload
      var newURL = updateURLParameter(window.location.href, "page", pageNumber);
      window.history.pushState({ page: pageNumber }, document.title, newURL);
    });
  }

  highlightPageLink(container.getElementsByTagName("a")[currentPage - 1]);
}

// Helper function to update URL query parameters
function updateURLParameter(url, param, value) {
  var newURL = new URL(url);
  newURL.searchParams.set(param, value);
  return newURL.href;
}

function showPage(pageNumber, tableId) {
  var table = document.getElementById(tableId);
  var rows = table.getElementsByTagName("tr");
  var rowsPerPage = 40;

  var start = (pageNumber - 1) * rowsPerPage;
  var end = start + rowsPerPage;

  for (var i = 1; i < rows.length; i++) {
    if (i >= start && i < end) {
      rows[i].style.display = "table-row";
    } else {
      rows[i].style.display = "none";
    }
  }
}

// Function to show specific page for Outside Valley results

function initializeAllPagination() {
  var ivTable = document.getElementById("myTable");
  var ovTable = document.getElementById("myTable1");

  if (ivTable) {
    initializePagination();
  }

  if (ovTable) {
    initializeOVPagination();
  }
}

initializeAllPagination();

// Form validation
function validateForm() {
  var popInput = document.getElementById("POP");
  var ponInput = document.getElementById("PON");

  if (popInput.value.trim() === "" && ponInput.value.trim() === "") {
    alert("Please enter POP or PON Number.");
    return false;
  }

  return true;
}
