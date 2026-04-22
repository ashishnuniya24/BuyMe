async function login(email, password) {
    const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
        alert(data.error || "Login failed");
        return;
    }

    localStorage.setItem("token", data.token);
    alert("Login successful 🚀");
    window.location.href = "index.html";
}

async function signup(name, email, password) {
    const res = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();

    if (!res.ok) {
        alert(data.error || "Signup failed");
        return;
    }

    alert("Signup successful 🚀");
    window.location.href = "login.html";
}

function logout() {
    localStorage.removeItem("token");
    window.location.href = "login.html";
}