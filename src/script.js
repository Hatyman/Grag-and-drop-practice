document
    .querySelectorAll('.column')
    .forEach(Column.process);

document
    .querySelector('[data-action-addColumn]')
    .addEventListener('click', event => {
        const columnElement = document.createElement('div');
        columnElement.className += 'column';
        columnElement.setAttribute('draggable', 'true');
        columnElement.setAttribute('data-column-id', '' + Column.idCounter++);
        columnElement.innerHTML = `
        <p class="column-header">В плане</p>
        <div data-notes></div>
        <p class="column-footer">
            <span data-action-addNote class="action">+ Добавить карточку</span>
        </p>
        `;

        Column.process(columnElement);
        document.querySelector('.columns').appendChild(columnElement);
    });

document
    .querySelectorAll('.note')
    .forEach(Note.process);
