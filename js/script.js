// Constantes
const CIDADES = [
    "São Paulo (GRU)", "Rio de Janeiro (GIG)", "Salvador (SSA)",
    "Fortaleza (FOR)", "Belo Horizonte (CNF)", "Recife (REC)",
    "Porto Alegre (POA)", "Florianópolis (FLN)", "Curitiba (CWB)",
    "Brasília (BSB)", "Natal (NAT)", "Maceió (MCZ)", "Manaus (MAO)"
];

// Elementos DOM
const headerEl = document.querySelector('.header');
const mainSearchInput = document.getElementById('mainSearch');
const expandedPanel = document.getElementById('expandedPanel');
const initialSuggestions = document.getElementById('initialSuggestions');
const tabsContainer = document.getElementById('tabs-container');

// Event Listeners
document.addEventListener('DOMContentLoaded', initApp);
window.addEventListener('scroll', handleScroll);
document.addEventListener('click', handleOutsideClick);

// Funções principais
function initApp() {
    // Foca no campo de busca ao carregar
    mainSearchInput.focus();
    
    // Configura eventos dos botões de viagem
    document.querySelectorAll('.trip-option').forEach(option => {
        option.addEventListener('click', function() {
            setActiveOption(this, '.trip-option');
        });
    });
}

function handleScroll() {
    if (window.scrollY > 200) {
        headerEl.classList.add('header-scrolled');
    } else if (window.scrollY <= 90) {
        headerEl.classList.remove('header-scrolled');
    }
}

function handleOutsideClick(e) {
    // Fecha sugestões ao clicar fora
    if (!e.target.classList.contains('input-field') && !e.target.classList.contains('search-input')) {
        document.querySelectorAll('.suggestions').forEach(box => {
            box.style.display = 'none';
        });
    }
    
    // Fecha o painel se clicar fora
    if (!e.target.closest('.search-container')) {
        if (mainSearchInput.value.length === 0) {
            closeSearchPanel();
        }
    }
}

// Funções de busca
function handleMainSearch() {
    const searchText = mainSearchInput.value.trim();
    
    if (searchText.length > 0) {
        expandSearchPanel();
        initialSuggestions.style.display = 'none';
        tabsContainer.style.display = 'block';
        
        // Foca no campo relevante baseado no texto
        if (searchText.toLowerCase().includes('passagem') || 
            searchText.toLowerCase().includes('voar') ||
            searchText.toLowerCase().includes('avião')) {
            document.getElementById('destinoInput').focus();
        }
    } else {
        initialSuggestions.style.display = 'block';
        tabsContainer.style.display = 'none';
    }
}

function expandSearchPanel() {
    document.body.classList.add('search-expanded');
    expandedPanel.style.display = 'block';
    
    if (window.innerWidth < 992) {
        createOverlay();
    }
}

function closeSearchPanel() {
    document.body.classList.remove('search-expanded');
    expandedPanel.style.display = 'none';
    removeOverlay();
}

function createOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'search-overlay';
    overlay.onclick = closeSearchPanel;
    document.body.appendChild(overlay);
}

function removeOverlay() {
    const overlay = document.querySelector('.search-overlay');
    if (overlay) overlay.remove();
}

function selectSuggestion(text) {
    mainSearchInput.value = text;
    initialSuggestions.style.display = 'none';
    tabsContainer.style.display = 'block';
}

function changeTab(tabName) {
    // Atualiza botões das abas
    setActiveOption(document.querySelector(`.tab-button:contains(${tabName})`), '.tab-button');
    
    // Mostra apenas a aba selecionada
    document.querySelectorAll('[id$="-tab"]').forEach(tab => {
        tab.style.display = tab.id === `${tabName}-tab` ? 'block' : 'none';
    });
}

function showSuggestions(inputElement, suggestionsId) {
    const input = inputElement.value.toLowerCase();
    const suggestionsBox = document.getElementById(suggestionsId);
    
    suggestionsBox.innerHTML = '';
    suggestionsBox.style.display = 'none';
    
    if (input.length < 3) {
        if (input.length > 0) {
            suggestionsBox.innerHTML = '<div class="suggestion-item">Digite pelo menos 3 letras</div>';
            suggestionsBox.style.display = 'block';
        }
        return;
    }
    
    const matches = CIDADES.filter(cidade => cidade.toLowerCase().includes(input));
    
    if (matches.length > 0) {
        matches.forEach(cidade => {
            const item = document.createElement('div');
            item.className = 'suggestion-item';
            item.textContent = cidade;
            item.onclick = () => {
                inputElement.value = cidade;
                suggestionsBox.style.display = 'none';
            };
            suggestionsBox.appendChild(item);
        });
    } else {
        suggestionsBox.innerHTML = '<div class="suggestion-item">Nenhum resultado encontrado</div>';
    }
    
    suggestionsBox.style.display = 'block';
}

// Funções utilitárias
function setActiveOption(activeElement, selector) {
    document.querySelectorAll(selector).forEach(el => el.classList.remove('active'));
    activeElement.classList.add('active');
}

// Polyfill para :contains() do jQuery
document.querySelectorAll = function(selector) {
    const elements = Element.prototype.querySelectorAll.apply(this, arguments);
    if (selector.includes(':contains(')) {
        const text = selector.match(/:contains\((['"]?)(.*?)\1\)/)[2];
        return Array.prototype.filter.call(elements, el => 
            el.textContent.includes(text)
        );
    }
    return elements;
};