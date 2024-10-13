// Import CodeMirror modules
import { EditorState } from '@codemirror/state';
import { EditorView, basicSetup } from '@codemirror/basic-setup';
import { javascript } from '@codemirror/lang-javascript';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { oneDark } from '@codemirror/theme-one-dark';

document.addEventListener('DOMContentLoaded', async () => {
  const resourceNameElem = document.getElementById('resourceName');
  const saveButton = document.getElementById('saveButton');
  const publishButton = document.getElementById('publishButton');
  const reloadButton = document.getElementById('reloadButton');
  const saveSpinner = document.getElementById('saveSpinner');
  const publishSpinner = document.getElementById('publishSpinner');
  const buttonTextSave = saveButton.querySelector('.buttonText');
  const buttonTextPublish = publishButton.querySelector('.buttonText');
  const notificationBanner = document.getElementById('notificationBanner');
  let resource = null;
  let environmentUrl = '';
  let editorView = null;

  // Get the resource details from chrome.storage.local
  chrome.storage.local.get('resourceDetails', (data) => {
    if (
      data &&
      data.resourceDetails &&
      data.resourceDetails.resource &&
      data.resourceDetails.environmentUrl
    ) {
      resource = data.resourceDetails.resource;
      environmentUrl = data.resourceDetails.environmentUrl;
      resourceNameElem.textContent += resource.name;
      initializeEditor(resource);
    } else {
      resourceNameElem.textContent = 'Error loading resource.';
    }
  });

  function initializeEditor(resource) {

    const decodedContent = atob(resource.content || '');
  
    let languageExtension;
    switch (resource.webresourcetype) {
      case 1:
        languageExtension = html(); // HTML
        break;
      case 2:
        languageExtension = css(); // CSS
        break;
      case 3:
        languageExtension = javascript(); // JavaScript
        break;
      default:
        languageExtension = javascript(); // Default to JavaScript for unknown types
        console.warn('Unknown web resource type, defaulting to JavaScript');
        break;
    }

    const editorParent = document.getElementById('codeEditor');

  // Initialize the CodeMirror editor with syntax highlighting
  const state = EditorState.create({
    doc: decodedContent,
    extensions: [
      basicSetup,
      languageExtension,
      oneDark, // Apply One Dark theme
    ].filter(Boolean),
  });

  editorView = new EditorView({
    state,
    parent: editorParent,
  });
}

  function showToast(message) {
    const toastContainer = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('show');
    }, 100);

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        toastContainer.removeChild(toast);
      }, 500);
    }, 3000);
  }

  saveButton.addEventListener('click', async () => {
    saveSpinner.style.display = 'inline-block';
    buttonTextSave.textContent = 'Saving...';
    saveButton.disabled = true;

    const updatedContent = editorView.state.doc.toString();
    const saveSuccessful = await saveWebResource(updatedContent);

    if (saveSuccessful) {
      showToast('Web resource saved successfully.');
      saveSpinner.style.display = 'none';
      buttonTextSave.textContent = 'Save';
    }
    saveButton.disabled = false;
  });

  publishButton.addEventListener('click', async () => {
    publishSpinner.style.display = 'inline-block';
    buttonTextPublish.textContent = 'Publishing...';
    publishButton.disabled = true;

    const publishSuccessful = await publishWebResource();

    if (publishSuccessful) {
      showToast('Web resource published successfully.');
      publishSpinner.style.display = 'none';
      buttonTextPublish.textContent = 'Publish';
    }
    publishButton.disabled = false;
  });

  reloadButton.addEventListener('click', async () => {
    reloadButton.disabled = true;
    try {
      await reloadWebResource();
      showToast('Web resource reloaded successfully. Refreshing page...');
      setTimeout(() => {
        window.location.reload();
      }, 1500); // Delay to allow the toast to be visible
    } catch (error) {
      showToast('Error reloading web resource.');
      reloadButton.disabled = false;
    }
  });

  async function saveWebResource(updatedContent) {
    const encodedContent = btoa(updatedContent);
    const payload = { content: encodedContent };

    try {
      const response = await fetch(
        `${environmentUrl}/api/data/v9.2/webresourceset(${resource.webresourceid})`,
        {
          method: 'PATCH',
          headers: {
            'OData-MaxVersion': '4.0',
            'OData-Version': '4.0',
            Accept: 'application/json',
            'Content-Type': 'application/json; charset=utf-8',
            'If-Match': '*',
          },
          credentials: 'include',
          body: JSON.stringify(payload),
        }
      );

      return response.ok;
    } catch (error) {
      console.error('Error saving web resource:', error);
      alert('Error saving web resource.');
      return false;
    }
  }

  async function publishWebResource() {
    const payload = {
      ParameterXml: `<importexportxml><webresources><webresource>${resource.webresourceid}</webresource></webresources></importexportxml>`,
    };

    try {
      const response = await fetch(
        `${environmentUrl}/api/data/v9.2/PublishXml`,
        {
          method: 'POST',
          headers: {
            'OData-MaxVersion': '4.0',
            'OData-Version': '4.0',
            Accept: 'application/json',
            'Content-Type': 'application/json; charset=utf-8',
          },
          credentials: 'include',
          body: JSON.stringify(payload),
        }
      );

      return response.ok;
    } catch (error) {
      console.error('Error publishing web resource:', error);
      alert('Error publishing web resource.');
      return false;
    }
  }

  async function reloadWebResource() {
    try {
      const response = await fetch(
        `${environmentUrl}/api/data/v9.2/webresourceset(${resource.webresourceid})`,
        {
          method: 'GET',
          headers: {
            'OData-MaxVersion': '4.0',
            'OData-Version': '4.0',
            Accept: 'application/json',
          },
          credentials: 'include',
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch web resource');
      }

      const updatedResource = await response.json();
      resource = updatedResource;
      // We don't need to call initializeEditor here anymore
      // since we're reloading the entire page
    } catch (error) {
      console.error('Error reloading web resource:', error);
      throw error;
    }
  }
});
