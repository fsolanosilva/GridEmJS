document.addEventListener('DOMContentLoaded', function () {
    // Exemplo de dados, substitua com seus próprios dados
    const data = [
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

    function displayData() {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const currentData = data.slice(startIndex, endIndex);

        tableBody.innerHTML = '';

        currentData.forEach(item => {
            const row = document.createElement('tr');

            // Adicionar colunas de dados
            Object.keys(item).forEach(key => {
                const cell = document.createElement('td');
                cell.textContent = item[key];
                row.appendChild(cell);
            });

            // Adicionar coluna "Options" com botões de edição e exclusão
            row.appendChild(createOptionsButtons());

            // Adicionar a linha à tabela
            tableBody.appendChild(row);
        });
    }

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
        if (currentColumn === column && headers[headers.length - 1] !== column) {
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
