const tableNameSelect = document.getElementById('tableNameSelect');
const dropForm = document.getElementById('dropForm');

dropForm.addEventListener('submit', (event) => {
  event.preventDefault(); // Prevent the form from submitting normally

  const selectedTable = tableNameSelect.value;
  const actionUrl = `/import/droptable/${selectedTable}`;

  dropForm.setAttribute('action', actionUrl);
  dropForm.submit(); // Submit the form with the updated action URL
});
// Optional: To show the selected file name
document.getElementById('csvFile').addEventListener('change', function(event) {
  const fileNameSpan = document.getElementById('file-name');
  fileNameSpan.textContent = event.target.files[0] ? event.target.files[0].name : 'No file chosen';
});

function displayFileName() {
  const fileInput = document.getElementById('csvFile');
  const fileNameSpan = document.getElementById('file-name');

  if (fileInput.files.length > 0) {
    fileNameSpan.textContent = fileInput.files[0].name;
  } else {
    fileNameSpan.textContent = 'No file chosen';
  }
}


