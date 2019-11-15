class Column {
    constructor(columnObject=null, notesArray=null) {
        const instance = this;
        this.notes = [];

        const column = this.element = document.createElement('div');
        column.className += 'column';
        column.setAttribute('draggable', 'true');
        column.innerHTML = `
        <p class="column-header">Название колонки</p>
        <div data-notes></div>
        <p class="column-footer">
            <span data-action-addNote class="action">+ Добавить карточку</span>
        </p>
        `;
        if (columnObject) {
            column.setAttribute('data-column-id', '' + columnObject.id);
            for(const noteId of columnObject.noteIds) {
                const noteObject = notesArray.find(note => note.id === noteId),
                    note = new Note(noteObject);
                this.add(note);
            }
            column.querySelector('.column-header').textContent = columnObject.title;
        } else {
            column.setAttribute('data-column-id', '' + Column.idCounter++);
        }

        const btnAddNote = column.querySelector('[data-action-addNote]');
        btnAddNote.addEventListener('click', () => {
            const note = new Note();
            instance.add(note);

            note.element.focus();
            note.element.closest('.column').removeAttribute('draggable');
        });

        const headerElement = column.querySelector('.column-header');
        headerElement.addEventListener('dblclick', () => {
            headerElement.setAttribute('contentEditable', 'true');
            column.removeAttribute('draggable');
            headerElement.focus();
        });
        headerElement.addEventListener('blur', () => {
            headerElement.removeAttribute('contentEditable');
            column.setAttribute('draggable', 'true');
        });

        column.addEventListener('dragstart', this.dragstart.bind(this));
        column.addEventListener('dragend', this.dragend.bind(this));
        column.addEventListener('dragenter', this.dragenter.bind(this));
        column.addEventListener('dragleave', this.dragleave.bind(this));
        column.addEventListener('dragover', this.dragover.bind(this));
        column.addEventListener('drop', this.drop.bind(this));
    }

    add(...notes) {
        for (const note of notes) {
            if (!this.notes.includes(note)) {
                this.notes.push(note);

                this.element.querySelector('[data-notes]').appendChild(note.element);
            }
        }
    }

    dragstart(event) {
        Column.dragged = this.element;
        this.element.className += ' dragged';
    }

    dragend(event) {
        Column.dragged = null;
        this.element.classList.remove('dragged');

        Application.save();
    }

    dragenter(event) {
        if ((this.element === Column.dragged) || (!Column.dragged) ||
            (!event.relatedTarget) || event.relatedTarget.closest('.column')) {
            return;
        }
        this.element.className += ' under';
    }

    dragleave(event) {
        if ((this.element === Column.dragged) || (!Column.dragged) || event.relatedTarget.closest('.column')) {
            return;
        }
        this.element.classList.remove('under');
    }

    dragover(event){
        event.preventDefault();
        if ((this.element === Column.dragged) || (!Column.dragged)) {
            return;
        }
    }

    drop(event) {
        if (Note.dragged) {
            return this.element.querySelector('[data-notes]').appendChild(Note.dragged);
        } else if (Column.dragged) {
            this.element.classList.remove('under');
            const columnsArray = Array.from(document.querySelectorAll('.column')),
                underElementIndex = columnsArray.indexOf(this.element),
                draggedIndex = columnsArray.indexOf(Column.dragged);

            if (underElementIndex > draggedIndex) {
                this.element.parentElement.insertBefore(Column.dragged, this.element.nextElementSibling);
            } else {
                this.element.parentElement.insertBefore(Column.dragged, this.element);
            }
        }
    }
}
Column.idCounter = document.querySelectorAll('[data-column-id]').length;
Column.dragged = null;
