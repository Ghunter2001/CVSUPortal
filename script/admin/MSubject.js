
document.getElementById("submitBTN").addEventListener("click", function (event) {
  event.preventDefault(); // Prevent form submission

  var CboCourse = document.getElementById("CboCourse").value.trim();
  var subCode = document.getElementById("subCode").value.trim();
  var subDesc = document.getElementById("subDesc").value.trim();
  var CboYear = document.getElementById("CboYear").value.trim();
  var CboSem = document.getElementById("CboSem").value.trim();
  var CboLec = document.getElementById("CboLec").value.trim();
  var CboLab = document.getElementById("CboLab").value.trim();
  var prereq = document.getElementById("prereq").value.trim();

  var isValid = true;
  if (CboCourse === "") {
    isValid = false;
  }
  if (subCode === "") {
    isValid = false;
  }
  if (subDesc === "") {
    isValid = false;
  }
  if (CboYear === "") {
    isValid = false;
  }
  if (CboSem === "") {
    isValid = false;
  }
  if (CboLec === "") {
    isValid = false;
  }
  if (CboLab === "") {
    isValid = false;
  }
  if (prereq === "") {
    isValid = false;
  }

  // Submit the form if valid
  if (isValid) {
    var subCode = document.getElementById("subCode");
    var subDesc = document.getElementById("subDesc");
    subCode.value = subCode.value.toLowerCase().replace(/\w/g, function (char) {
      return char.toUpperCase();
    });

    subDesc.value = subDesc.value.toLowerCase().replace(/\b\w/g, function (char) {
      return char.toUpperCase();
    });
    document.getElementById("subject").submit();
  } else {
    alert("Please fill out all required fields.");
  }
});





//FOR DELETION
function deleteRow(subcode) {
  // Ask for confirmation
  if (confirm("Are you sure you want to delete this row?")) {
    fetch('/deleteSub', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ subcode }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        console.log('Row deleted successfully');
        window.location.href = "/subjects"
      })
      .catch(error => {
        console.error('Error:', error);
  
      });
  }
}


//DROPDOWN
fetch('/courseOption')
  .then(response => response.json())
  .then(data => {
    const selectElement = document.getElementById('CboCourse');
    data.forEach(option => {
      const optionElement = document.createElement('option');
      optionElement.value = option.value;
      optionElement.textContent = option.text;
      selectElement.appendChild(optionElement);
    });
  })
  .catch(error => console.error('Error fetching credit units:', error));

fetch('/prereqOption')
  .then(response => response.json())
  .then(data => {
    const selectElement = document.getElementById('prereq');
    data.forEach(option => {
      const optionElement = document.createElement('option');
      optionElement.value = option.value;
      optionElement.textContent = option.text;
      selectElement.appendChild(optionElement);
    });
  })
  .catch(error => console.error('Error fetching credit units:', error));

