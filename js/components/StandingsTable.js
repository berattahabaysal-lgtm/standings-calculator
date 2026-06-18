/**
 * Standings table with zone highlighting.
 * Column layout is driven by standingsColumns.js — edit that file to add columns.
 */

import { STANDINGS_COLUMNS, getColumnValue } from "../standingsColumns.js";

/**
 * @typedef {import("../calculateStandings.js").StandingRow} StandingRow
 */

/**
 * Find zone color for a table position.
 * @param {object[]} zones — league.zones from leagues.json
 * @param {number} position
 * @returns {{ color: string, label: string } | null}
 */
function getZoneForPosition(zones, position) {
  if (!zones) return null;
  for (const zone of zones) {
    if (position >= zone.from && position <= zone.to) {
      return { color: zone.color, label: zone.label };
    }
  }
  return null;
}

/**
 * @param {HTMLElement} container
 * @param {StandingRow[]} standings
 * @param {object[]} zones
 */
export function renderStandingsTable(container, standings, zones) {
  container.innerHTML = "";

  const wrapper = document.createElement("div");
  wrapper.className = "table-scroll";

  const table = document.createElement("table");
  table.className = "standings-table";
  table.setAttribute("aria-label", "League standings");

  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");

  for (const col of STANDINGS_COLUMNS) {
    const th = document.createElement("th");
    th.textContent = col.label;
    th.className = col.className || "";
    th.style.textAlign = col.align || "center";
    headerRow.appendChild(th);
  }
  thead.appendChild(headerRow);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");

  for (const row of standings) {
    const tr = document.createElement("tr");
    const zone = getZoneForPosition(zones, row.position);

    if (zone) {
      tr.className = "zone-row";
      tr.style.setProperty("--zone-color", zone.color);
      tr.dataset.zoneLabel = zone.label;
    }

    for (const col of STANDINGS_COLUMNS) {
      const td = document.createElement("td");
      td.className = col.className || "";
      td.style.textAlign = col.align || "center";

      if (col.key === "team") {
        const teamCell = document.createElement("div");
        teamCell.className = "team-cell";

        if (row.logo) {
          const img = document.createElement("img");
          img.src = row.logo;
          img.alt = "";
          img.className = "team-logo";
          teamCell.appendChild(img);
        } else {
          const badge = document.createElement("span");
          badge.className = "team-badge";
          badge.textContent = row.shortCode;
          teamCell.appendChild(badge);
        }

        const name = document.createElement("span");
        name.className = "team-name";
        name.textContent = row.teamName;
        teamCell.appendChild(name);
        td.appendChild(teamCell);
      } else {
        td.textContent = String(getColumnValue(col, row));
      }

      tr.appendChild(td);
    }

    tbody.appendChild(tr);
  }

  table.appendChild(tbody);
  wrapper.appendChild(table);
  container.appendChild(wrapper);

  if (zones && zones.length > 0) {
    const legend = document.createElement("div");
    legend.className = "zone-legend";

    for (const zone of zones) {
      const item = document.createElement("span");
      item.className = "zone-legend-item";

      const swatch = document.createElement("span");
      swatch.className = "zone-swatch";
      swatch.style.backgroundColor = zone.color;

      const text = document.createElement("span");
      text.textContent = zone.label;

      item.appendChild(swatch);
      item.appendChild(text);
      legend.appendChild(item);
    }

    container.appendChild(legend);
  }
}
