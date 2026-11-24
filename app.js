// Data katalog CV Segar Jaya Distribusi (representasi proyek Odoo 19)
const PRODUCTS = [
  {
    sku: "SU1L",
    name: "Susu UHT 1 Liter",
    category: "Susu & Dairy",
    isOdooCore: true,
    unit: "Unit / Karton 1L",
    tracking: "Lot/Batch + Expiry (FEFO)",
    stockLabel: "450 unit layak (3 batch aktif)",
    shelfLife: "Terpantau per tanggal kedaluwarsa",
    description:
      "Produk utama pada skenario simulasi Odoo 19 untuk pengujian reservasi multi-batch, pengeluaran FEFO, pembaruan saldo lot, dan traceability.",
    batches: [
      { lot: "B-EXP", qty: 50, expiry: "2026-10-15", expired: true },
      { lot: "B001", qty: 100, expiry: "2026-11-10", expired: false },
      { lot: "B002", qty: 150, expiry: "2026-11-30", expired: false },
      { lot: "B003", qty: 200, expiry: "2026-12-20", expired: false },
    ],
  },
  {
    sku: "YD250",
    name: "Yogurt Drink 250 ml (Pack 12)",
    category: "Susu & Dairy",
    isOdooCore: false,
    unit: "Pack",
    tracking: "Lot/Batch + Expiry (FEFO)",
    stockLabel: "Contoh katalog distribusi",
    shelfLife: "Umur simpan pendek — prioritas rotasi ketat",
    description:
      "Contoh lini produk olahan susu cepat rusak yang membutuhkan pemantauan alert kedaluwarsa dan pengeluaran berbasis FEFO.",
  },
  {
    sku: "JB1L",
    name: "Jus Buah Kemasan 1 Liter",
    category: "Minuman",
    isOdooCore: false,
    unit: "Karton",
    tracking: "Lot/Batch + Expiry (FEFO)",
    stockLabel: "Contoh katalog distribusi",
    shelfLife: "Terpantau per batch produksi",
    description:
      "Contoh produk minuman kemasan untuk segmen minimarket dan toko ritel dengan pencatatan batch di modul Inventory.",
  },
  {
    sku: "AM600",
    name: "Air Mineral 600 ml (Dus 24)",
    category: "Minuman",
    isOdooCore: false,
    unit: "Dus",
    tracking: "Lot/Batch",
    stockLabel: "Contoh katalog distribusi",
    shelfLife: "Rotasi cepat — stok volume besar",
    description:
      "Contoh produk fast-moving harian untuk ilustrasi pengelolaan pesanan penjualan dan pengiriman gudang.",
  },
  {
    sku: "BK24",
    name: "Biskuit Kemasan Ritel (Karton)",
    category: "Makanan Ringan",
    isOdooCore: false,
    unit: "Karton",
    tracking: "Lot/Batch + Expiry",
    stockLabel: "Contoh katalog distribusi",
    shelfLife: "Tanggal kedaluwarsa per lot pemasok",
    description:
      "Contoh lini makanan ringan distributor yang mendukung penelusuran nomor batch dari penerimaan hingga pengiriman.",
  },
  {
    sku: "SK12",
    name: "Saus & Bumbu Kemasan (Karton)",
    category: "Bahan Pangan",
    isOdooCore: false,
    unit: "Karton",
    tracking: "Lot/Batch + Expiry",
    stockLabel: "Contoh katalog distribusi",
    shelfLife: "Pencatatan removal date & traceability",
    description:
      "Contoh produk bahan pangan kemasan untuk melengkapi gambaran portofolio distribusi makanan dan minuman.",
  },
];

// Dataset simulasi ilustratif FEFO (tanggal acuan simulasi: 1 November 2026)
const SIM_REFERENCE_DATE = "1 November 2026";
const SIM_LOTS = [
  { lot: "B-EXP", initialQty: 50, expiry: "15 Okt 2026", sortDate: "2026-10-15", isExpired: true },
  { lot: "B001", initialQty: 100, expiry: "10 Nov 2026", sortDate: "2026-11-10", isExpired: false },
  { lot: "B002", initialQty: 150, expiry: "30 Nov 2026", sortDate: "2026-11-30", isExpired: false },
  { lot: "B003", initialQty: 200, expiry: "20 Des 2026", sortDate: "2026-12-20", isExpired: false },
];

let activeFilter = "all";

function renderCatalog() {
  const grid = document.getElementById("catalog-grid");
  if (!grid) return;

  const filtered = PRODUCTS.filter((item) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "odoo-core") return item.isOdooCore;
    return item.category === activeFilter;
  });

  grid.innerHTML = filtered
    .map((item) => {
      const badgeHtml = item.isOdooCore
        ? `<span class="badge badge-odoo">Produk Uji Odoo 19</span>`
        : `<span class="badge badge-brand">${item.category}</span>`;

      return `
        <article class="product-card ${item.isOdooCore ? "featured" : ""}">
          <div>
            <div class="product-top">
              ${badgeHtml}
              <span class="sku-tag">${item.sku}</span>
            </div>
            <h3 style="margin: 12px 0 6px; font-size: 17px;">${item.name}</h3>
            <p style="margin: 0 0 14px; font-size: 13.5px; color: var(--text-muted);">${item.description}</p>
            <div class="product-meta">
              <div>
                <span>Pelacakan</span>
                <strong>${item.tracking}</strong>
              </div>
              <div>
                <span>Status Katalog</span>
                <strong>${item.stockLabel}</strong>
              </div>
            </div>
          </div>
          <div class="product-foot">
            <span style="font-size: 12px; color: var(--text-muted);">${item.unit}</span>
            <button class="btn btn-secondary btn-sm" type="button" data-sku="${item.sku}">
              Lihat Detail
            </button>
          </div>
        </article>
      `;
    })
    .join("");

  grid.querySelectorAll("button[data-sku]").forEach((btn) => {
    btn.addEventListener("click", () => openProductModal(btn.getAttribute("data-sku")));
  });
}

function setupFilters() {
  const buttons = document.querySelectorAll(".filter-btn");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      activeFilter = btn.getAttribute("data-filter");
      renderCatalog();
    });
  });
}

function openProductModal(sku) {
  const item = PRODUCTS.find((p) => p.sku === sku);
  if (!item) return;

  const backdrop = document.getElementById("product-modal");
  const title = document.getElementById("modal-title");
  const body = document.getElementById("modal-body");
  const actionBtn = document.getElementById("modal-sim-btn");

  title.textContent = `${item.name} (${item.sku})`;

  let batchesHtml = "";
  if (item.batches) {
    batchesHtml = `
      <div style="margin-top: 14px;">
        <strong style="font-size: 13px;">Struktur Lot Simulasi (Acuan ${SIM_REFERENCE_DATE}):</strong>
        <table class="sim-table" style="margin-top: 8px;">
          <thead>
            <tr><th>Lot</th><th>Stok Awal</th><th>Expiry</th><th>Status</th></tr>
          </thead>
          <tbody>
            ${item.batches
              .map(
                (b) => `
              <tr>
                <td class="mono"><strong>${b.lot}</strong></td>
                <td>${b.qty} unit</td>
                <td>${b.expiry}</td>
                <td>${
                  b.expired
                    ? '<span class="badge badge-danger">Kedaluwarsa</span>'
                    : '<span class="badge badge-success">Aktif</span>'
                }</td>
              </tr>`
              )
              .join("")}
          </tbody>
        </table>
      </div>
    `;
  }

  body.innerHTML = `
    <p style="margin-top: 0; color: var(--text-muted);">${item.description}</p>
    <div class="product-meta" style="margin-top: 12px;">
      <div><span>Kategori</span><strong>${item.category}</strong></div>
      <div><span>Satuan</span><strong>${item.unit}</strong></div>
      <div><span>Kebijakan Tracking</span><strong>${item.tracking}</strong></div>
      <div><span>Catatan Umur Simpan</span><strong>${item.shelfLife}</strong></div>
    </div>
    ${batchesHtml}
    <p style="margin: 14px 0 0; font-size: 12.5px; color: var(--text-muted);">
      Catatan: Informasi ini merupakan representasi katalog untuk proyek simulasi ERP Odoo 19, bukan toko transaksi aktif.
    </p>
  `;

  if (item.isOdooCore) {
    actionBtn.style.display = "inline-flex";
    actionBtn.onclick = () => {
      closeModal();
      document.getElementById("simulasi")?.scrollIntoView({ behavior: "smooth" });
    };
  } else {
    actionBtn.style.display = "none";
  }

  backdrop.classList.add("open");
  backdrop.setAttribute("aria-hidden", "false");
}

function closeModal() {
  const backdrop = document.getElementById("product-modal");
  backdrop.classList.remove("open");
  backdrop.setAttribute("aria-hidden", "true");
}

function runFefoSimulation() {
  const qtyInput = document.getElementById("sim-qty");
  const excludeExpiredCheckbox = document.getElementById("sim-exclude-expired");
  const alertEl = document.getElementById("sim-alert");
  const tbody = document.getElementById("sim-tbody");
  const summaryEl = document.getElementById("sim-summary");

  const requested = parseInt(qtyInput.value, 10);
  const excludeExpired = excludeExpiredCheckbox.checked;

  if (Number.isNaN(requested) || requested <= 0) {
    alertEl.className = "sim-alert err";
    alertEl.textContent = "Masukkan jumlah pesanan lebih dari 0 unit untuk melihat simulasi alokasi batch.";
    tbody.innerHTML = "";
    summaryEl.textContent = "";
    return;
  }

  // Urutkan berdasarkan tanggal expiry terdekat (FEFO)
  const sorted = [...SIM_LOTS].sort((a, b) => a.sortDate.localeCompare(b.sortDate));

  let remainingToAllocate = requested;
  let totalAllocated = 0;
  let expiredPicked = false;

  const rows = sorted.map((lot) => {
    let allocated = 0;
    let statusBadge = "";

    if (lot.isExpired && excludeExpired) {
      statusBadge = '<span class="badge badge-danger">Dilewati (Expired)</span>';
    } else {
      if (remainingToAllocate > 0) {
        allocated = Math.min(lot.initialQty, remainingToAllocate);
        remainingToAllocate -= allocated;
        totalAllocated += allocated;
        if (lot.isExpired && allocated > 0) {
          expiredPicked = true;
        }
      }

      if (lot.isExpired) {
        statusBadge =
          allocated > 0
            ? '<span class="badge badge-danger">Teralokasi (Berisiko Expired)</span>'
            : '<span class="badge badge-danger">Kedaluwarsa</span>';
      } else if (allocated === lot.initialQty) {
        statusBadge = '<span class="badge badge-odoo">Habis Teralokasi</span>';
      } else if (allocated > 0) {
        statusBadge = '<span class="badge badge-brand">Teralokasi Sebagian</span>';
      } else {
        statusBadge = '<span class="badge badge-success">Cadangan Aktif</span>';
      }
    }

    const endingQty = lot.initialQty - allocated;

    return {
      ...lot,
      allocated,
      endingQty,
      statusBadge,
    };
  });

  if (expiredPicked) {
    alertEl.className = "sim-alert warn";
    alertEl.innerHTML =
      "<strong>Perhatian:</strong> Opsi pengecualian lot kedaluwarsa dimatikan. Urutan FEFO saja akan mengambil lot <code>B-EXP</code> terlebih dahulu — ini menunjukkan pentingnya memisahkan pengujian urutan FEFO dengan kontrol blokir barang kedaluwarsa.";
  } else if (remainingToAllocate > 0) {
    alertEl.className = "sim-alert err";
    alertEl.innerHTML = `<strong>Stok layak tidak mencukupi:</strong> Pesanan ${requested} unit melebihi stok layak tersedia (${totalAllocated} unit). Kekurangan <strong>${remainingToAllocate} unit</strong> — pada Odoo 19 pengiriman tidak boleh mengeluarkan melebihi stok fisik.`;
  } else {
    const usedText = rows
      .filter((r) => r.allocated > 0)
      .map((r) => `${r.lot}: ${r.allocated} unit`)
      .join(" + ");
    alertEl.className = "sim-alert ok";
    alertEl.innerHTML = `<strong>Alokasi FEFO tersimulasi:</strong> Pesanan <strong>${requested} unit</strong> terpenuhi dari <strong>${usedText}</strong> (lot kedaluwarsa <code>B-EXP</code> dieksklusi).`;
  }

  tbody.innerHTML = rows
    .map(
      (r) => `
      <tr>
        <td class="mono"><strong>${r.lot}</strong></td>
        <td>${r.expiry}</td>
        <td>${r.initialQty}</td>
        <td><strong>${r.allocated}</strong></td>
        <td>${r.endingQty}</td>
        <td>${r.statusBadge}</td>
      </tr>
    `
    )
    .join("");

  const totalRemainingGood = rows
    .filter((r) => !r.isExpired)
    .reduce((acc, r) => acc + r.endingQty, 0);

  summaryEl.textContent = `Total teralokasi: ${totalAllocated} unit • Sisa stok aktif (non-expired): ${totalRemainingGood} unit • Tanggal acuan simulasi: ${SIM_REFERENCE_DATE}.`;
}

function setupSimulator() {
  const form = document.getElementById("sim-form");
  const excludeCheckbox = document.getElementById("sim-exclude-expired");
  const presets = document.querySelectorAll("[data-preset]");

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      runFefoSimulation();
    });
  }

  if (excludeCheckbox) {
    excludeCheckbox.addEventListener("change", runFefoSimulation);
  }

  presets.forEach((btn) => {
    btn.addEventListener("click", () => {
      const val = btn.getAttribute("data-preset");
      const qtyInput = document.getElementById("sim-qty");
      qtyInput.value = val;
      runFefoSimulation();
    });
  });

  runFefoSimulation();
}

function setupNavAndModal() {
  const toggle = document.getElementById("nav-toggle");
  const links = document.getElementById("nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", () => {
      links.classList.toggle("open");
    });
    links.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => links.classList.remove("open"));
    });
  }

  const backdrop = document.getElementById("product-modal");
  const closeBtns = document.querySelectorAll("[data-close-modal]");
  closeBtns.forEach((b) => b.addEventListener("click", closeModal));

  if (backdrop) {
    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) closeModal();
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderCatalog();
  setupFilters();
  setupSimulator();
  setupNavAndModal();
});
