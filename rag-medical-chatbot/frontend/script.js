async function sendQuery() {
    let query = document.getElementById("query").value;
    if (!query) return;

    document.getElementById("response").innerText = "Thinking...";

    try {
        let res = await fetch(`http://127.0.0.1:8000/chat?query=${encodeURIComponent(query)}`);
        let data = await res.json();
        document.getElementById("response").innerText = data.response;
    } catch (err) {
        document.getElementById("response").innerText = "Error connecting to server. Make sure the backend is running.";
    }
}
