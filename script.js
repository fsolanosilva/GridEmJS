let data = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Doe', email: 'jane@example.com' },
    { id: 3, name: 'May jen', email: 'jane@example.com' },
    { id: 4, name: 'Ronald rekin', email: 'jane@example.com' },
    { id: 5, name: 'Bille doe', email: 'jane@example.com' },
    { id: 6, name: 'Mariana Ximen', email: 'jane@example.com' },
    { id: 7, name: 'Zack Efron', email: 'jane@example.com' },
    { id: 8, name: 'Jhon Kenedy', email: 'jane@example.com' },
    { id: 9, name: 'Jhon Areas', email: 'jane@example.com' },
    { id: 10, name: 'Vini Junir', email: 'jane@example.com' },
    { id: 11, name: 'Neymar Junior', email: 'jane@example.com' },
    { id: 12, name: 'Marilin Joe', email: 'jane@example.com' },
    // Adicione mais objetos conforme necessário
];

document.addEventListener('DOMContentLoaded', function () {
    // Exemplo de dados, substitua com seus próprios dados

    const itemsPerPage = 5;
    let currentPage = 1;
    let currentColumn = 'id';
    let currentOrder = 'asc';

    const tableBody = document.querySelector('#data-grid tbody');
    const headers = document.querySelectorAll('#data-grid th');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const firstPageBtn = document.getElementById('first-page-btn');
    const lastPageBtn = document.getElementById('last-page-btn');
    const currentPageSpan = document.getElementById('current-page');

    function createOptionsButtons() {
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.classList.add('edit-btn');
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('delete-btn');

        // Adicione aqui a lógica para manipular os eventos dos botões (edição, exclusão)

        const optionsCell = document.createElement('td');
        optionsCell.appendChild(editButton);
        optionsCell.appendChild(deleteButton);

        return optionsCell;
    }

    // script.js

    // ... (seu código anterior)

    function displayData() {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const currentData = data.slice(startIndex, endIndex);

        tableBody.innerHTML = '';

        currentData.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>${item.email}</td>
            <td class="options-column">
                <div class="btn-group" role="group">
                    <button type="button" class="btn btn-warning btn-sm ml-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
                            <path d="M11.742 0.742a1 1 0 0 1 1.414 0l2 2a1 1 0 0 1 0 1.414l-10 10a1 1 0 0 1-0.446 0.279l-4-1a1 1 0 0 1-.554-1.326l1-4a1 1 0 0 1 0.819-0.748l13-3a1 1 0 0 1 1.195 1.195l-3 13a1 1 0 0 1-0.748 0.819l-4 1a1 1 0 0 1-1.326-0.554l-1-4a1 1 0 0 1 0.279-0.446z"/>
                        </svg>
                    </button>
                    <button type="button" class="btn btn-danger btn-sm ml-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                            <path d="M3 1a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v1H3V1zm10 2H0v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1zm-1 11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4h9v10z"/>
                            <path d="M5 7a1 1 0 0 1 1-1h1a1 1 0 0 1 0 2H6a1 1 0 0 1-1-1zm0 4a1 1 0 0 1 1-1h1a1 1 0 0 1 0 2H6a1 1 0 0 1-1-1z"/>
                        </svg>
                    </button>
                    <!-- Adicione mais botões conforme necessário -->
                </div>
            </td>
        `;
            tableBody.appendChild(row);
        });
    }

    // ... (seu código anterior)


    function sortData(column, order) {
        data.sort((a, b) => {
            let comparison = 0;

            if (a[column] > b[column]) {
                comparison = 1;
            } else if (a[column] < b[column]) {
                comparison = -1;
            }

            return order === 'asc' ? comparison : -comparison;
        });
    }

    function toggleOrder() {
        currentOrder = currentOrder === 'asc' ? 'desc' : 'asc';
    }

    function updateHeaders() {
        headers.forEach(header => {
            if (header.getAttribute('data-column') === currentColumn) {
                header.setAttribute('data-order', currentOrder);
            } else {
                header.removeAttribute('data-order');
            }
        });
    }

    function handleHeaderClick(column) {
        if (currentColumn === column) {
            toggleOrder();
        } else {
            currentColumn = column;
            currentOrder = 'asc';
        }

        sortData(currentColumn, currentOrder);
        updateHeaders();
        currentPage = 1;
        displayData();
        updatePaginationButtons();
    }

    function updatePaginationButtons() {
        currentPageSpan.textContent = currentPage;
        firstPageBtn.disabled = currentPage === 1;
        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage === Math.ceil(data.length / itemsPerPage);
        lastPageBtn.disabled = currentPage === Math.ceil(data.length / itemsPerPage);
    }

    // Adiciona evento de clique aos cabeçalhos da coluna
    headers.forEach(header => {
        header.addEventListener('click', function () {
            const column = this.getAttribute('data-column');
            handleHeaderClick(column);
        });
    });

    // Adiciona evento de clique ao botão "Next"
    nextBtn.addEventListener('click', function () {
        if (currentPage < Math.ceil(data.length / itemsPerPage)) {
            currentPage++;
            displayData();
            updatePaginationButtons();
        }
    });

    // Adiciona evento de clique ao botão "Previous"
    prevBtn.addEventListener('click', function () {
        if (currentPage > 1) {
            currentPage--;
            displayData();
            updatePaginationButtons();
        }
    });

    // Adiciona evento de clique ao botão "Ir para a Primeira Página"
    firstPageBtn.addEventListener('click', function () {
        if (currentPage > 1) {
            currentPage = 1;
            displayData();
            updatePaginationButtons();
        }
    });

    // Adiciona evento de clique ao botão "Ir para a Última Página"
    lastPageBtn.addEventListener('click', function () {
        const lastPage = Math.ceil(data.length / itemsPerPage);
        if (currentPage < lastPage) {
            currentPage = lastPage;
            displayData();
            updatePaginationButtons();
        }
    });

    displayData();
    updatePaginationButtons();
});
