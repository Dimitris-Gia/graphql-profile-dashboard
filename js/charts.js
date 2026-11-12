
const SVG_NS = "http://www.w3.org/2000/svg";

// Group XP transactions by month
function groupXPByMonth(transactions) {
    const monthlyXP = {};

    transactions.forEach(transaction => {
        const date = new Date(transaction.createdAt);

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");

        const key = `${year}-${month}`;

        if (!monthlyXP[key]) {
            monthlyXP[key] = 0;
        }

        monthlyXP[key] += Number(transaction.amount);
    });

    // Convert the object into an array
    const months = Object.keys(monthlyXP).sort();

    let cumulativeXP = 0;

    return months.map(key => {
        cumulativeXP += monthlyXP[key];

        return {
            month: key,
            monthlyXP: monthlyXP[key],
            totalXP: cumulativeXP
        };
    });
}


// Create an SVG element
function createSVGElement(tag, attributes = {}) {
    const element = document.createElementNS(SVG_NS, tag);

    Object.entries(attributes).forEach(([key, value]) => {
        element.setAttribute(key, value);
    });

    return element;
}


// Draw XP progress chart
export function drawXpProgressChart(transactions) {
    const svg = document.querySelector("#xp-progress-chart");

    if (!svg) {
        console.error("XP progress chart element not found");
        return;
    }

    const data = groupXPByMonth(transactions);

    if (data.length === 0) {
        svg.innerHTML = "<text x='400' y='150'>No XP data available</text>";
        return;
    }

    const width = 800;
    const height = 350;

    const padding = {
        top: 30,
        right: 40,
        bottom: 60,
        left: 80
    };

    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    const maxXP = Math.max(...data.map(item => item.totalXP));

    // Convert XP values into SVG coordinates
    const points = data.map((item, index) => {
        const x = padding.left +
            (index / Math.max(data.length - 1, 1)) * chartWidth;

        const y = padding.top +
            chartHeight -
            (item.totalXP / maxXP) * chartHeight;

        return {
            x,
            y,
            month: item.month,
            totalXP: item.totalXP
        };
    });

    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
    svg.innerHTML = "";

    // Draw horizontal grid lines
    for (let i = 0; i <= 4; i++) {
        const y = padding.top + (chartHeight / 4) * i;

        const line = createSVGElement("line", {
            x1: padding.left,
            y1: y,
            x2: width - padding.right,
            y2: y,
            stroke: "#334155",
            "stroke-width": 1
        });

        svg.appendChild(line);
    }

    // Draw the XP progress line
    const linePoints = points
        .map(point => `${point.x},${point.y}`)
        .join(" ");

    const progressLine = createSVGElement("polyline", {
        points: linePoints,
        fill: "none",
        stroke: "#38bdf8",
        "stroke-width": 3,
        "stroke-linejoin": "round",
        "stroke-linecap": "round"
    });

    svg.appendChild(progressLine);

    // Draw a circle for every month
    points.forEach(point => {
        const circle = createSVGElement("circle", {
            cx: point.x,
            cy: point.y,
            r: 4,
            fill: "#38bdf8"
        });

        svg.appendChild(circle);
    });

    // Draw month labels
    points.forEach(point => {
        const label = createSVGElement("text", {
            x: point.x,
            y: height - 20,
            fill: "#94a3b8",
            "font-size": 12,
            "text-anchor": "middle"
        });

        label.textContent = point.month;

        svg.appendChild(label);
    });

    // Draw XP values on the vertical axis
    for (let i = 0; i <= 4; i++) {
        const value = Math.round(maxXP * (1 - i / 4));

        const y = padding.top + (chartHeight / 4) * i;

        const label = createSVGElement("text", {
            x: padding.left - 10,
            y: y + 4,
            fill: "#94a3b8",
            "font-size": 12,
            "text-anchor": "end"
        });

        label.textContent = value.toLocaleString("en-US");

        svg.appendChild(label);
    }
}



function groupXPByProject(transactions) {
    const projects = {};

    transactions.forEach(transaction => {
        // Ignore transactions that are not projects
        if (transaction.object?.type !== "project") {
            return;
        }

        const projectId = transaction.object.id;

        if (!projects[projectId]) {
            projects[projectId] = {
                id: projectId,
                name: transaction.object.name,
                totalXP: 0
            };
        }

        projects[projectId].totalXP += Number(transaction.amount);
    });

    // Convert the object into an array
    return Object.values(projects)
        .sort((a, b) => b.totalXP - a.totalXP)
        .slice(0, 10);
}


export function drawXpByProjectChart(transactions) {
    const svg = document.querySelector("#xp-project-chart");

    if (!svg) {
        console.error("XP by project chart element not found");
        return;
    }

    const data = groupXPByProject(transactions);

    if (data.length === 0) {
        svg.innerHTML = "<text x='400' y='150'>No project XP data available</text>";
        return;
    }

    const width = 800;
    const rowHeight = 38;
    const height = 40 + data.length * rowHeight;

    const padding = {
        top: 20,
        right: 100,
        bottom: 20,
        left: 220
    };

    const chartWidth = width - padding.left - padding.right;

    const maxXP = Math.max(...data.map(project => project.totalXP));

    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
    svg.innerHTML = "";

    data.forEach((project, index) => {
        const y = padding.top + index * rowHeight;

        // Project name
        const name = createSVGElement("text", {
            x: padding.left - 12,
            y: y + 20,
            fill: "#e2e8f0",
            "font-size": 13,
            "text-anchor": "end"
        });

        name.textContent = project.name;
        svg.appendChild(name);

        // Background bar
        const backgroundBar = createSVGElement("rect", {
            x: padding.left,
            y: y + 5,
            width: chartWidth,
            height: 18,
            rx: 4,
            fill: "#334155"
        });

        svg.appendChild(backgroundBar);

        // XP bar
        const barWidth = (project.totalXP / maxXP) * chartWidth;

        const bar = createSVGElement("rect", {
            x: padding.left,
            y: y + 5,
            width: barWidth,
            height: 18,
            rx: 4,
            fill: "#38bdf8"
        });

        svg.appendChild(bar);

        // XP amount
        const value = createSVGElement("text", {
            x: padding.left + chartWidth + 12,
            y: y + 20,
            fill: "#94a3b8",
            "font-size": 12,
            "text-anchor": "start"
        });

        value.textContent = project.totalXP.toLocaleString("en-US");
        svg.appendChild(value);
    });
}