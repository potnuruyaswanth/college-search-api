const url = "http://universities.hipolabs.com/search?country=";
const config = { headers: { Accept: "application/json" } };

const inputCountry = document.querySelector('#country');
const inputCollege = document.querySelector('#college_name');
const inputState = document.querySelector('#state');
const btn = document.querySelector('#bt');
const ul = document.querySelector('#result');

btn.addEventListener('click', async () => {
  ul.innerHTML = ""; // Clear old results

  const country = inputCountry.value.trim();
  const college = inputCollege.value.trim();
  const state = inputState.value.trim();

  if (!country) {
    alert("Please enter a country.");
    return;
  }

  const results = await fetchData(country, college);

  const filteredResults = results.filter(college => {
    return state ? (college["state-province"]?.toLowerCase().includes(state.toLowerCase())) : true;
  });

  if (filteredResults.length === 0) {
    ul.innerHTML = "<li><div class='college-info'><p>No colleges found.</p></div></li>";
    return;
  }

  for (let college of filteredResults) {
    const li = document.createElement('li');

    li.innerHTML = `
      <div class="college-info">
        <p><strong>${college.name}</strong></p>
        <p>📍 ${college.country}${college["state-province"] ? ", " + college["state-province"] : ""}</p>
        <p>🎓 Domains: ${college.domains.join(", ")}</p>
      </div>
      <div class="college-link">
        <a href="${college.web_pages[0]}" target="_blank">🌐 Visit</a>
      </div>
    `;
    ul.appendChild(li);
  }
});

async function fetchData(country, college) {
  try {
    let query = url + encodeURIComponent(country);
    if (college) {
      query += "&name=" + encodeURIComponent(college);
    }
    const res = await axios.get(query, config);
    return res.data;
  } catch (err) {
    console.error("Error fetching data:", err);
    return [];
  }
}
