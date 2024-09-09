// typewriter.js

function typeWriter(element, text, index = 0, speed = 50) {
	if (index < text.length) {
		// Append the next character
		const currentText = text.slice(0, index + 1);
		// Render Markdown to HTML and update the element
		element.innerHTML = renderMarkdown(currentText);
		// Re-highlight code blocks (if necessary)
		hljs.highlightAll();
		// Schedule the next character
		setTimeout(() => typeWriter(element, text, index + 1, speed), speed);
	}
}

