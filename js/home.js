import {
  Header,
  sectiondata,
  createXpGraph,
  createSkillsRadarChart,
} from "./component.js";
import { fetchdata } from "./api.js";

async function HomePage() {
  const body = document.body;
  body.innerHTML = "";

  // --- Header ---
  const header = Header();
  body.appendChild(header);

  // --- Fetch Data ---
  const data = await fetchdata();
  const userData = data.data.user[0];
  const userLevel = data.data.levels.aggregate.max.amount;
  const totalXp = data.data.totalxpamount.aggregate.sum.amount;
  const xpData = data.data.xp;
  const skillData = data.data.skil;

  // --- User Info Section ---
  const section = sectiondata({
    user: userData,
    level: userLevel,
    xp: totalXp,
  });
  body.appendChild(section);

  // --- Graphs Section ---
  const chartSection = document.createElement("section");
  chartSection.id = "chart-section";

  const xpGraph = await createXpGraph(xpData);
  const skillsRadar = await createSkillsRadarChart(skillData);
  chartSection.append(xpGraph, skillsRadar);

  body.appendChild(chartSection);

  // --- Footer ---
  const footer = document.createElement("footer");
  footer.classList.add("footer");
  footer.innerHTML = `
    <p>&copy; ${new Date().getFullYear()} z01. All rights reserved.</p>
  `;
  body.appendChild(footer);
}

export { HomePage };
