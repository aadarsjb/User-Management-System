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
  createPaginationLinks(ivPageCount, 1, "pagination-container", "myTable");
  showPage(1, "myTable");
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




initializePagination();
