document.getElementById('registrationForm').addEventListener('submit', function(event) {
    event.preventDefault();
    let password = document.getElementById('password').value;
    let confirmPassword = document.getElementById('confirmPassword').value;
    
    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }
    
    // Prepare form data for submission
    let formData = new FormData(this);
    let formObject = {};
    formData.forEach((value, key) => {
        formObject[key] = value;
    });

    fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formObject)
    }).then(response => response.json())
      .then(data => {
          if (data.success) {
              alert("Registration successful!");
          } else {
              alert("Registration failed: " + data.message);
          }
      }).catch(error => {
          console.error('Error:', error);
      });
});
