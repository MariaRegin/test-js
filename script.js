const button = document.querySelector(".button");
const input = document.querySelector(".input");
const error = document.querySelector(".error");
const dataList = document.getElementById("dataList");
const translationSection = document.querySelector(".translation");

button.addEventListener("click", async () => {
  try {
    const word = input.value.trim();
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
    );

    if (!word) {
      error.textContent = "Please enter a word to search";
      error.classList.add("errorActive");
      translationSection.classList.remove("translationActive");
      return;
    }

    if (!response.ok) {
      error.textContent =
        "Sorry, we couldn't find definitions for the word you were looking for";
      error.classList.add("errorActive");
      translationSection.classList.remove("translationActive");
      throw new Error("Word not found");
    }

    const data = await response.json();
    error.classList.remove("errorActive");

    dataList.innerHTML = "";

    translationSection.classList.add("translationActive");

    data.forEach((item) => {
      const title = document.createElement("h2");
      const point = document.createElement("p");

      title.textContent = item.word;

      const audioElement = document.createElement("audio");
      audioElement.controls = true;
      audioElement.classList.add("audio");

      const audioUrl = item.phonetics.find((p) => p.audio)?.audio;

      if (audioUrl) {
        audioElement.src = audioUrl;
      } else {
        console.log("No audio found for this word");
      }

      point.innerHTML = `
      <strong>Phonetics:</strong> ${item.phonetics
        .map((p) => p.text || "N/A")
        .join(", ")} <br><br>
      <strong>Meanings:</strong>
        <ul>
          ${item.meanings
            .map(
              (m) => `
            <li>
              <strong>Part of Speech:</strong> ${m.partOfSpeech} <br><br>
              <strong>Definitions:<br><br></strong> ${m.definitions
                .map((d) => d.definition)
                .join("<br> ")} <br><br>
            </li>
          `
            )
            .join("")}
        </ul>
    `;

      dataList.append(title);
      dataList.appendChild(point);
      dataList.appendChild(audioElement);
    });
  } catch (error) {
    error.classList.add("errorActive");
    error.textContent = "Error, try again";
  }
});
