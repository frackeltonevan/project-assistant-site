let lastPayload = null;

// Submit the project description to preview
function submitPrompt() {
  const prompt = document.getElementById('prompt').value;
  const status = document.getElementById('status');
  status.innerText = "🔄 Processing...";

  fetch('https://us-west1-project-assistant-cloud.cloudfunctions.net/plan-ai', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt: prompt, mode: 'preview' })
  })
  .then(async res => {
    const json = await res.json();
    console.log("Preview response:", json);
    if (json.error) throw new Error(json.error);
    return json;
  })
  .then(data => {
    lastPayload = data;

    // Build preview in your original order
    let previewContent = "";
    previewContent += `Summary: ${data.summary || "N/A"}\n`;
    previewContent += `Estimated Date: ${data.estimated_date || "N/A"}\n`;
    previewContent += `Type: ${data.type || "N/A"}\n`;
    previewContent += `Calendar Preview: ${data.calendar_preview || "N/A"}\n`;

    if (data.type === "project") { 
      previewContent += `Tools: ${Array.isArray(data.tools) ? data.tools.join(", ") : "N/A"}\n`;
      previewContent += `Missing Tools: ${Array.isArray(data.missing_tools) ? data.missing_tools.join(", ") : "N/A"}\n`;
    }

    // Display once
    document.getElementById('preview-text').innerText = previewContent;

    // Show preview box
    document.getElementById('preview-box').style.display = 'block';
    status.innerText = "✅ Preview generated. Review below.";
  })
  .catch(err => {
    console.error("Preview failed:", err);
    status.innerText = "❌ Failed to generate preview.";
  });
}

// Finalize the plan
function confirmPlan() {
  const status = document.getElementById('status');
  status.innerText = "⏳ Finalizing plan...";

  fetch('https://us-west1-project-assistant-cloud.cloudfunctions.net/plan-ai', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ...lastPayload, mode: 'confirm' })
  })
  .then(res => res.json())
  .then(data => {
    status.innerText = "✅ Plan confirmed and scheduled!";
    document.getElementById('preview-box').style.display = 'none';
  })
  .catch(err => {
    console.error(err);
    status.innerText = "❌ Failed to confirm plan.";
  });
}
