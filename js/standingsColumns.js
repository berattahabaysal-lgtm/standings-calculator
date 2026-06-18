/**
 * Standings table column configuration.
 * To add or remove a column, edit this array only — no table rewrite needed.
 *
 * Each column:
 *   key     — field on StandingRow (or special keys like "team", "score")
 *   label   — header text
 *   align   — "left" | "center" | "right"
 *   render  — optional (row) => string | number for custom cell content
 *   className — optional extra CSS class on cells
 */

/** @typedef {import("./calculateStandings.js").StandingRow} StandingRow */

export const STANDINGS_COLUMNS = [
  {
    key: "position",
    label: "#",
    align: "center",
    className: "col-position",
  },
  {
    key: "team",
    label: "Team",
    align: "left",
    className: "col-team",
    render: (row) => row.teamName,
  },
  {
    key: "played",
    label: "M",
    align: "center",
    className: "col-numeric",
  },
  {
    key: "won",
    label: "W",
    align: "center",
    className: "col-numeric",
  },
  {
    key: "drawn",
    label: "D",
    align: "center",
    className: "col-numeric",
  },
  {
    key: "lost",
    label: "L",
    align: "center",
    className: "col-numeric",
  },
  {
    key: "score",
    label: "Score",
    align: "center",
    className: "col-numeric",
    render: (row) => `${row.goalsFor}:${row.goalsAgainst}`,
  },
  {
    key: "goalDifference",
    label: "Diff",
    align: "center",
    className: "col-numeric",
    render: (row) =>
      row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference,
  },
  {
    key: "points",
    label: "Pts",
    align: "center",
    className: "col-points",
  },
];

/**
 * Example: add a "Form" column later — uncomment and adjust:
 *
 * {
 *   key: "form",
 *   label: "Form",
 *   align: "center",
 *   render: (row) => row.form ?? "—",
 * },
 */

/**
 * Get cell value for a column config and standing row.
 * @param {object} column
 * @param {StandingRow} row
 */
export function getColumnValue(column, row) {
  if (column.render) return column.render(row);
  if (column.key === "team") return row.teamName;
  return row[column.key];
}
