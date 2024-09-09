document.addEventListener('DOMContentLoaded', () => {
    const modeSelect = document.getElementById('mode');
    const responseElement = document.getElementById('response');
    const sendButton = document.getElementById('send-button');
    const userInput = document.getElementById('user-input'); // 獲取 textarea 元素

    // Function to show the loading state on the button
    function showLoading() {
        sendButton.innerHTML = `
            <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
            <span class="sr-only">Cute Shark is thinking...</span>
        `;
        sendButton.disabled = true;
    }

    // Function to revert the button to its normal state
    function revertButton() {
        sendButton.innerHTML = 'Send';
        sendButton.disabled = false;
    }

    // Add event listener for the send button
    sendButton.addEventListener('click', async () => {
        await sendRequest();
    });

    // Add event listener for the textarea to handle Enter key
    userInput.addEventListener('keydown', async (event) => {
        if (event.key === 'Enter') {
            event.preventDefault(); // 防止換行
            await sendRequest();
        }
    });

    // Function to send the request
    async function sendRequest() {
        const mode = modeSelect.value;
        const userInputValue = userInput.value;

        if (userInputValue.trim() === '') {
            alert('You did not enter anything?');
            return;
        }

        console.log(`Sending request: text="${userInputValue}", mode="${mode}"`);

        showLoading(); // Show the loading spinner

        try {
	    // DO NOT WANT TO DO SOMETHING WIERD TO THIS ENDPOINT, IT HAS FIREWALL 
            const response = await fetch('https://jackiesogi.com/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: userInputValue, mode: modeSelect.value })
            });
	
	console.log('Selected Mode:', modeSelect.value);

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            // Read the response as JSON
            const jsonResponse = await response.json();
            console.log('Received JSON response:', jsonResponse);

            const messages = jsonResponse.messages || [];
            const markdownContent = messages.filter(message => message !== null).join('');

            console.log('Markdown content:', markdownContent);

            // Render Markdown content to HTML
            if (mode === 'interactive') {
                responseElement.innerHTML = ''; // Clear previous content
                typeWriter(responseElement, markdownContent, 0, 0); // Adjust speed as needed
            } else {
                // Render Markdown to HTML for quiet mode
                const htmlContent = renderMarkdown(markdownContent);
                console.log('html content: ', htmlContent);
                responseElement.innerHTML = htmlContent;
            }

            revertButton(); // Revert the button to its normal state
        } catch (error) {
            console.error('Fetch error:', error);
            responseElement.innerHTML = '<p>An error occurred while processing the request.</p>';
            revertButton(); // Revert the button even if there's an error
        }
    }
});

