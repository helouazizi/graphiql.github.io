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
  xpValue.textContent = Math.round(data.xp / 1000) + "KB";

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
  const container = document.createElement("div");
  container.classList.add("xp-graph-container");

  const title = document.createElement("h3");
  title.textContent = "XP Progression";
  container.appendChild(title);

  const svgNS = "http://www.w3.org/2000/svg";
  const width = 800;
  const height = 300;
  const margin = { top: 30, right: 30, bottom: 50, left: 60 };

  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.classList.add("xp-graph-svg");
  container.appendChild(svg);

  const tooltip = document.createElement("div");
  tooltip.className = "xp-tooltip";
  document.body.appendChild(tooltip);

  // Step 1: Prepare and sort data
  const rawData = data
    .map((d) => ({
      date: new Date(d.date || d.createdAt),
      xp: d.xp || d.amount || 0,
      path: d.path || (d.progress && d.progress.path) || "",
      original: d,
    }))
    .sort((a, b) => a.date - b.date);

  // Step 2: Compute cumulative XP
  let totalXP = 0;
  const processedData = rawData.map((d) => {
    totalXP += d.xp;
    return {
      x: d.date,
      y: totalXP,
      path: d.path,
      original: d.original,
      xpThisStep: d.xp,
    };
  });

  if (!processedData.length) {
    container.appendChild(document.createTextNode("No data to display"));
    return container;
  }

  // X and Y Ranges
  const xExtent = [processedData[0].x, processedData.at(-1).x];
  const yMax = processedData.at(-1).y;

  // Scales
  const scaleX = (date) => {
    const range = xExtent[1] - xExtent[0];
    return (
      margin.left +
      ((date - xExtent[0]) / range) * (width - margin.left - margin.right)
    );
  };

  const scaleY = (y) =>
    height - margin.bottom - (y / yMax) * (height - margin.top - margin.bottom);

  // Axes
  const drawLine = (x1, y1, x2, y2, stroke = "#ccc") => {
    const line = document.createElementNS(svgNS, "line");
    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);
    line.setAttribute("stroke", stroke);
    svg.appendChild(line);
  };

  drawLine(margin.left, margin.top, margin.left, height - margin.bottom); // Y
  drawLine(margin.left, height - margin.bottom, width - margin.right, height - margin.bottom); // X

  // Y ticks
  for (let i = 0; i <= 5; i++) {
    const y = (yMax / 5) * i;
    const yPos = scaleY(y);
    drawLine(margin.left, yPos, width - margin.right, yPos, "#eee");

    const label = document.createElementNS(svgNS, "text");
    label.setAttribute("x", margin.left - 10);
    label.setAttribute("y", yPos + 4);
    label.setAttribute("text-anchor", "end");
    label.setAttribute("font-size", "12");
    label.setAttribute("fill", "#666");
    label.textContent = Math.round(y);
    svg.appendChild(label);
  }

  // X labels
  const labelStep = Math.max(1, Math.floor(processedData.length / 6));
  for (let i = 0; i < processedData.length; i += labelStep) {
    const xDate = processedData[i].x;
    const xPos = scaleX(xDate);
    const label = document.createElementNS(svgNS, "text");
    label.setAttribute("x", xPos);
    label.setAttribute("y", height - margin.bottom + 20);
    label.setAttribute("text-anchor", "middle");
    label.setAttribute("font-size", "12");
    label.setAttribute("fill", "#666");
    label.textContent = xDate.toLocaleDateString();
    svg.appendChild(label);
  }

  // Path
  const pathD = processedData
    .map((point, i, arr) => {
      const x = scaleX(point.x);
      const y = scaleY(point.y);
      if (i === 0) return `M ${x} ${y}`;
      const prev = arr[i - 1];
      const prevX = scaleX(prev.x);
      const prevY = scaleY(prev.y);
      const cx = (prevX + x) / 2;
      return `C ${cx} ${prevY}, ${cx} ${y}, ${x} ${y}`;
    })
    .join(" ");

  const path = document.createElementNS(svgNS, "path");
  path.setAttribute("d", pathD);
  path.setAttribute("fill", "none");
  path.setAttribute("stroke", "#4a90e2");
  path.setAttribute("stroke-width", "3");
  path.setAttribute("stroke-linecap", "round");
  path.style.strokeDasharray = "1000";
  path.style.strokeDashoffset = "1000";
  path.style.animation = "draw-line 1.2s ease-out forwards";
  svg.appendChild(path);

  // Dots + Tooltip
  processedData.forEach((point) => {
    const cx = scaleX(point.x);
    const cy = scaleY(point.y);

    const circle = document.createElementNS(svgNS, "circle");
    circle.setAttribute("cx", cx);
    circle.setAttribute("cy", cy);
    circle.setAttribute("r", 5);
    circle.setAttribute("fill", "#4a90e2");
    circle.style.cursor = "pointer";

    circle.addEventListener("mouseenter", (e) => {
      tooltip.innerHTML = `
        <div class="tooltip-content">
          <strong>Date:</strong> ${point.x.toLocaleDateString()}<br>
          <strong>XP Gained:</strong> ${point.xpThisStep} B<br>
          <strong>Total XP:</strong> ${point.y} B<br>
          <strong>Path:</strong><br><pre>${point.path}</pre>
        </div>`;
      tooltip.classList.add("visible");
    });

    circle.addEventListener("mousemove", (e) => {
      const offset = 12;
      tooltip.style.left = `${e.clientX + offset}px`;
      tooltip.style.top = `${e.clientY + offset}px`;
    });

    circle.addEventListener("mouseleave", () => {
      tooltip.classList.remove("visible");
    });

    svg.appendChild(circle);
  });

  container.cleanup = () => {
    tooltip.remove();
  };

  return container;
}



export function createSkillsRadarChart(skillsData) {
    // Aggregate skills by type, taking the max amount
    const skillMax = skillsData.reduce((acc, skill) => {
        const cleanType = skill.type.replace('kill_', '');
        acc[cleanType] = Math.max(acc[cleanType] || 0, skill.amount);
        return acc;
    }, {});

    const container = document.createElement('div');
    container.classList.add('skills-radar-chart-container');
    let header = document.createElement("h3")
    header.textContent = 'Skills'

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
    const maxValue = 100; // <-- Fixed max value
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

    // Draw radial lines and grid points
    skills.forEach((_, i) => {
        const angle = i * angleStep;
        const endX = center + maxRadius * Math.cos(angle);
        const endY = center + maxRadius * Math.sin(angle);

        const line = document.createElementNS(svgNS, "line");
        line.setAttribute("x1", center);
        line.setAttribute("y1", center);
        line.setAttribute("x2", endX);
        line.setAttribute("y2", endY);
        line.classList.add('radar-radial-line');
        svg.appendChild(line);

        for (let level = 1; level <= gridLevels; level++) {
            const radius = (maxRadius * level) / gridLevels;
            const point = document.createElementNS(svgNS, "circle");
            point.setAttribute("cx", center + radius * Math.cos(angle));
            point.setAttribute("cy", center + radius * Math.sin(angle));
            point.classList.add('radar-grid-point');
            svg.appendChild(point);
        }
    });

    // Calculate data points using fixed 100 scale
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

    // Draw the data polygon
    const polygon = document.createElementNS(svgNS, "polygon");
    polygon.setAttribute("points", dataPoints.map(p => `${p.x},${p.y}`).join(' '));
    polygon.classList.add('radar-data-polygon');
    svg.appendChild(polygon);

    // Add skill labels
    dataPoints.forEach((point, i) => {
        const angle = i * angleStep;
        const labelRadius = maxRadius + 30;
        const label = document.createElementNS(svgNS, "text");

        label.setAttribute("x", center + labelRadius * Math.cos(angle));
        label.setAttribute("y", center + labelRadius * Math.sin(angle));
        label.textContent = point.skill;
        label.classList.add('radar-label');

        const textAnchor = angle <= Math.PI / 2 || angle > 3 * Math.PI / 2 ? "start" : "end";
        const baseline = angle < Math.PI ? "after-edge" : "before-edge";
        label.setAttribute("text-anchor", textAnchor);
        label.setAttribute("alignment-baseline", baseline);

        svg.appendChild(label);
    });
    container.appendChild(header)
    container.appendChild(svg);
    return container;
}

