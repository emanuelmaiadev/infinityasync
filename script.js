document.addEventListener('DOMContentLoaded', () => {
    const breedButtons = document.getElementById('breed-buttons');
    const loading = document.getElementById('loading');
    const errorMessage = document.getElementById('error-message');

    async function fetchBreeds() {
        try {
            const response = await fetch('https://dog.ceo/api/breeds/list/all');
            if (!response.ok) {
                throw new Error('Erro ao buscar a lista de raças.');
            }
            const data = await response.json();
            return Object.keys(data.message);
        } catch (error) {
            errorMessage.textContent = error.message;
            throw error;
        }
    }

    async function fetchBreedImage(breed) {
        try {
            const response = await fetch(`https://dog.ceo/api/breed/${breed}/images/random`);
            if (!response.ok) {
                throw new Error(`Erro ao buscar imagem para a raça ${breed}.`);
            }
            const data = await response.json();
            return data.message;
        } catch (error) {
            errorMessage.textContent = error.message;
            throw error;
        }
    }

    async function loadBreeds() {
        loading.style.display = 'block';
        try {
            const breeds = await fetchBreeds();
            const breedData = await Promise.all(breeds.map(async (breed) => {
                const imageUrl = await fetchBreedImage(breed);
                return { breed, imageUrl };
            }));
            
            breedData.forEach(({ breed, imageUrl }) => {
                const card = document.createElement('a');
                card.href = `details.html?breed=${breed}`;
                card.className = 'card';

                const img = document.createElement('img');
                img.src = imageUrl;
                img.alt = `Imagem de ${breed}`;

                const cardBody = document.createElement('div');
                cardBody.className = 'card-body';
                const h3 = document.createElement('h3');
                h3.textContent = breed.charAt(0).toUpperCase() + breed.slice(1);

                cardBody.appendChild(h3);
                card.appendChild(img);
                card.appendChild(cardBody);
                breedButtons.appendChild(card);
            });
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
        } finally {
            loading.style.display = 'none';
        }
    }

    loadBreeds();
});
