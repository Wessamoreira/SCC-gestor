async function login() {
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    const response = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha })
    });

    if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        window.location.href = "dashboard.html";
    } else {
        alert("Login inválido!");
    }
}