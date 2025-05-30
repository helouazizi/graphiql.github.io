export function Header() {
  const header = document.createElement("header");
  header.classList.add("header");

  // Logo with user icon
  const logo = document.createElement("div");
  logo.classList.add("logo");
  logo.innerHTML = `<i class="fas fa-user-circle"></i> <span>Z01 Profile</span>`;

  // Navigation
  const nav = document.createElement("nav");
  const navList = document.createElement("ul");

  const logoutLink = document.createElement("li");
  logoutLink.innerHTML = `
    <a href="#" id="logout">
      <i class="fas fa-sign-out-alt"></i> Log out
    </a>`;

  navList.appendChild(logoutLink);
  nav.appendChild(navList);

  header.append(logo, nav);
  return header;
}


export function Footer() {
  const footer = document.createElement("footer");
  footer.classList.add("footer");

  footer.innerHTML = `
    <p>&copy; ${new Date().getFullYear()} Z01. All rights reserved.</p>
  `;

  return footer;
}


export function logincomponent() {
  let loginDiv = document.createElement("div");
  loginDiv.classList.add("login-container");

  let header = document.createElement("h1");
  header.id = "login-header";
  header.classList.add("login-header");
  header.innerHTML = "Login"

  let loginForm = document.createElement("form");
  loginForm.id = "login-form";
  loginForm.classList.add("login-form");

  let userWrapper = document.createElement("div");
  userWrapper.classList.add("input-wrapper");
  userWrapper.innerHTML = `
    <i class="fas fa-user icon"></i>
    <input type="text" id="userinput" class="input" placeholder="Enter your Username or your Email">
  `;

  let passwordWrapper = document.createElement("div");
  passwordWrapper.classList.add("input-wrapper");
  passwordWrapper.innerHTML = `
    <i class="fas fa-lock icon"></i>
    <input type="password" id="passwordinput" class="input" placeholder="Enter your Password">
  `;

  let submit = document.createElement('button');
  submit.type = "submit";
  submit.id = "submit";
  submit.classList.add("submit-btn");
  submit.textContent = 'Submit';

  loginForm.append(header, userWrapper, passwordWrapper, submit);
  loginDiv.appendChild(loginForm);
  return loginDiv;
}

export function sectiondata(data = {}) {


  let section = document.createElement("section");
  section.classList.add("user-data-section");

  // First div: Welcome + user info
  let userDiv = document.createElement("div");
  userDiv.classList.add("user-info");

  let welcome = document.createElement("h2");
  welcome.textContent = `Welcome, ${data.user.firstName} ${data.user.lastName}!`;
  userDiv.appendChild(welcome);

  const userDetails = [
    { label: "Tel", value: data.user.attrs.tel },
    { label: "City", value: data.user.attrs.city },
    { label: "Email", value: data.user.attrs.email },
    { label: "Campus", value: data.user.campus }
  ];

  userDetails.forEach(({ label, value }) => {
    let p = document.createElement("p");
    p.innerHTML = `<strong>${label}:</strong> ${value}`;
    userDiv.appendChild(p);
  });

  // Second div: Audit ratio
  let auditDiv = document.createElement("div");
  auditDiv.classList.add("audit-info");

  let auditTitle = document.createElement("h3");
  auditTitle.textContent = "Audit Ratio";
  let auditValue = document.createElement("p");
  auditValue.textContent = Math.round(data.user.auditRatio * 10) / 10;

  auditDiv.append(auditTitle, auditValue);

  // Third div: Level
  let levelDiv = document.createElement("div");
  levelDiv.classList.add("level-info");

  let levelTitle = document.createElement("h3");
  levelTitle.textContent = "Level";
  let levelValue = document.createElement("p");
  levelValue.textContent = data.level;

  levelDiv.append(levelTitle, levelValue);
  // fourt div : total xp 
  let xpdiv = document.createElement("div");
  xpdiv.classList.add("level-info");

  let xpTitle = document.createElement("h3");
  xpTitle.textContent = "Totale xp ";
  let xpValue = document.createElement("p");
  xpValue.textContent = Math.floor(data.xp / 1000) + "KB";

  xpdiv.append(xpTitle, xpValue);

  // Append all divs to section
  section.append(userDiv, auditDiv, levelDiv, xpdiv);

  return section;
}
export function showMessage(message) {
  const popup = document.createElement("div");
  popup.setAttribute("id", "message_popup");
  popup.innerHTML = `<h2>${message}</h2>`;
  document.body.appendChild(popup);

  setTimeout(() => {
    popup.remove();
  }, 3000);
}


export function createXpGraph(data) {
  const container = document.createElement('div');
  container.classList.add('xp-graph-container');

  const title = document.createElement('h3');
  title.textContent = `XP Progression`;
  container.appendChild(title);

  const svgNS = "http://www.w3.org/2000/svg";

  // FIXED WIDTH & HEIGHT
  const width = 700;
  const height = 300;
  const margin = { top: 30, right: 30, bottom: 50, left: 50 };

  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("width", width);
  svg.setAttribute("height", height);
  svg.classList.add("xp-graph-svg");
  container.appendChild(svg);

  const tooltip = document.createElement("div");
  tooltip.classList.add("xp-tooltip");
  tooltip.style.position = "fixed";
  tooltip.style.pointerEvents = "none";
  tooltip.style.visibility = "hidden";
  tooltip.style.background = "#222";
  tooltip.style.color = "white";
  tooltip.style.padding = "6px 10px";
  tooltip.style.borderRadius = "4px";
  tooltip.style.fontSize = "12px";
  tooltip.style.zIndex = 9999;
  document.body.appendChild(tooltip);

  const processedData = data
    .map(d => ({
      x: new Date(d.date || d.createdAt),
      y: d.xp || d.amount,
      path: d.path || (d.progress && d.progress.path) || "",
      original: d
    }))
    .sort((a, b) => a.x - b.x);

  if (processedData.length === 0) {
    container.appendChild(document.createTextNode("No data to display"));
    return container;
  }

  // const xMin = processedData[0].x;
  // const xMax = processedData[processedData.length - 1].x;
  const yMax = Math.max(...processedData.map(d => d.y));

  // SCALE Y as before
  const scaleY = (y) => {
    return height - margin.bottom - (y / yMax) * (height - margin.top - margin.bottom);
  };

  // SCALE X: spread points evenly horizontally across width (ignores date differences)
  const scaleX = (i) => {
    const usableWidth = width - margin.left - margin.right;
    const n = processedData.length - 1;
    if (n === 0) return margin.left + usableWidth / 2;
    return margin.left + (i / n) * usableWidth;
  };

  // Axes
  const xAxis = document.createElementNS(svgNS, "line");
  xAxis.setAttribute("x1", margin.left);
  xAxis.setAttribute("y1", height - margin.bottom);
  xAxis.setAttribute("x2", width - margin.right);
  xAxis.setAttribute("y2", height - margin.bottom);
  xAxis.setAttribute("stroke", "#333");
  svg.appendChild(xAxis);

  const yAxis = document.createElementNS(svgNS, "line");
  yAxis.setAttribute("x1", margin.left);
  yAxis.setAttribute("y1", margin.top);
  yAxis.setAttribute("x2", margin.left);
  yAxis.setAttribute("y2", height - margin.bottom);
  yAxis.setAttribute("stroke", "#333");
  svg.appendChild(yAxis);

  for (let i = 0; i <= 5; i++) {
    const yVal = (yMax / 5) * i;
    const yPos = scaleY(yVal);

    const gridLine = document.createElementNS(svgNS, "line");
    gridLine.setAttribute("x1", margin.left);
    gridLine.setAttribute("y1", yPos);
    gridLine.setAttribute("x2", width - margin.right);
    gridLine.setAttribute("y2", yPos);
    gridLine.setAttribute("stroke", "#ddd");
    gridLine.setAttribute("stroke-dasharray", "4 2");
    svg.appendChild(gridLine);

    const label = document.createElementNS(svgNS, "text");
    label.setAttribute("x", margin.left - 10);
    label.setAttribute("y", yPos + 4);
    label.setAttribute("text-anchor", "end");
    label.setAttribute("font-size", "12");
    label.setAttribute("fill", "#666");
    label.textContent = Math.round(yVal);
    svg.appendChild(label);
  }

  // X axis labels: evenly spaced indexes with dates
  const labelStep = Math.ceil(processedData.length / 6);
  for (let i = 0; i < processedData.length; i += labelStep) {
    const xPos = scaleX(i);
    const label = document.createElementNS(svgNS, "text");
    label.setAttribute("x", xPos);
    label.setAttribute("y", height - margin.bottom + 20);
    label.setAttribute("text-anchor", "middle");
    label.setAttribute("font-size", "12");
    label.setAttribute("fill", "#666");
    label.textContent = processedData[i].x.toLocaleDateString();
    svg.appendChild(label);
  }

  // Create polyline points string based on index for X
  const points = processedData
    .map((p, i) => `${scaleX(i)},${scaleY(p.y)}`)
    .join(" ");

  const polyline = document.createElementNS(svgNS, "polyline");
  polyline.setAttribute("points", points);
  polyline.setAttribute("fill", "none");
  polyline.setAttribute("stroke", "#4a90e2");
  polyline.setAttribute("stroke-width", "3");
  svg.appendChild(polyline);

  // Circles + tooltip
  processedData.forEach((point, i) => {
    const cx = scaleX(i);
    const cy = scaleY(point.y);

    const circle = document.createElementNS(svgNS, "circle");
    circle.setAttribute("cx", cx);
    circle.setAttribute("cy", cy);
    circle.setAttribute("r", 6);
    circle.setAttribute("fill", "#4a90e2");
    circle.style.cursor = "pointer";

    circle.addEventListener("mouseenter", (e) => {
      tooltip.innerHTML = `
          <div>
            <strong>Date:</strong> ${point.x.toLocaleDateString()}<br>
            <strong>XP:</strong> ${point.y} B<br>
            <strong>Path:</strong><br><pre>${point.path}</pre>
          </div>
        `;
      tooltip.style.visibility = "visible";
      tooltip.style.opacity = "1";

      const offset = 10;
      let left = e.clientX + offset;
      let top = e.clientY + offset;
      if (left + tooltip.offsetWidth > window.innerWidth) {
        left = e.clientX - tooltip.offsetWidth - offset;
      }
      if (top + tooltip.offsetHeight > window.innerHeight) {
        top = e.clientY - tooltip.offsetHeight - offset;
      }
      tooltip.style.left = left + "px";
      tooltip.style.top = top + "px";
    });

    circle.addEventListener("mouseleave", () => {
      tooltip.style.visibility = "hidden";
      tooltip.style.opacity = "0";
    });


    svg.appendChild(circle);
  });

  container.cleanup = () => {
    if (tooltip.parentNode) {
      tooltip.parentNode.removeChild(tooltip);
    }
  };

  return container;
}




export function createSkillsRadarChart(skillsData) {
  // Aggregate skills by type, taking the max amount
  const skillMax = skillsData.reduce((acc, skill) => {
    const cleanType = skill.type.replace('skill_', '');
    acc[cleanType] = Math.max(acc[cleanType] || 0, skill.amount);
    return acc;
  }, {});


  const container = document.createElement('div');
  container.classList.add('skills-radar-chart-container');


  const svgNS = "http://www.w3.org/2000/svg";
  const viewBoxSize = 300;
  const center = viewBoxSize / 2;
  const maxRadius = 130;

  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("viewBox", `0 0 ${viewBoxSize} ${viewBoxSize}`);
  svg.classList.add("skills-radar-chart");
  svg.style.overflow = "visible";

  // Prepare data
  const skills = Object.keys(skillMax);
  const maxValue = Math.max(...Object.values(skillMax));
  const angleStep = (2 * Math.PI) / skills.length;

  // Draw background grid circles
  const gridLevels = 9;
  for (let level = 1; level <= gridLevels; level++) {
    const circle = document.createElementNS(svgNS, "circle");
    circle.setAttribute("cx", center);
    circle.setAttribute("cy", center);
    circle.setAttribute("r", (maxRadius * level) / gridLevels);
    circle.classList.add('radar-grid-circle');
    svg.appendChild(circle);
  }

  // Draw radial elements
  skills.forEach((_, i) => {
    const angle = i * angleStep;
    const endX = center + maxRadius * Math.cos(angle);
    const endY = center + maxRadius * Math.sin(angle);

    // Radial line
    const line = document.createElementNS(svgNS, "line");
    line.setAttribute("x1", center);
    line.setAttribute("y1", center);
    line.setAttribute("x2", endX);
    line.setAttribute("y2", endY);
    line.classList.add('radar-radial-line');
    svg.appendChild(line);

    // Grid points
    for (let level = 1; level <= gridLevels; level++) {
      const radius = (maxRadius * level) / gridLevels;
      const point = document.createElementNS(svgNS, "circle");
      point.setAttribute("cx", center + radius * Math.cos(angle));
      point.setAttribute("cy", center + radius * Math.sin(angle));
      point.classList.add('radar-grid-point');
      svg.appendChild(point);
    }
  });

  // Calculate data points
  const dataPoints = skills.map((skill, i) => {
    const value = skillMax[skill];
    const scaledValue = (value / maxValue) * maxRadius;
    const angle = i * angleStep;
    return {
      x: center + scaledValue * Math.cos(angle),
      y: center + scaledValue * Math.sin(angle),
      skill
    };
  });

  // Draw data polygon
  const polygon = document.createElementNS(svgNS, "polygon");
  polygon.setAttribute("points", dataPoints.map(p => `${p.x},${p.y}`).join(' '));
  polygon.classList.add('radar-data-polygon');
  svg.appendChild(polygon);

  // Add labels
  dataPoints.forEach((point, i) => {
    const angle = i * angleStep;
    const labelRadius = maxRadius + 30;
    const label = document.createElementNS(svgNS, "text");

    label.setAttribute("x", center + labelRadius * Math.cos(angle));
    label.setAttribute("y", center + labelRadius * Math.sin(angle));
    label.textContent = point.skill;
    label.classList.add('radar-label');

    // Text anchoring
    const textAnchor = angle <= Math.PI / 2 || angle > 3 * Math.PI / 2 ? "start" : "end";
    const baseline = angle < Math.PI ? "after-edge" : "before-edge";
    label.setAttribute("text-anchor", textAnchor);
    label.setAttribute("alignment-baseline", baseline);

    svg.appendChild(label);
  });

  container.appendChild(svg);
  return container;
}

