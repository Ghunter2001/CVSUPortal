    
function fetchSelector() {
    // const selectedYearTerm = document.getElementById("sYt").value;

    const selected = document.getElementById("selector").value;
    
    fetch(`/archiveSelector?status=${selected}`)
        .then(response => response.text())
        .then(data => {
            document.getElementById("table").innerHTML = data;
        })
        .catch(error => console.error('Error fetching schedule:', error));
}

// Fetch schedule on page load
window.onload = fetchSchedule;




function archiveRow(student_number) {
    // Ask for confirmation
    if (confirm("Are you sure you want to unarchive this row?")) {
        fetch('/unArchive', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ student_number }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                console.log('Row deleted successfully');
                window.location.href = "/Archive"
            })
            .catch(error => {
                console.error('Error:', error);

            });
    }
}

