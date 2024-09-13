document.addEventListener('DOMContentLoaded', () => {
    const requestLists = {
        get: document.getElementById('get-requests-list'),
        post: document.getElementById('post-requests-list'),
        put: document.getElementById('put-requests-list'),
        delete: document.getElementById('delete-requests-list')
    };

    const modal = document.getElementById('request-modal');
    const openModalBtn = document.getElementById('open-modal');
    const closeModalBtn = modal.querySelector('.close');
    const requestForm = document.getElementById('request-form');
    const urlInput = document.getElementById('url');
    const methodSelect = document.getElementById('method');
    const paramsInput = document.getElementById('params');
    const headersInput = document.getElementById('headers');
    const bodyInput = document.getElementById('body');
    const authSelect = document.getElementById('auth');
    const authValueInput = document.getElementById('auth-value');

    function saveRequests() {
        const requests = {};
        for (const method in requestLists) {
            requests[method] = Array.from(requestLists[method].children).map(item => item.outerHTML);
        }
        localStorage.setItem('requests', JSON.stringify(requests));
    }

    function loadRequests() {
        const requests = JSON.parse(localStorage.getItem('requests')) || {};
        for (const method in requestLists) {
            if (requests[method]) {
                requests[method].forEach(itemHTML => {
                    const requestItem = document.createElement('div');
                    requestItem.className = 'request-item';
                    requestItem.innerHTML = itemHTML;
                    requestLists[method].appendChild(requestItem);

                    requestItem.querySelector('.delete-btn').addEventListener('click', () => {
                        requestItem.remove();
                        saveRequests();
                    });
                });
            }
        }
    }

    function addRequest(url, method, params, headers, body, auth, authValue) {
        const requestItem = document.createElement('div');
        requestItem.className = 'request-item';
        requestItem.innerHTML = `
            <strong>URL:</strong> ${url} <br>
            <strong>Method:</strong> ${method} <br>
            <strong>Parameters:</strong> ${params ? params : 'None'} <br>
            <strong>Headers:</strong> ${headers ? headers : 'None'} <br>
            <strong>Body:</strong> ${body ? body : 'None'} <br>
            <strong>Authorization:</strong> ${auth ? `${auth}: ${authValue}` : 'None'} <br>
            <button class="delete-btn"><i class="fas fa-trash"></i></button>
        `;

        requestItem.querySelector('.delete-btn').addEventListener('click', () => {
            requestItem.remove();
            saveRequests();
        });

        requestLists[method.toLowerCase()].appendChild(requestItem);
        saveRequests();
    }

    openModalBtn.addEventListener('click', () => {
        modal.style.display = 'flex'; 
        localStorage.setItem('modalOpen', 'true'); 
    });

    closeModalBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        localStorage.setItem('modalOpen', 'false'); 
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none'; 
            localStorage.setItem('modalOpen', 'false'); 
        }
    });

    requestForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const url = urlInput.value;
        const method = methodSelect.value;
        const params = paramsInput.value;
        const headers = headersInput.value;
        const body = bodyInput.value;
        const auth = authSelect.value;
        const authValue = authValueInput.value;

        if (url) {
            addRequest(url, method, params, headers, body, auth, authValue);
            requestForm.reset();
            modal.style.display = 'none'; 
            localStorage.setItem('modalOpen', 'false'); 
        }
    });

    // Initialize the modal state based on localStorage
    const modalOpen = localStorage.getItem('modalOpen');
    if (modalOpen === 'true') {
        modal.style.display = 'flex'; 
    } else {
        modal.style.display = 'none'; 
    }

    loadRequests();
});
