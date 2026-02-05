
    // --- Datos (los mismos que en React) ---
    const HISTORIC_DATA = [
      { month: 'Ene', '2021': 45000, '2022': 52000, '2023': 61000 },
      { month: 'Feb', '2021': 42000, '2022': 48000, '2023': 59000 },
      { month: 'Mar', '2021': 48000, '2022': 55000, '2023': 65000 },
      { month: 'Abr', '2021': 51000, '2022': 59000, '2023': 72000 },
      { month: 'May', '2021': 55000, '2022': 62000, '2023': 78000 },
      { month: 'Jun', '2021': 58000, '2022': 67000, '2023': 82000 },
      { month: 'Jul', '2021': 60000, '2022': 71000, '2023': 85000 },
      { month: 'Ago', '2021': 62000, '2022': 75000, '2023': 89000 },
      { month: 'Sep', '2021': 59000, '2022': 73000, '2023': 84000 },
      { month: 'Oct', '2021': 65000, '2022': 78000, '2023': 92000 },
      { month: 'Nov', '2021': 72000, '2022': 85000, '2023': 105000 },
      { month: 'Dic', '2021': 85000, '2022': 98000, '2023': 120000 },
    ];

    const BEST_SELLERS = [
      { id: 1, name: 'Laptop Pro 16"', category: 'Electrónica', sales: 1240, revenue: 1540000, growth: '+12%' },
      { id: 2, name: 'Monitor UltraWide 34"', category: 'Electrónica', sales: 980, revenue: 490000, growth: '+8%' },
      { id: 3, name: 'Silla Ergonómica Premium', category: 'Muebles', sales: 850, revenue: 255000, growth: '+15%' },
      { id: 4, name: 'Auriculares Noise Cancelling', category: 'Accesorios', sales: 1500, revenue: 300000, growth: '-2%' },
      { id: 5, name: 'Escritorio Elevable Eléctrico', category: 'Muebles', sales: 420, revenue: 210000, growth: '+22%' },
    ];

    // “Estado” equivalente a useState
    let activeYear = "2023";

    // KPIs (si quieres que cambien por año, aquí los calculas)
    const statsByYear = {
      "2021": { ventas:"$1,650,000", ganancia:"$1,120,000", costos:"$530,000", neto:"$320,000" },
      "2022": { ventas:"$2,050,000", ganancia:"$1,520,000", costos:"$600,000", neto:"$410,000" },
      "2023": { ventas:"$2,450,000", ganancia:"$1,820,000", costos:"$630,000", neto:"$485,000" },
    };

    // Render Best Sellers
    const bestSellersEl = document.getElementById("bestSellers");
    function renderBestSellers(){
      bestSellersEl.innerHTML = "";
      for(const p of BEST_SELLERS){
        const growthPos = p.growth.startsWith("+");
        const row = document.createElement("div");
        row.className = "row";
        row.innerHTML = `
          <div class="left">
            <div class="avatar">${p.name.charAt(0)}</div>
            <div style="min-width:0">
              <div class="name" title="${p.name}">${p.name}</div>
              <div class="cat">${p.category}</div>
            </div>
          </div>
          <div class="right">
            <div class="rev">$${(p.revenue/1000).toFixed(0)}k</div>
            <div class="growth ${growthPos ? "pos" : "neg"}">${p.growth}</div>
          </div>
        `;
        bestSellersEl.appendChild(row);
      }
    }

    // KPIs
    function renderKPIs(){
      const s = statsByYear[activeYear];
      document.getElementById("kpi-ventas").textContent   = s.ventas;
      document.getElementById("kpi-ganancia").textContent = s.ganancia;
      document.getElementById("kpi-costos").textContent   = s.costos;
      document.getElementById("kpi-neto").textContent     = s.neto;
    }

    // Chart.js
    const labels = HISTORIC_DATA.map(d => d.month);
    const ds2021 = HISTORIC_DATA.map(d => d["2021"]);
    const ds2022 = HISTORIC_DATA.map(d => d["2022"]);
    const ds2023 = HISTORIC_DATA.map(d => d["2023"]);

    const ctx = document.getElementById("salesChart");
    const salesChart = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "2021",
            data: ds2021,
            borderWidth: 2,
            borderColor: "#cbd5e1",
            pointRadius: 0,
            tension: 0.35,
            fill: false
          },
          {
            label: "2022",
            data: ds2022,
            borderWidth: 2,
            borderColor: "#a5b4fc",
            pointRadius: 0,
            tension: 0.35,
            fill: false
          },
          {
            label: "2023",
            data: ds2023,
            borderWidth: 3,
            borderColor: "#4f46e5",
            pointRadius: 0,
            tension: 0.35,
            fill: true,
            backgroundColor: "rgba(79,70,229,0.10)"
          },
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const v = ctx.parsed.y;
                return ` ${ctx.dataset.label}: $${(v/1000).toFixed(0)}k`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: "#94a3b8", font: { size: 12 } },
            border: { display: false }
          },
          y: {
            grid: { color: "#f1f5f9" },
            ticks: {
              color: "#94a3b8",
              font: { size: 12 },
              callback: (v) => `$${(v/1000).toFixed(0)}k`
            },
            border: { display: false }
          }
        }
      }
    });

    // Year toggle behavior
    document.querySelectorAll(".year-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        activeYear = btn.dataset.year;

        document.querySelectorAll(".year-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        // En tu React cambiabas estado; aquí re-renderizas lo necesario:
        renderKPIs();

        // Si quieres que el gráfico resalte el año activo:
        salesChart.data.datasets.forEach(ds => {
          const isActive = ds.label === activeYear;
          ds.borderWidth = isActive ? 3 : 2;
          ds.opacity = isActive ? 1 : 0.35;
        });

        // Truco simple: aplicar opacidad vía script
        // (Chart.js no usa "opacity" directo en dataset, así que tocamos colores)
        salesChart.data.datasets.forEach(ds => {
          const active = ds.label === activeYear;
          const base = ds.label === "2021" ? "#cbd5e1" : ds.label === "2022" ? "#a5b4fc" : "#4f46e5";
          ds.borderColor = active ? base : base + "66"; // agrega alpha (hex) si el navegador lo soporta
          ds.backgroundColor = ds.label === "2023"
            ? (active ? "rgba(79,70,229,0.10)" : "rgba(79,70,229,0.03)")
            : "transparent";
        });

        salesChart.update();
      });
    });

    // Init
    renderBestSellers();
    renderKPIs();
