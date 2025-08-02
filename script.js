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
  .then(res => res.json())
  .then(data => {
    lastPayload = data;
    document.getElementById('preview-text').innerText = data.calendar_preview;
    document.getElementById('preview-box').style.display = 'block';
    status.innerText = "✅ Preview generated. Review below.";
  })
  .catch(err => {
    console.error(err);
    status.innerText = "❌ Failed to generate preview.";
  });
}

// Finalize the plan
function confirmPlan() {
  const status = document.getElementById('status');
  status.innerText = "⏳ Finalizing plan...";

  fetch('https://us-west1-project-assistant-cloud.cloudfunctions.net/plan-aiE', {
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
