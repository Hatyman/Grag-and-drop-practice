const Column = {
    idCounter: document.querySelectorAll('[data-column-id]').length,

    process(columnElement) {
        const btnAddNote = columnElement.querySelector('[data-action-addNote]');
        btnAddNote.addEventListener('click', event => {
            const noteElement = document.createElement('div');
            noteElement.className += 'note';
            // noteElement.setAttribute('draggable', 'true');
            noteElement.setAttribute('data-note-id', '' + Note.idCounter++);
            Note.process(noteElement);
            noteElement.setAttribute('contentEditable', 'true');
            columnElement.querySelector('[data-notes]').appendChild(noteElement);
            noteElement.focus();
            // noteElement.removeAttribute('draggable');
            noteElement.closest('.column').removeAttribute('draggable');
        });

        const headerElement = columnElement.querySelector('.column-header');
        headerElement.addEventListener('dblclick', event => {
            headerElement.setAttribute('contentEditable', 'true');
            columnElement.removeAttribute('draggable');
            headerElement.focus();
        });
        headerElement.addEventListener('blur', event => {
            headerElement.removeAttribute('contentEditable');
            columnElement.setAttribute('draggable', 'true');
        });

        columnElement.addEventListener('dragover', Note.dragover);
        columnElement.addEventListener('drop', event => {
            if (Note.dragged) {
                return columnElement.querySelector('[data-notes]').appendChild(Note.dragged);
            }
        });
    }
};