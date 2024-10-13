document.addEventListener('DOMContentLoaded', async () => {
    const environmentNameElem = document.getElementById('environmentName');
    const searchBox = document.getElementById('searchBox');
    const solutionsDropdown = document.getElementById('solutionsDropdown');
    const webResourcesDropdown = document.getElementById('webResourcesDropdown');
    const openEditorButton = document.getElementById('openEditorButton');
    let environmentUrl = '';
    let solutions = [];
    let webResources = [];
  
    // Get the current tab URL
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      const tab = tabs[0];
      const url = new URL(tab.url);
      environmentUrl = `${url.origin}`;
  
      environmentNameElem.textContent = `Environment: ${environmentUrl}`;
  
      // Fetch solutions
      let solutionsData = await fetchSolutions(environmentUrl);
      solutions = solutionsData.value || [];
  
      // Display solutions in dropdown
      displaySolutions(solutions);
  
      // Filter solutions based on search input
      searchBox.addEventListener('input', () => {
        const filteredSolutions = solutions.filter(solution =>
          solution.friendlyname.toLowerCase().includes(searchBox.value.toLowerCase())
        );
        displaySolutions(filteredSolutions);
      });
  
      // Handle solution selection
      solutionsDropdown.addEventListener('change', () => {
        const selectedSolutionId = solutionsDropdown.value;
        webResourcesDropdown.innerHTML = '<option value="">Select a Web Resource</option>';
        openEditorButton.disabled = true;
        if (selectedSolutionId) {
          loadWebResources(selectedSolutionId);
        }
      });
  
      // Handle web resource selection
      webResourcesDropdown.addEventListener('change', () => {
        if (webResourcesDropdown.value) {
          openEditorButton.disabled = false;
        } else {
          openEditorButton.disabled = true;
        }
      });
  
      // Handle "Open in Editor" button click
      openEditorButton.addEventListener('click', () => {
        const selectedResourceId = webResourcesDropdown.value;
        const selectedResource = webResources.find(resource => resource.webresourceid === selectedResourceId);
        if (selectedResource) {
          // Open the editor page with the selected resource
          openEditorPage(selectedResource);
        }
      });
    });
  
    // Function to fetch solutions from the environment
    async function fetchSolutions(environmentUrl) {
      try {
        const response = await fetch(`${environmentUrl}/api/data/v9.2/solutions?$select=friendlyname,solutionid`, {
          headers: {
            'OData-MaxVersion': '4.0',
            'OData-Version': '4.0',
            'Accept': 'application/json',
            'Content-Type': 'application/json; charset=utf-8'
          },
          credentials: 'include' // Important for authentication
        });
        return await response.json();
      } catch (error) {
        console.error('Error fetching solutions:', error);
        environmentNameElem.textContent = 'Error fetching solutions.';
        return { value: [] };
      }
    }
  
    // Function to display solutions in the dropdown
    function displaySolutions(solutionsList) {
      // Clear the dropdown options
      solutionsDropdown.innerHTML = '<option value="">Select a Solution</option>';
      solutionsList.forEach(solution => {
        const option = document.createElement('option');
        option.value = solution.solutionid;
        option.textContent = solution.friendlyname;
        solutionsDropdown.appendChild(option);
      });
    }
  
    // Function to load web resources of a solution
    async function loadWebResources(solutionId) {
        webResourcesDropdown.innerHTML = '<option>Loading...</option>';
        try {
          // Build FetchXML query
          const fetchXml = `
            <fetch>
              <entity name="webresource">
                <attribute name="name"/>
                <attribute name="webresourceid"/>
                <attribute name="webresourcetype"/>
                <attribute name="content"/>
                <link-entity name="solutioncomponent" from="objectid" to="webresourceid" alias="sc">
                  <filter>
                    <condition attribute="solutionid" operator="eq" value="${solutionId}"/>
                  </filter>
                </link-entity>
              </entity>
            </fetch>
          `;
          const encodedFetchXml = encodeURIComponent(fetchXml.trim());
          const response = await fetch(`${environmentUrl}/api/data/v9.2/webresourceset?fetchXml=${encodedFetchXml}`, {
            headers: {
              'OData-MaxVersion': '4.0',
              'OData-Version': '4.0',
              'Accept': 'application/json',
              'Content-Type': 'application/json; charset=utf-8'
            },
            credentials: 'include'
          });
      
          // Check if the response is OK
          if (!response.ok) {
            const errorText = await response.text();
            console.error('Error fetching web resources:', response.status, response.statusText, errorText);
            webResourcesDropdown.innerHTML = '<option>Error loading web resources.</option>';
            return;
          }
      
          const webResourcesData = await response.json();
      
          // Log the data to inspect it
          console.log('webResourcesData:', webResourcesData);
      
          // Ensure webResourcesData.value is an array
          if (!Array.isArray(webResourcesData.value)) {
            console.error('webResourcesData.value is not an array:', webResourcesData.value);
            webResourcesDropdown.innerHTML = '<option>Error loading web resources.</option>';
            return;
          }
      
          webResources = webResourcesData.value;
          displayWebResources(webResources);
        } catch (error) {
          console.error('Error fetching web resources:', error);
          webResourcesDropdown.innerHTML = '<option>Error loading web resources.</option>';
        }
      }
          
  
    // Function to display web resources in the dropdown
    function displayWebResources(webResourcesList) {
      webResourcesDropdown.innerHTML = '<option value="">Select a Web Resource</option>';
      if (webResourcesList.length === 0) {
        webResourcesDropdown.innerHTML = '<option>No web resources found.</option>';
        return;
      }
      webResourcesList.forEach(resource => {
        const option = document.createElement('option');
        option.value = resource.webresourceid;
        option.textContent = resource.name;
        webResourcesDropdown.appendChild(option);
      });
    }
  
    // Function to open the editor page with the selected web resource
    function openEditorPage(resource) {
      // Open a new tab with the editor page, passing the resource details via query parameters or storage
      chrome.runtime.sendMessage({
        action: 'openEditor',
        resource: resource,
        environmentUrl: environmentUrl
      });
    }
  });
  