/**
 * League selector — navbar'da yan yana kare butonlar olarak gösterir.
 */

const LEAGUE_LOGOS = {
  "premier-league": "./images/20181111091350!PremierLeagueYeniLogo.png",
  "super-lig": "./images/Trendyol-super-lig-dikey-logo.png",
  "la-liga": "./images/LL_RGB_h_color.png",
  "serie-a": "./images/Italian-Serie-A-Logo-500x281.png",
  "bundesliga": "./images/Bundesliga_2017_logo.png",
  "ligue-1": "./images/ligue_1-logo_brandlogos.net_ggpdc.png",
};
/**
 * @param {HTMLElement} container
 * @param {object[]} leagues
 * @param {string} selectedId
 * @param {(leagueId: string) => void} onSelect
 */
export function mountLeagueSelector(container, leagues, selectedId, onSelect) {
  container.innerHTML = "";

  for (const league of leagues) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "league-btn" + (league.id === selectedId ? " active" : "");
    btn.title = `${league.name} (${league.country})`;

    const logoUrl = LEAGUE_LOGOS[league.id];

    if (logoUrl) {
      const img = document.createElement("img");
      img.src = logoUrl;
      img.alt = league.name;
      img.onerror = () => {
        btn.removeChild(img);
        btn.textContent = league.name.slice(0, 3).toUpperCase();
      };
      btn.appendChild(img);
    } else {
      btn.textContent = league.name.slice(0, 3).toUpperCase();
    }

    btn.addEventListener("click", () => onSelect(league.id));
    container.appendChild(btn);
  }
}