document.addEventListener("DOMContentLoaded", async () => {
  // Matrix Effect
  const matrixBorder = document.querySelector(".matrix-border");
  const words = ["サイバーパンク", "愛", "コンピューター", "ライフ", "データ", "ネットワーク", "システム", "コード", "ハッカー", "仮想現実"];
  const columns = Math.floor(window.innerWidth / 30);
  let drops = Array(columns).fill(0);

  const canvas = document.createElement("canvas");
  const dpi = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * dpi;
  canvas.height = window.innerHeight * dpi;
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  matrixBorder.appendChild(canvas);

  const context = canvas.getContext("2d");
  context.scale(dpi, dpi);
  context.font = "24px 'Courier New', monospace";
  context.fillStyle = "#00FF00";

  let fallSpeed = 25;

  function updateMatrix() {
    context.fillStyle = "rgba(0, 0, 0, 0.1)";
    context.fillRect(0, 0, canvas.width / dpi, canvas.height / dpi);

    for (let i = 0; i < drops.length; i++) {
      const word = words[Math.floor(Math.random() * words.length)];
      const letter = word.charAt(Math.floor(Math.random() * word.length));
      const x = i * 30;
      const y = drops[i] * 30;

      context.fillStyle = "#00FF00";
      context.fillText(letter, x, y);

      if (y > window.innerHeight && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
    setTimeout(() => requestAnimationFrame(updateMatrix), fallSpeed);
  }
  updateMatrix();

  // GitHub Project List
  const projectsContainer = document.getElementById("projects-container");
  const githubUsername = "Aur3ns";

  const loader = document.createElement("p");
  loader.textContent = "Chargement des projets...";
  loader.style.color = "var(--yellow)";
  loader.style.textAlign = "center";
  projectsContainer.appendChild(loader);

  async function fetchProjects() {
    try {
      const response = await fetch(`https://api.github.com/users/${githubUsername}/repos`);
      if (!response.ok) throw new Error("Erreur lors de la récupération des projets.");
      return await response.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  function createProjectCard(project) {
    const card = document.createElement("div");
    card.className = "project-card";

    const shortDescription = project.description
      ? project.description.substring(0, 100) + (project.description.length > 100 ? "..." : "")
      : "Pas de description disponible.";

    card.innerHTML = `
      <h2>${project.name}</h2>
      <p>${shortDescription}</p>
      <a href="${project.html_url}" target="_blank" class="project-link">Voir le projet</a>
    `;

    projectsContainer.appendChild(card);
  }

  const projects = await fetchProjects();
  loader.remove(); // Supprimer le message de chargement une fois les projets récupérés

  if (projects.length === 0) {
    const noProjectMsg = document.createElement("p");
    noProjectMsg.textContent = "Aucun projet trouvé.";
    noProjectMsg.style.color = "var(--yellow)";
    noProjectMsg.style.textAlign = "center";
    projectsContainer.appendChild(noProjectMsg);
  } else {
    projects.forEach(createProjectCard);
  }

  // Masquer le chemin dans la barre d'adresse
  const hidePath = () => {
    const currentUrl = window.location.href;
    const baseUrl = currentUrl.split("/").slice(0, 3).join("/"); // Conserver seulement le domaine
    window.history.replaceState(null, null, baseUrl);
  };

  hidePath();
});
