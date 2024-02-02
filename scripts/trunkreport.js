function autoResize(textarea) {
  textarea.style.height = "auto"; // Reset the height to auto to calculate the actual height needed
  textarea.style.height = textarea.scrollHeight + "px"; // Set the height to the calculated value
}

window.addEventListener("DOMContentLoaded", function () {
  var nodeSelect = document.getElementById("Node");
  var odnSelect = document.getElementById("ODN");

  nodeSelect.addEventListener("change", function () {
    var selectedNode = nodeSelect.value;
    odnSelect.innerHTML = ""; // Clear previous options

    if (selectedNode === "AccessIV") {
      var odnOptions = [
        "BalkhuACC",
        "ChabahilACC",
        "ChhauniACC",
        "KalankiACC",
        "KupandolACC",
        "LazimpatACC",
        "MaharajgunjACC",
        "NewroadACC",
        "RadheRadheACC",
        "SatdobatoACC",
        "ShantinagarACC",
        "SyuchatarACC",
        "ThamelACC",
      ];

      for (var i = 0; i < odnOptions.length; i++) {
        var option = document.createElement("option");
        option.text = odnOptions[i];
        odnSelect.add(option);
      }
    } else if (selectedNode === "AGGIV") {
      var odnOptions = [
        "BalajuAGG",
        "KoteshworAGG",
        "SatungalAGG1",
        "SatungalAGG2",
      ];

      for (var i = 0; i < odnOptions.length; i++) {
        var option = document.createElement("option");
        option.text = odnOptions[i];
        odnSelect.add(option);
      }
    } else if (selectedNode === "OLTIV") {
      var odnOptions = [
        "BalajuOLT",
        "BalkhuOLT",
        "BalkotOLT",
        "BhaisepatiOLT",
        "BishalnagarOLT",
        "BungmatiOLT",
        "ChabahilOLT",
        "ChhauniOLT",
        "DahachokOLT",
        "DhapakhelOLT",
        "DhapasiOLT",
        "DharmasthaliOLT",
        "GaushalaOLT",
        "GokarnaOLT",
        "GongabuOLT",
        "GunduOLT",
        "HattibanOLT",
        "ImadolOLT",
        "JawalakhelPulchowkOLT",
        "JorpatiOLT",
        "KalankiOLT",
        "KalimatiOLT",
        "KapanOLT",
        "KaushaltarOLT",
        "KoteshworeOLT",
        "KuleshworeHeightOLT",
        "KupondolOLT",
        "LazimpatOLT",
        "MachhegaunOLT",
        "MaharajgunjOLT",
        "MulpaniOLT",
        "NarayanthanBudanilkanthaOLT",
        "NewrodOLT",
        "PepsicolaOLT",
        "PutalisadakOLT",
        "RadheRadheOLT",
        "ranibariOLT",
        "SankhamulOLT",
        "SanothimiOLT",
        "SantinagarOLT",
        "SatdobatoOLT",
        "Satungal-DCOLT",
        "SitapailaOLT",
        "SuichatarOLT",
        "SundarijalOLT",
        "SuryaBinayayakOLT",
        "TaudahaOLT",
        "ThamelOLT",
        "TokhaOLT",
      ];

      for (var i = 0; i < odnOptions.length; i++) {
        var option = document.createElement("option");
        option.text = odnOptions[i];
        odnSelect.add(option);
      }
    } else if (selectedNode === "AccessOV") {
      var odnOptions = [
        "RatnanagarACC01",
        "BharatpurACC01",
        "PokharaACC01",
        "BardhaghatACC01",
        "DharanACC01",
        "NawalparasiACC01",
        "ItahariACC01",
        "LahanACC01",
        "BiratnagarACC01",
        "ButwalACC01",
        "HetaudaACC01",
        "BhairawaACC01",
        "BirgunjACC01",
        "BirgunjACC02",
      ];

      for (var i = 0; i < odnOptions.length; i++) {
        var option = document.createElement("option");
        option.text = odnOptions[i];
        odnSelect.add(option);
      }
    } else if (selectedNode === "AGGOV") {
      var odnOptions = [
        "BiratnagarAGG01",
        "ButwalAGG01",
        "NawalparasiAGG01",
        "HetaudaAGG01",
        "BhairawaAGG01",
        "BirgunjAGG01",
      ];

      for (var i = 0; i < odnOptions.length; i++) {
        var option = document.createElement("option");
        option.text = odnOptions[i];
        odnSelect.add(option);
      }
    } else if (selectedNode === "OLTOV") {
      var odnOptions = [
        "BRTOLT01",
        "BUTOLT03",
        "DRNOLT04",
        "PKROLT01",
        "PKROLT02",
        "PKROLT04",
        "BHWOLT01",
        "KOWOLT02",
        "RTGOLT02",
        "BRDOLT01",
        "BRJOLT01",
        "BTGOLT04",
        "DHBOLT01",
        "JTPOLT01",
        "JTPOLT02",
        "DRNOLT03",
        "DRNOLT02",
        "ITHOLT04",
        "ITHOLT05",
        "PKROLT06",
        "DRNOLT05",
        "BGHOLT02",
        "NWPOLT01",
        "HTDOLT01",
        "BUTOLT01",
        "HTDOLT02",
        "HTDOLT03",
        "BHWOLT03",
        "BHWOLT02",
        "BUTOLT02",
        "BRTOLT03",
        "NWPOLT02",
        "BRTOLT02",
        "KOWOLT01",
        "RTGOLT01",
        "BUTOLT04",
        "BRJOLT02",
        "BRJOLT04",
        "BTGOLT02",
        "BTGOLT03",
        "BTGOLT01",
        "BRJOLT03",
        "ITHOLT02",
        "ITHOLT01",
        "DRNOLT01",
        "ITHOLT03",
        "PKROLT03",
        "PKROLT05",
        "PKROLT07",
        "LHNOLT01",
      ];

      for (var i = 0; i < odnOptions.length; i++) {
        var option = document.createElement("option");
        option.text = odnOptions[i];
        odnSelect.add(option);
      }
    }
  });
});

// Function to validate the form before submission
function validateForm(event) {
  event.preventDefault(); // Prevent the form from submitting if validation fails

  // Get references to all form inputs
  var Ticket_No = document.getElementById("Ticket_No");
  var node = document.getElementById("Node");
  var odn = document.getElementById("ODN");
  var trunk = document.getElementById("Trunk");
  var caseField = document.getElementById("Case");
  var nodeImpacted = document.getElementById("Node_Impacted");

  var escalatedTeam = document.getElementById("Escalated_Team");

  // Check if any required field is empty
  if (
    Ticket_No.value === "" ||
    node.value === "" ||
    odn.value === "" ||
    trunk.value === "" ||
    caseField.value === "" ||
    nodeImpacted.value === "" ||
    escalatedTeam.value === ""
  ) {
    alert("Please fill in all the required fields.");
    return; // Exit the function and prevent form submission
  }

  // All fields are filled, so submit the form
  document.getElementById("inputForm").submit();
}

// Attach the form validation function to the form's submit event
document.getElementById("inputForm").addEventListener("submit", validateForm);

function formatDateTimeInput() {
  var datetimeInput = document.getElementById("Escalated_Day_Time");
  var datetimeValue = datetimeInput.value;
  var formattedDateTime = datetimeValue.substring(0, 16); // Extract date and time
  datetimeInput.value = formattedDateTime;
}

function autoResize(textarea) {
  textarea.style.height = "auto"; // Reset the height to auto to calculate the actual height needed
  textarea.style.height = textarea.scrollHeight + "px"; // Set the height to the calculated value
}

window.addEventListener("DOMContentLoaded", function () {
  var nodeSelect = document.getElementById("Node");
  var odnSelect = document.getElementById("ODN");

  nodeSelect.addEventListener("change", function () {
    var selectedNode = nodeSelect.value;
    odnSelect.innerHTML = ""; // Clear previous options

    if (selectedNode === "AccessIV") {
      var odnOptions = [
        "BalkhuACC",
        "ChabahilACC",
        "ChhauniACC",
        "KalankiACC",
        "KupandolACC",
        "LazimpatACC",
        "MaharajgunjACC",
        "NewroadACC",
        "RadheRadheACC",
        "SatdobatoACC",
        "ShantinagarACC",
        "SyuchatarACC",
        "ThamelACC",
      ];

      for (var i = 0; i < odnOptions.length; i++) {
        var option = document.createElement("option");
        option.text = odnOptions[i];
        odnSelect.add(option);
      }
    } else if (selectedNode === "AGGIV") {
      var odnOptions = [
        "BalajuAGG",
        "KoteshworAGG",
        "SatungalAGG1",
        "SatungalAGG2",
      ];

      for (var i = 0; i < odnOptions.length; i++) {
        var option = document.createElement("option");
        option.text = odnOptions[i];
        odnSelect.add(option);
      }
    } else if (selectedNode === "OLTIV") {
      var odnOptions = [
        "BalajuOLT",
        "BalkhuOLT",
        "BalkotOLT",
        "BhaisepatiOLT",
        "BishalnagarOLT",
        "BungmatiOLT",
        "ChabahilOLT",
        "ChhauniOLT",
        "DahachokOLT",
        "DhapakhelOLT",
        "DhapasiOLT",
        "DharmasthaliOLT",
        "GaushalaOLT",
        "GokarnaOLT",
        "GongabuOLT",
        "GunduOLT",
        "HattibanOLT",
        "ImadolOLT",
        "JawalakhelPulchowkOLT",
        "JorpatiOLT",
        "KalankiOLT",
        "KalimatiOLT",
        "KapanOLT",
        "KaushaltarOLT",
        "KoteshworeOLT",
        "KuleshworeHeightOLT",
        "KupondolOLT",
        "LazimpatOLT",
        "MachhegaunOLT",
        "MaharajgunjOLT",
        "MulpaniOLT",
        "NarayanthanBudanilkanthaOLT",
        "NewrodOLT",
        "PepsicolaOLT",
        "PutalisadakOLT",
        "RadheRadheOLT",
        "ranibariOLT",
        "SankhamulOLT",
        "SanothimiOLT",
        "SantinagarOLT",
        "SatdobatoOLT",
        "Satungal-DCOLT",
        "SitapailaOLT",
        "SuichatarOLT",
        "SundarijalOLT",
        "SuryaBinayayakOLT",
        "TaudahaOLT",
        "ThamelOLT",
        "TokhaOLT",
      ];

      for (var i = 0; i < odnOptions.length; i++) {
        var option = document.createElement("option");
        option.text = odnOptions[i];
        odnSelect.add(option);
      }
    } else if (selectedNode === "AccessOV") {
      var odnOptions = [
        "RatnanagarACC01",
        "BharatpurACC01",
        "PokharaACC01",
        "BardhaghatACC01",
        "DharanACC01",
        "NawalparasiACC01",
        "ItahariACC01",
        "LahanACC01",
        "BiratnagarACC01",
        "ButwalACC01",
        "HetaudaACC01",
        "BhairawaACC01",
        "BirgunjACC01",
        "BirgunjACC02",
      ];

      for (var i = 0; i < odnOptions.length; i++) {
        var option = document.createElement("option");
        option.text = odnOptions[i];
        odnSelect.add(option);
      }
    } else if (selectedNode === "AGGOV") {
      var odnOptions = [
        "BiratnagarAGG01",
        "ButwalAGG01",
        "NawalparasiAGG01",
        "HetaudaAGG01",
        "BhairawaAGG01",
        "BirgunjAGG01",
      ];

      for (var i = 0; i < odnOptions.length; i++) {
        var option = document.createElement("option");
        option.text = odnOptions[i];
        odnSelect.add(option);
      }
    } else if (selectedNode === "OLTOV") {
      var odnOptions = [
        "BRTOLT01",
        "BUTOLT03",
        "DRNOLT04",
        "PKROLT01",
        "PKROLT02",
        "PKROLT04",
        "BHWOLT01",
        "KOWOLT02",
        "RTGOLT02",
        "BRDOLT01",
        "BRJOLT01",
        "BTGOLT04",
        "DHBOLT01",
        "JTPOLT01",
        "JTPOLT02",
        "DRNOLT03",
        "DRNOLT02",
        "ITHOLT04",
        "ITHOLT05",
        "PKROLT06",
        "DRNOLT05",
        "BGHOLT02",
        "NWPOLT01",
        "HTDOLT01",
        "BUTOLT01",
        "HTDOLT02",
        "HTDOLT03",
        "BHWOLT03",
        "BHWOLT02",
        "BUTOLT02",
        "BRTOLT03",
        "NWPOLT02",
        "BRTOLT02",
        "KOWOLT01",
        "RTGOLT01",
        "BUTOLT04",
        "BRJOLT02",
        "BRJOLT04",
        "BTGOLT02",
        "BTGOLT03",
        "BTGOLT01",
        "BRJOLT03",
        "ITHOLT02",
        "ITHOLT01",
        "DRNOLT01",
        "ITHOLT03",
        "PKROLT03",
        "PKROLT05",
        "PKROLT07",
        "LHNOLT01",
      ];

      for (var i = 0; i < odnOptions.length; i++) {
        var option = document.createElement("option");
        option.text = odnOptions[i];
        odnSelect.add(option);
      }
    }
  });
});
