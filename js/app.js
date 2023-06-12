if (typeof document !== 'undefined') {

    document.getElementById('readButton').addEventListener('click', readPDF);
    // Manipulating the DOM here

}
async function readPDF() {
    const fileInput = document.getElementById('pdfFile');
    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = async function(event) {
            const typedArray = new Uint8Array(event.target.result);
            const pdf = await pdfjsLib.getDocument(typedArray).promise;

            const numPages = pdf.numPages;
            const words = [];

            for (let i = 1; i <= numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();

                textContent.items.forEach(item => {
                    const word = item.str.trim();
                    if (word !== '') {
                        words.push(word);
                    }
                });
            }

            console.log(displayWords(words));
        };

        reader.readAsArrayBuffer(file);
    }
}

function displayWords(words) {
  const outputDiv = document.getElementById('output');
  outputDiv.innerHTML = '';

  const synthesis = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance();

  utterance.addEventListener('end', () => {
    playNextWord(words);
  });

  playNextWord(words);

  function playNextWord(words) {
    if (words.length > 0) {
      const word = words.shift();
      utterance.text = word;
      synthesis.speak(utterance);

      const wordSpan = document.createElement('span');
      wordSpan.innerText = word + ' ';
      outputDiv.appendChild(wordSpan);
    }
  }
}
