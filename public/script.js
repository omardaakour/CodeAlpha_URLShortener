let latestShortUrl = "";

async function shortenUrl() {
  const longUrlInput = document.getElementById("longUrl");
  const resultDiv = document.getElementById("result");

  const longUrl = longUrlInput.value;

  if (longUrl.trim() === "") {
    resultDiv.innerHTML = "Please enter a URL.";
    return;
  }

  try {
    const response = await fetch("/api/shorten", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        longUrl: longUrl
      })
    });

    const data = await response.json();

    if (!response.ok) {
      resultDiv.innerHTML = data.message || "Error shortening URL.";
      return;
    }

    latestShortUrl = data.shortUrl;

    resultDiv.innerHTML = `
      <p>Short URL:</p>
      <a href="${latestShortUrl}" target="_blank">${latestShortUrl}</a>
      <br><br>
      <button onclick="copyShortUrl()">Copy URL</button>
      <p id="copyMessage"></p>
    `;

  } catch (error) {
    resultDiv.innerHTML = "Server error. Make sure backend is running.";
  }
}

async function copyShortUrl() {
  try {
    await navigator.clipboard.writeText(latestShortUrl);

    document.getElementById("copyMessage").innerText = "Copied!";
  } catch (error) {
    document.getElementById("copyMessage").innerText = "Failed to copy.";
  }
}