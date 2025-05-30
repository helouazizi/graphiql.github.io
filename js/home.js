import {
  Header,
  sectiondata,
  createXpGraph,
  createSkillsRadarChart,
  Footer
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

  const xp_section = await createXpGraph(xpData);
  const skills_section = await createSkillsRadarChart(skillData);
  body.append(xp_section, skills_section);

  const footer = Footer()
  body.append(footer)

  
}

export { HomePage };
