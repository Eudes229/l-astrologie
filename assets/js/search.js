// Fichier : assets/js/search.js

document.addEventListener('DOMContentLoaded', async () => {
    
    // =====================================================================
    //  ACTION REQUISE : LISTEZ ICI TOUTES LES PAGES DE VOTRE SITE
    // =====================================================================
    const pagesToIndex = [
        { url: 'index.html', title: 'Accueil' },
        { url: 'about.html', title: 'À Propos de Nous' },
        { url: 'service.html', title: 'Nos Services' },
        { url: 'retour-affectif.html', title: 'Rituel de Retour Affectif' },
        { url: 'blog.html', title: 'Blog Spirituel' },
        { url: 'blog_detail.html', title: 'Article de Blog' },
        { url: 'shop.html', title: 'Boutique Spirituelle' },
        { url: 'contact.html', title: 'Contactez-Nous' },
        { url: 'appointment.html', title: 'Prendre Rendez-vous' },
        { url: 'privacy_policy.html', title: 'Politique de Confidentialité'},
        { url: 'faq.html', title: 'Foire Aux Questions'}
        // Ajoutez vos autres pages ici en suivant le même format
        // { url: 'nom-du-fichier.html', title: 'Titre de la Page' },
    ];
    // =====================================================================

    let searchIndex = [];

    async function createSearchIndex() {
        const cachedIndex = sessionStorage.getItem('searchIndex');
        if (cachedIndex) {
            searchIndex = JSON.parse(cachedIndex);
            return;
        }

        for (const page of pagesToIndex) {
            try {
                const response = await fetch(page.url);
                if (!response.ok) continue; // Ignore les pages qui n'existent pas
                const html = await response.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const content = doc.body.innerText.replace(/\s\s+/g, ' ').trim();
                
                searchIndex.push({
                    url: page.url,
                    title: doc.querySelector('title') ? doc.querySelector('title').innerText : page.title,
                    content: content.toLowerCase()
                });
            } catch (error) {
                console.error(`Impossible de charger ${page.url} pour l'indexation.`, error);
            }
        }
        sessionStorage.setItem('searchIndex', JSON.stringify(searchIndex));
    }

    function performSearch(query) {
        const resultsContainer = document.getElementById('search-results-container');
        const queryTitle = document.getElementById('search-query-title');
        
        if (!resultsContainer || !queryTitle) return;

        const lowerCaseQuery = query.toLowerCase();
        queryTitle.textContent = `Résultats pour : "${query}"`;

        const results = searchIndex.filter(page => {
            return page.title.toLowerCase().includes(lowerCaseQuery) || page.content.includes(lowerCaseQuery);
        });

        resultsContainer.innerHTML = '';

        if (results.length > 0) {
            results.forEach(result => {
                const resultElement = document.createElement('div');
                resultElement.className = 'as_search_result_item as_padderBottom30';
                // Affichage du résultat avec un extrait du contenu
                let excerpt = '';
                const matchIndex = result.content.indexOf(lowerCaseQuery);
                if (matchIndex > -1) {
                    const startIndex = Math.max(0, matchIndex - 80);
                    const endIndex = Math.min(result.content.length, matchIndex + 80);
                    excerpt = `...${result.content.substring(startIndex, endIndex)}...`;
                }

                resultElement.innerHTML = `
                    <h4 class="as_subheading"><a href="${result.url}">${result.title}</a></h4>
                    <p class="as_font14">${excerpt}</p>
                    <a href="${result.url}" class="as_link">Lire la suite</a>
                `;
                resultsContainer.appendChild(resultElement);
            });
        } else {
            resultsContainer.innerHTML = '<p class="text-center">Aucun résultat trouvé pour votre recherche.</p>';
        }
    }

    if (document.getElementById('search-results-container')) {
        await createSearchIndex();
        const urlParams = new URLSearchParams(window.location.search);
        const query = urlParams.get('q');
        if (query) {
            performSearch(query);
        } else {
             document.getElementById('search-results-container').innerHTML = '<p class="text-center">Veuillez entrer un terme à rechercher.</p>';
        }
    }
});