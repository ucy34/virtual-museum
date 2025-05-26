const apiUrl = 'https://api.sheetbest.com/sheets/1e7c609c-94e8-4251-8d6d-7cf8f86d7f16';
const artifactsContainer = document.getElementById('artifacts-container');

console.log("Script.js loaded.");

if (artifactsContainer) {
    console.log("artifacts-container element found.");
} else {
    console.error("ERROR: artifacts-container element not found in HTML!");
}

async function fetchArtifacts() {
    console.log("fetchArtifacts function called.");
    try {
        const response = await fetch(apiUrl);
        console.log("API request sent. Response status:", response.status);

        if (!response.ok) {
            console.error("API response not OK. Status:", response.status, response.statusText);
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const rawData = await response.json();
        console.log("Raw data received from API:", rawData);

        const artifacts = transformData(rawData);
        console.log("Transformed artifact data:", artifacts);

        displayArtifacts(artifacts);
    } catch (error) {
        console.error("Error loading artifacts (catch block):", error);
        if (artifactsContainer) {
            artifactsContainer.innerHTML = '<p>Could not load artifacts. Please try again later or check the console.</p>';
        }
    }
}

function transformData(rawData) {
    if (!rawData || rawData.length === 0) {
        return [];
    }

    const transformedArtifacts = [];
    const artifactKeys = Object.keys(rawData[0]).filter(key => key !== 'Artifact Name');

    artifactKeys.forEach(artifactKey => {
        const newArtifact = {
            "Artifact Name": artifactKey
        };
        rawData.forEach(propertyRow => {
            const propertyName = propertyRow["Artifact Name"];
            const propertyValue = propertyRow[artifactKey];

            if (propertyName === 'Link') {
                newArtifact['Link'] = propertyValue;
            } else if (propertyName === 'Short Description') {
                newArtifact['Short Description'] = propertyValue;
            } else if (propertyName === 'Period') {
                newArtifact['Period'] = propertyValue;
            } else if (propertyName === 'Material') {
                newArtifact['Material'] = propertyValue;
            } else if (propertyName === 'Origin') {
                newArtifact['Origin'] = propertyValue;
            }
        });
        transformedArtifacts.push(newArtifact);
    });

    return transformedArtifacts;
}

function displayArtifacts(artifacts) {
    console.log("displayArtifacts function called. Received artifacts:", artifacts);

    if (!artifactsContainer) {
        console.error("ERROR: artifacts-container not found in displayArtifacts!");
        return;
    }

    if (!artifacts || artifacts.length === 0) {
        console.log("No artifacts to display (empty or undefined artifacts).");
        artifactsContainer.innerHTML = '<p>No artifacts found to display.</p>';
        return;
    }

    artifactsContainer.innerHTML = '';
    console.log("artifactsContainer content cleared.");

    artifacts.forEach((artifact, index) => {
        console.log(`Processing artifact ${index + 1}:`, artifact);

        const card = document.createElement('div');
        card.classList.add('artifact-card');

        if (artifact['Link']) {
            const img = document.createElement('img');
            img.src = artifact['Link'];
            img.alt = artifact['Artifact Name'] || 'Artifact Image';
            card.appendChild(img);
            console.log(`Artifact ${index + 1} (${artifact['Artifact Name']}): Image added - ${artifact['Link']}`);
        } else {
            console.log(`Artifact ${index + 1} (${artifact['Artifact Name']}): 'Link' column is empty or missing.`);
        }

        if (artifact['Artifact Name']) {
            const name = document.createElement('h2');
            name.textContent = artifact['Artifact Name'];
            card.appendChild(name);
        } else {
            console.log(`Artifact ${index + 1}: 'Artifact Name' column is empty or missing.`);
        }

        if (artifact['Short Description']) {
            const description = document.createElement('p');
            description.textContent = artifact['Short Description'];
            card.appendChild(description);
        } else {
            console.log(`Artifact ${index + 1} (${artifact['Artifact Name']}): 'Short Description' column is empty or missing.`);
        }

        if (artifact['Period']) {
            const period = document.createElement('p');
            period.innerHTML = `<strong>Period:</strong> ${artifact['Period']}`;
            card.appendChild(period);
        } else {
            console.log(`Artifact ${index + 1} (${artifact['Artifact Name']}): 'Period' column is empty or missing.`);
        }

        if (artifact['Material']) {
            const material = document.createElement('p');
            material.innerHTML = `<strong>Material:</strong> ${artifact['Material']}`;
            card.appendChild(material);
        } else {
            console.log(`Artifact ${index + 1} (${artifact['Artifact Name']}): 'Material' column is empty or missing.`);
        }

        if (artifact['Origin']) {
            const origin = document.createElement('p');
            origin.innerHTML = `<strong>Origin:</strong> ${artifact['Origin']}`;
            card.appendChild(origin);
        } else {
            console.log(`Artifact ${index + 1} (${artifact['Artifact Name']}): 'Origin' column is empty or missing.`);
        }

        artifactsContainer.appendChild(card);
        console.log(`Artifact ${index + 1} (${artifact['Artifact Name']}): Card added to DOM.`);
    });
}

if (typeof fetchArtifacts === 'function') {
    fetchArtifacts();
} else {
    console.error("ERROR: fetchArtifacts function is not defined!");
}