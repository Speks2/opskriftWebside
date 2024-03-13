document.addEventListener('DOMContentLoaded', () => {
    const recipesContainer = document.getElementById('recipes-container');
    const searchInput = document.getElementById('search-input');
    const searchButton = document.querySelector('button');

    // Hent opskrifter fra API'en ved siden af søgefunktionen
    function fetchRecipes(searchTerm) {
        const apiUrl = searchTerm
            ? `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`
            : 'https://www.themealdb.com/api/json/v1/1/search.php?f=c';

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                const recipes = data.meals;
                if (recipes) {
                    recipesContainer.innerHTML = '';
                    recipes.forEach(recipe => {
                        const recipeCard = createRecipeCard(recipe);
                        recipesContainer.appendChild(recipeCard);
                    });
                } else {
                    recipesContainer.innerHTML = '<p>No recipes found</p>';
                }
            })
            .catch(error => {
                console.error('Error fetching recipes:', error);
            });
    }

    // Hent opskriftsinfo fra API'en ved hjælp af opskriftens ID
    function fetchRecipeDetails(recipeId) {
        const apiUrl = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipeId}`;

        return fetch(apiUrl)
            .then(response => response.json())
            .then(data => data.meals[0])
            .catch(error => {
                console.error('Error fetching recipe details:', error);
            });
    }

    // Søg opskrifter ved at kalde fetchRecipes med søgetermen
    function searchRecipes() {
        const searchTerm = searchInput.value.trim();
        fetchRecipes(searchTerm);
    }

    // Funktion til at oprette en opskriftskort HTML-element
    function createRecipeCard(recipe) {
        const card = document.createElement('div');
        card.classList.add('recipe-card');

        const image = document.createElement('img');
        image.src = recipe.strMealThumb;
        image.alt = recipe.strMeal;

        const title = document.createElement('h2');
        title.textContent = recipe.strMeal;

        // Tilføj klikhåndtering til at vise opskriftsdetaljer
        card.addEventListener('click', async () => {
            const details = await fetchRecipeDetails(recipe.idMeal);
            displayRecipeDetails(details);
        });

        card.appendChild(image);
        card.appendChild(title);

        return card;
    }

    // Funktion til at vise opskriftsdetaljer
    function displayRecipeDetails(recipe) {
        if (recipe) {
            alert(`Recipe Details:\nName: ${recipe.strMeal}\nCategory: ${recipe.strCategory}\nArea: ${recipe.strArea}\nInstructions: ${recipe.strInstructions}`);
        } else {
            alert('Recipe details not available.');
        }
    }

    // Tilføj event listener til søgeknappen
    searchButton.addEventListener('click', searchRecipes);

    // Initial visning af opskrifter uden søgning
    fetchRecipes();
});
