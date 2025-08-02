document.addEventListener("DOMContentLoaded", async function () {
    const pages = [
        { url: 'index.html', title: 'Accueil - Astrologie Spirituelle', keywords: 'astrologie, guidance, tarot, horoscope' },
        { url: 'about.html', title: 'À Propos de Nous', keywords: 'équipe, mission, astrologue, expert' },
        { url: 'service.html', title: 'Nos Services de Voyance', keywords: 'consultation, rituel, tarot, chiromancie' },
        { url: 'retour-affectif.html', title: 'Rituel de Retour Affectif', keywords: 'amour, faire revenir son ex, couple, magie blanche' },
        { url: 'rituels_chance_detail.html', title: 'Rituels de Chance et Déblocage', keywords: 'argent, chance, abondance, prospérité, déblocage' },
        { url: 'lecture_tarot_detail.html', title: 'Tirage de Tarot en Ligne', keywords: 'cartes, cartomancie, avenir, amour, travail' },
        { url: 'chiromancie.html', title: 'Chiromancie - Lire les Lignes de la Main', keywords: 'main, ligne de vie, ligne de coeur, destinée' },
        { url: 'geomancie.html', title: 'Géomancie Africaine (Le Fâ)', keywords: 'fâ, ifa, divination, destin, bokonon' },
        { url: 'boule_de_cristal_detail.html', title: 'Voyance par Boule de Cristal', keywords: 'cristallomancie, voyant, visions, avenir' },
        { url: 'numérologie.html', title: 'Numérologie - Calcul du Chemin de Vie', keywords: 'nombres, chemin de vie, date de naissance, signification' },
        { url: 'jours_naissance.html', title: 'Signification des Jours de Naissance', keywords: 'lundi, mardi, mercredi, jeudi, vendredi, samedi, dimanche' },
        { url: 'horoscope_journalier.html', title: 'Horoscope du Jour Gratuit', keywords: 'bélier, taureau, gémeaux, cancer, lion, vierge, balance, scorpion, sagittaire, capricorne, verseau, poissons' },
        { url: 'blog.html', title: 'Notre Blog Spirituel', keywords: 'articles, guide, apprendre, spiritualité' },
        { url: 'shop.html', title: 'Boutique Ésotérique', keywords: 'acheter, sauge, encens, pierres, amulettes' },
        { url: 'contact.html', title: 'Nous Contacter', keywords: 'téléphone, email, adresse, contact' }
    ];

    const params = new URLSearchParams(window.location.search);
    const query = params.get('q')?.toLowerCase().trim();

    const titleElement = document.getElementById('search-query-title');
    const resultsContainer = document.getElementById('search-results-container');

    if (titleElement) {
        titleElement.innerHTML = `Résultats de recherche pour "<span class="as_orange">${query || ''}</span>"`;
    }

    if (!query) {
        resultsContainer.innerHTML = '<p class="text-center">Veuillez entrer un terme à rechercher.</p>';
        return;
    }

    let foundResults = [];

    // On utilise Promise.all pour charger toutes les pages en parallèle
    await Promise.all(pages.map(async (page) => {
        try {
            const response = await fetch(page.url);
            if (!response.ok) return;
            const text = await response.text();
            
            // On recherche dans le titre, les mots-clés et le contenu de la page
            const pageContent = text.toLowerCase();
            const titleMatch = page.title.toLowerCase().includes(query);
            const keywordMatch = page.keywords.toLowerCase().includes(query);
            const contentMatch = pageContent.includes(query);

            if (titleMatch || keywordMatch || contentMatch) {
                // Extrait un petit bout de texte autour du mot trouvé
                let snippet = '';
                const index = pageContent.indexOf(query);
                if (index > -1) {
                    const start = Math.max(0, index - 50);
                    const end = Math.min(pageContent.length, index + 150);
                    snippet = '...' + pageContent.substring(start, end).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ') + '...';
                }

                foundResults.push({
                    url: page.url,
                    title: page.title,
                    snippet: snippet
                });
            }
        } catch (error) {
            console.error(`Erreur lors du chargement de la page ${page.url}:`, error);
        }
    }));

    if (foundResults.length > 0) {
        let html = `<h4>${foundResults.length} résultat(s) trouvé(s) :</h4>`;
        html += '<ul class="as_search_list">';
        foundResults.forEach(result => {
            html += `
                <li>
                    <h3 class="as_subheading"><a href="${result.url}">${result.title}</a></h3>
                    <p>${result.snippet || 'Aucun extrait disponible.'}</p>
                </li>
            `;
        });
        html += '</ul>';
        resultsContainer.innerHTML = html;
    } else {
        resultsContainer.innerHTML = '<p class="text-center">Aucun résultat trouvé pour votre recherche. Essayez avec d\'autres mots-clés ou <a href="contact.html">contactez-nous</a> si vous ne trouvez pas ce que vous cherchez.</p>';
    }
});