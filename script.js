let data = [
    { id: 1, name: 'Marieta Severo', email: 'mServero@exemplo.com.com' },
    { id: 2, name: 'Ronaldo Fenomeno', email: 'rfen@exemplo.com.com' },
    { id: 3, name: 'Jão Doria', email: 'jaod@exemplo.com.com' },
    { id: 4, name: 'Maria Balbe', email: 'mbalbe@exemplo.com.com' },
    { id: 5, name: 'Jonas van dame', email: 'jonasvd@exemplo.com.com' },
    { id: 6, name: 'Mariana Rios', email: 'marianar@exemplo.com.com' },
    { id: 7, name: 'Roberto Carlos', email: 'quandoEuEstouAqui@exemplo.com.com' },
    { id: 8, name: 'Lucas Lima', email: 'LucasL@exemplo.com.com' },
    { id: 9, name: 'Osvaldo Andrade', email: 'OsAndrade@exemplo.com.com' },
    { id: 10, name: 'Vini Junior', email: 'ViniJunior@exemplo.com.com' },
    { id: 11, name: 'Neymar Junior', email: 'NeyMala@exemplo.com.com' },
    { id: 12, name: 'Marilin Joe', email: 'MarilinJ@exemplo.com.com' },
    // Adicione mais objetos conforme necessário
];

document.addEventListener('DOMContentLoaded', function () {
    // Exemplo de dados, substitua com seus próprios dados

    let itemsPerPage = 5;
    let currentPage = 1;
    let currentColumn = 'id';
    let currentOrder = 'asc';
    let editingCell = null; // Armazena a célula que está sendo editada
    let draggedColumn; // Armazena a coluna que está sendo arrastada

    const tableBody = document.querySelector('#data-grid tbody');
    const headers = document.querySelectorAll('#data-grid th');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const firstPageBtn = document.getElementById('first-page-btn');
    const lastPageBtn = document.getElementById('last-page-btn');
    const currentPageSpan = document.getElementById('current-page');
    //const recordsPerPageSelect = document.getElementById('recordsPerPage');

    /**Mover coluna */

    // Adicione um evento de início de arrasto aos cabeçalhos da coluna
    headers.forEach(header => {
        header.draggable = true;

        header.addEventListener('dragstart', function (event) {
            draggedColumn = this;
            event.dataTransfer.effectAllowed = 'move';
        });

        header.addEventListener('dragover', function (event) {
            event.preventDefault();
        });

        header.addEventListener('drop', function () {
            const columns = Array.from(headers);
            const fromIndex = columns.indexOf(draggedColumn);
            const toIndex = columns.indexOf(this);

            if (fromIndex !== -1 && toIndex !== -1 && fromIndex !== toIndex) {
                // Mover a coluna no DOM
                const parent = draggedColumn.parentNode;
                parent.removeChild(draggedColumn);
                parent.insertBefore(draggedColumn, toIndex > fromIndex ? this.nextSibling : this);

                // Mover a coluna nos dados
                moveColumn(fromIndex, toIndex);

                // Redesenha os dados e atualiza a ordenação
                displayData();
                sortData(currentColumn, currentOrder);
                updateHeaders();
            }
        });
    });

    function moveColumn(fromIndex, toIndex) {
        // Mover a coluna nos dados
        data.forEach(item => {
            const temp = item[headers[fromIndex].getAttribute('data-column')];
            item[headers[fromIndex].getAttribute('data-column')] = item[headers[toIndex].getAttribute('data-column')];
            item[headers[toIndex].getAttribute('data-column')] = temp;
        });
    }

    /**Fim Mover Coluna */

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

    // evento de mudança ao seletor de registros por página
    document.getElementById('recordsPerPage').addEventListener('change', function () {
        // Atualize o valor de itemsPerPage
        itemsPerPage = parseInt(this.value, 10);
        currentPage = 1;
        displayData();
        updatePaginationButtons();
    });

    /*Editando celula*/
    function createInputField(value) {
        const input = document.createElement('input');
        input.type = 'text';
        input.value = value;
        return input;
    }

    function createSaveButton() {
        const button = document.createElement('button');
        button.textContent = 'Salvar';
        button.classList.add('btn', 'btn-success', 'btn-sm', 'ml-1');
        button.addEventListener('click', saveChanges);
        return button;
    }

    function createCancelButton() {
        const button = document.createElement('button');
        button.textContent = 'Cancelar';
        button.classList.add('btn', 'btn-secondary', 'btn-sm', 'ml-1');
        button.addEventListener('click', cancelEdit);
        return button;
    }

    function saveChanges() {
        if (editingCell) {
            const input = editingCell.querySelector('input');
            const columnIndex = editingCell.cellIndex;
            const rowIndex = editingCell.parentNode.rowIndex - 1; // -1 para descontar o cabeçalho
            const propertyName = headers[columnIndex].getAttribute('data-column');

            // Atualizar o valor na matriz de dados
            data[rowIndex][propertyName] = input.value;

            // Atualizar a exibição
            displayData();
        }

        editingCell = null; // Limpar a célula sendo editada
    }

    function cancelEdit() {
        if (editingCell) {
            // Restaurar o conteúdo original da célula
            const columnIndex = editingCell.cellIndex;
            const rowIndex = editingCell.parentNode.rowIndex - 1; // -1 para descontar o cabeçalho
            const propertyName = headers[columnIndex].getAttribute('data-column');
            const cellData = data[rowIndex][propertyName];

            editingCell.innerHTML = cellData;
            editingCell = null; // Limpar a célula sendo editada
        }
    }

    function handleCellDoubleClick(event) {
        const clickedCell = event.target;

        // Verificar se a célula clicada é uma célula de dados (não o cabeçalho)
        if (clickedCell.tagName === 'TD') {
            // Se já estiver editando uma célula, salve as alterações
            if (editingCell) {
                saveChanges();
            }

            const columnIndex = clickedCell.cellIndex;
            const rowIndex = clickedCell.parentNode.rowIndex;

            // Evitar editar células da coluna de opções
            if (columnIndex !== headers.length - 1) {
                const propertyName = headers[columnIndex].getAttribute('data-column');
                const cellData = data[rowIndex - 1][propertyName]; // -1 para descontar o cabeçalho

                // Criar um campo de entrada e botões Salvar e Cancelar
                const inputField = createInputField(cellData);
                const saveButton = createSaveButton();
                const cancelButton = createCancelButton();

                // Substituir o conteúdo da célula pelo campo de entrada e botões
                clickedCell.innerHTML = '';
                clickedCell.appendChild(inputField);
                clickedCell.appendChild(saveButton);
                clickedCell.appendChild(cancelButton);

                // Armazenar a célula que está sendo editada
                editingCell = clickedCell;
            }
        }
    }

    document.getElementById('data-grid').addEventListener('dblclick', handleCellDoubleClick);

    // Ouvinte de eventos de clique ao documento para cancelar a edição ao clicar em qualquer lugar fora do grid
    document.addEventListener('click', function (event) {
        const target = event.target;

        // Se o clique não estiver na célula em edição ou nos botões de salvar/cancelar, então cancelar a edição
        if (editingCell && !editingCell.contains(target) && target.tagName !== 'BUTTON') {
            cancelEdit();
        }
    });

    /* fim editando dados no grid*/

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
                    <button type="button" class="btn btn-warning btn-sm ml-1" data-toggle="modal" data-target="#editModal" onclick="openEditModal(${item.id}, '${item.name}', '${item.email}')">
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

    function openEditModal(id, name, email) {
        document.getElementById('editModalData').textContent = name;

        // Preencher os campos de edição da modal com os dados do item
        document.getElementById('editName').value = name;
        document.getElementById('editEmail').value = email;
        document.getElementById('editId').value = id;

        // Adicionar as classes necessárias para mostrar a modal
        document.getElementById('editModal').classList.add('show', 'd-block');

        // Adicionar a classe 'modal-open' ao body para corrigir o fundo escurecido
        document.body.classList.add('modal-open');

        // Exibir o fundo escurecido
        const backdrop = document.createElement('div');
        backdrop.classList.add('modal-backdrop', 'show');
        document.body.appendChild(backdrop);

        // Adicionar um evento de clique ao fundo escurecido para fechar a modal
        backdrop.addEventListener('click', function () {
            // Remover a modal e o fundo escurecido
            document.getElementById('editModal').classList.remove('show', 'd-block');
            document.body.classList.remove('modal-open');
            backdrop.remove();
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

        // Adicione ou remova a classe "disabled" conforme necessário
        if (firstPageBtn.disabled) {
            firstPageBtn.classList.add('disabled');
        } else {
            firstPageBtn.classList.remove('disabled');
        }

        if (prevBtn.disabled) {
            prevBtn.classList.add('disabled');
        } else {
            prevBtn.classList.remove('disabled');
        }

        if (nextBtn.disabled) {
            nextBtn.classList.add('disabled');
        } else {
            nextBtn.classList.remove('disabled');
        }

        if (lastPageBtn.disabled) {
            lastPageBtn.classList.add('disabled');
        } else {
            lastPageBtn.classList.remove('disabled');
        }
    }

    //  evento de clique aos cabeçalhos da coluna
    headers.forEach(header => {
        header.addEventListener('click', function () {
            const column = this.getAttribute('data-column');
            handleHeaderClick(column);
        });
    });

    //  evento de clique ao botão "Next"
    nextBtn.addEventListener('click', function () {
        if (currentPage < Math.ceil(data.length / itemsPerPage)) {
            currentPage++;
            displayData();
            updatePaginationButtons();
        }
    });

    //  evento de clique ao botão "Previous"
    prevBtn.addEventListener('click', function () {
        if (currentPage > 1) {
            currentPage--;
            displayData();
            updatePaginationButtons();
        }
    });

    //  evento de clique ao botão "Ir para a Primeira Página"
    firstPageBtn.addEventListener('click', function () {
        if (currentPage > 1) {
            currentPage = 1;
            displayData();
            updatePaginationButtons();
        }
    });

    //  evento de clique ao botão "Ir para a Última Página"
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
