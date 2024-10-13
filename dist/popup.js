document.addEventListener("DOMContentLoaded",(async()=>{const e=document.getElementById("environmentName"),n=document.getElementById("searchBox"),t=document.getElementById("solutionsDropdown"),o=document.getElementById("webResourcesDropdown"),r=document.getElementById("openEditorButton");let i="",a=[],c=[];function s(e){t.innerHTML='<option value="">Select a Solution</option>',e.forEach((e=>{const n=document.createElement("option");n.value=e.solutionid,n.textContent=e.friendlyname,t.appendChild(n)}))}chrome.tabs.query({active:!0,currentWindow:!0},(async u=>{const l=u[0],d=new URL(l.url);i=`${d.origin}`,e.textContent=`Environment: ${i}`;let p=await async function(n){try{const e=await fetch(`${n}/api/data/v9.2/solutions?$select=friendlyname,solutionid`,{headers:{"OData-MaxVersion":"4.0","OData-Version":"4.0",Accept:"application/json","Content-Type":"application/json; charset=utf-8"},credentials:"include"});return await e.json()}catch(n){return console.error("Error fetching solutions:",n),e.textContent="Error fetching solutions.",{value:[]}}}(i);a=p.value||[],s(a),n.addEventListener("input",(()=>{s(a.filter((e=>e.friendlyname.toLowerCase().includes(n.value.toLowerCase()))))})),t.addEventListener("change",(()=>{const e=t.value;o.innerHTML='<option value="">Select a Web Resource</option>',r.disabled=!0,e&&async function(e){o.innerHTML="<option>Loading...</option>";try{const t=`\n            <fetch>\n              <entity name="webresource">\n                <attribute name="name"/>\n                <attribute name="webresourceid"/>\n                <attribute name="webresourcetype"/>\n                <attribute name="content"/>\n                <link-entity name="solutioncomponent" from="objectid" to="webresourceid" alias="sc">\n                  <filter>\n                    <condition attribute="solutionid" operator="eq" value="${e}"/>\n                  </filter>\n                </link-entity>\n              </entity>\n            </fetch>\n          `,r=encodeURIComponent(t.trim()),a=await fetch(`${i}/api/data/v9.2/webresourceset?fetchXml=${r}`,{headers:{"OData-MaxVersion":"4.0","OData-Version":"4.0",Accept:"application/json","Content-Type":"application/json; charset=utf-8"},credentials:"include"});if(!a.ok){const e=await a.text();return console.error("Error fetching web resources:",a.status,a.statusText,e),void(o.innerHTML="<option>Error loading web resources.</option>")}const s=await a.json();if(console.log("webResourcesData:",s),!Array.isArray(s.value))return console.error("webResourcesData.value is not an array:",s.value),void(o.innerHTML="<option>Error loading web resources.</option>");c=s.value,n=c,o.innerHTML='<option value="">Select a Web Resource</option>',0!==n.length?n.forEach((e=>{const n=document.createElement("option");n.value=e.webresourceid,n.textContent=e.name,o.appendChild(n)})):o.innerHTML="<option>No web resources found.</option>"}catch(e){console.error("Error fetching web resources:",e),o.innerHTML="<option>Error loading web resources.</option>"}var n}(e)})),o.addEventListener("change",(()=>{o.value?r.disabled=!1:r.disabled=!0})),r.addEventListener("click",(()=>{const e=o.value,n=c.find((n=>n.webresourceid===e));var t;n&&(t=n,chrome.runtime.sendMessage({action:"openEditor",resource:t,environmentUrl:i}))}))}))}));
//# sourceMappingURL=popup.js.map