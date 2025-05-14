export function Header() {
  let header = document.createElement("header");
  header.classList.add("header");

  let logo = document.createElement("h1");
  logo.textContent = "Z01 Profile";
  logo.classList.add("logo");

  let nav = document.createElement("nav");
  let navList = document.createElement("ul");

  let homeLink = document.createElement("li");
  homeLink.innerHTML = `<a href="/">Home</a>`;

  let logoutLink = document.createElement("li");
  logoutLink.innerHTML = `<a href="#" id="logout">Log out</a>`;

  navList.append(homeLink, logoutLink);
  nav.appendChild(navList);

  header.append(logo, nav);

  return header;
}
  export function logincomponent() {
  let loginDiv = document.createElement("div");
  loginDiv.classList.add("login-container");

  let loginForm = document.createElement("form");
  loginForm.id = "login-form";
  loginForm.classList.add("login-form");

  let userinput = document.createElement("input");
  userinput.type = 'text';
  userinput.placeholder = "Enter your Username or your Email";
  userinput.id = "userinput";
  userinput.classList.add("input");

  let passwordinput = document.createElement("input");
  passwordinput.type = "password";
  passwordinput.placeholder = 'Enter your Password';
  passwordinput.id = "passwordinput";
  passwordinput.classList.add("input");

  let submit = document.createElement('button');
  submit.type = "submit";
  submit.id = "submit";
  submit.classList.add("submit-btn");
  submit.textContent = 'Submit';

  loginForm.append(userinput, passwordinput, submit);
  loginDiv.appendChild(loginForm);
  return loginDiv;
}
export function sectiondata(data = {}) {


  let section = document.createElement("section");
  section.classList.add("section-container");

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
  auditValue.textContent = Math.round(data.user.auditRatio *10)/10;

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
  xpValue.textContent = Math.floor(data.xp/1000 )+ "KB";

  xpdiv.append(xpTitle, xpValue);

  // Append all divs to section
  section.append(userDiv, auditDiv, levelDiv,xpdiv);

  return section;
}
export function showMessage(message) {
  const popup = document.createElement("div");
  popup.setAttribute("id", "message_popup");
  popup.innerHTML = `<h2>${message}</h2>`;
  document.body.appendChild(popup);

  // Automatically hide after 3 seconds
  setTimeout(() => {
    popup.remove();
  }, 3000);
}



export function createXpGraph(data) {
    console.log(data.length,"hhh");
    const container = document.createElement('div');
    container.classList.add('xp-graph-container');

    const svgNS = "http://www.w3.org/2000/svg";
    const width = data.length*10;
    const height = 400;
    const margin = { top: 5, right: 5, bottom: 10, left: 10 };

    const svg = document.createElementNS(svgNS, "svg");
    console.log(svg,"what this");
    
    svg.setAttribute("width",width);
    svg.setAttribute("height", height);
    svg.classList.add("xp-graph-svg");

    // this for wheern user hover on rec a tooltip dic shown the information about the sx and date
    const tooltip = document.createElement("div");
    tooltip.classList.add("xp-tooltip");
    console.log(tooltip,"tooltip");
    

    // Process and sort data
    const processedData = data.map(d => ({
        x: new Date(d.createdAt),
        y: d.amount,
        path : d.progress.path,
        original: d
    })).sort((a, b) => a.x - b.x);

    // Find min and max values for scaling
    const xMin = processedData[0].x; // this for calculatinng the first date in x axis
    const xMax = processedData[processedData.length - 1].x; // this for calculating the max date in x axixs
    const yMax = Math.max(...processedData.map(d => d.y));  // this for calculating the max xp in y axixs

    // Create scaling functions
    const scaleX = (x) => {
        const range = xMax.getTime() - xMin.getTime(); // this foe calculating the range for date the with of the x axis 
        return margin.left + ((x.getTime() - xMin.getTime()) / range) * (width - margin.left - margin.right);
    };

    const scaleY = (y) => {
        return height - margin.bottom - (y / yMax) * (height - margin.top - margin.bottom);
    };

    // Draw X-axis
    const xAxisLine = document.createElementNS(svgNS, "line");
    xAxisLine.setAttribute("x1", margin.left);
    xAxisLine.setAttribute("y1", height - margin.bottom);
    xAxisLine.setAttribute("x2", 10*processedData.length ); //- margin.right
    xAxisLine.setAttribute("y2", height - margin.bottom);
    xAxisLine.setAttribute("stroke", "black");
    xAxisLine.setAttribute("id","xline")
    svg.appendChild(xAxisLine);


    // Draw Y-axis
    const yAxisLine = document.createElementNS(svgNS, "line");
    yAxisLine.setAttribute("x1", margin.left);
    yAxisLine.setAttribute("y1", margin.top);
    yAxisLine.setAttribute("x2", margin.left);
    yAxisLine.setAttribute("y2", height - margin.bottom);
    yAxisLine.setAttribute("stroke", "black");

    svg.appendChild(yAxisLine);

    // Create bars
    //  console.log(xAxisLine.x1.baseVal.value);
    //  console.log(svg.getElementById('xline').x2.animVal);
     
    
    const barWidth = 10
    console.log(barWidth,"width bar");
    
    processedData.forEach(point => {
        const rect = document.createElementNS(svgNS, "rect");
        rect.setAttribute("x", scaleX(point.x));
        rect.setAttribute("y", scaleY(point.y));
        rect.setAttribute("width", barWidth);
        rect.setAttribute("height", height - margin.bottom - scaleY(point.y));
        rect.classList.add("xp-bar");

        rect.addEventListener("mouseenter", (e) => {
            tooltip.innerHTML = `
                <div class="tooltip-content">
                    <strong>Date:</strong> ${point.x.toLocaleDateString()}<br>
                    <strong>XP:</strong> ${point.y}<br>
                    <strong>Path</strong><br>
                    <pre>${point.path}</pre>
                </div>
            `;
            tooltip.style.left = `${e.pageX + 10}px`;
            tooltip.style.top = `${e.pageY + 10}px`;
            tooltip.classList.add("visible");
            document.body.appendChild(tooltip);
        });

        rect.addEventListener("mouseleave", () => {
            if (tooltip.parentElement) {
                document.body.removeChild(tooltip);
            }
        });

        svg.appendChild(rect);
    });

    container.appendChild(svg);
    return container;
}
export function createSkillsRadarChart(skillsData) {
    // Aggregate skills by type, taking the max amount
    const skillMax = skillsData.reduce((acc, skill) => {
        const cleanType = skill.type.replace('skill_', '');
        acc[cleanType] = Math.max(acc[cleanType] || 0, skill.amount);
        return acc;
    }, {});

    // Create container and SVG
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
        const textAnchor = angle <= Math.PI/2 || angle > 3*Math.PI/2 ? "start" : "end";
        const baseline = angle < Math.PI ? "after-edge" : "before-edge";
        label.setAttribute("text-anchor", textAnchor);
        label.setAttribute("alignment-baseline", baseline);

        svg.appendChild(label);
    });

    container.appendChild(svg);
    return container;
}

