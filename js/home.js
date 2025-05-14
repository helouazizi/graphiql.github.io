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
  const head = Header();
  body.appendChild(head);
  let data = await fetchdata();
  console.log(data);
  let secdata = {};
  (secdata.user = data.data.user[0]),
    (secdata.level = data.data.levels.aggregate.max.amount);
  secdata.xp = data.data.totalxpamount.aggregate.sum.amount;
  
  let section = sectiondata(secdata);
  body.appendChild(section);
  let shart = document.createElement("section");
  shart.id = "shart";
  let xpgrqph = await createXpGraph(data.data.xp);
  let skill = await createSkillsRadarChart(data.data.skil);
  shart.append(xpgrqph, skill);
  body.appendChild(shart);
}

export { HomePage };
