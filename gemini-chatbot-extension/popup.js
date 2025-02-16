const API_KEY = "AIzaSyBeK7EkbynttwoBCevcC1QQTWMx9zHUIv8"; // API anahtarınızı buraya yazın

document.getElementById("sendBtn").addEventListener("click", sendMessage);
document.getElementById("userInput").addEventListener("keypress", function(e) {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

async function sendMessage() {
    const userInput = document.getElementById("userInput").value.trim();
    if (!userInput) return;

    const responseElement = document.getElementById("response");
    responseElement.innerHTML = "Düşünüyor...";
    
    const requestBody = {
        contents: [{
            parts: [{
                text: userInput
            }]
        }],
        safetySettings: [{
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_NONE"
        }],
        generationConfig: {
            temperature: 0.7,
            topK: 1,
            topP: 1,
            maxOutputTokens: 2048,
            stopSequences: []
        }
    };

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('API Error Response:', errorData);
            throw new Error(`HTTP error! status: ${response.status}, message: ${JSON.stringify(errorData)}`);
        }

        const data = await response.json();
        console.log('API Response:', data);

        if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
            responseElement.innerHTML = data.candidates[0].content.parts[0].text;
        } else {
            console.error('Unexpected API response structure:', data);
            responseElement.innerHTML = "API yanıtı beklenen formatta değil.";
        }
    } catch (error) {
        console.error("Tam hata detayı:", error);
        responseElement.innerHTML = `Hata oluştu: ${error.message}. Lütfen console'u kontrol edin.`;
    }
}