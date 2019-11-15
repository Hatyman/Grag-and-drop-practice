class Note {
    constructor(noteObject=null) {
        const element = this.element = document.createElement('div');
        element.className += 'note';
        if (noteObject) {
            element.setAttribute('data-note-id', '' + noteObject.id);
            element.textContent = noteObject.textContent;
            element.setAttribute('draggable', 'true');
        } else {
            element.setAttribute('data-note-id', '' + Note.idCounter++);
            element.setAttribute('contentEditable', 'true');
        }
        // Note.process(this.element);
        element.addEventListener('dblclick', () => {
            element.setAttribute('contentEditable', 'true');
            element.removeAttribute('draggable');
            this.column.removeAttribute('draggable');
            element.focus();
        });

        element.addEventListener('blur', () => {
            if (!element.innerText.trim()) {
                element.remove();
                return Application.save();
            }
            element.innerText = element.innerText.trim();
            element.removeAttribute('contentEditable');
            element.setAttribute('draggable', 'true');
            this.column.setAttribute('draggable', 'true');

            Application.save();
        });

        element.addEventListener('dragstart', this.dragstart.bind(this));
        element.addEventListener('dragend', this.dragend.bind(this));
        element.addEventListener('dragenter', this.dragenter.bind(this));
        element.addEventListener('dragover', this.dragover.bind(this));
        element.addEventListener('dragleave', this.dragleave.bind(this));
        element.addEventListener('drop', this.drop.bind(this));

        // return noteElement;
    }

    get column() {
        return this.element.closest('.column');
    }

    dragstart(event){
        event.stopPropagation();
        Note.dragged = this.element;
        this.element.className += ' dragged';
    }

    dragend(event){
        event.stopPropagation();
        Note.dragged = null;
        this.element.classList.remove('dragged');

        Application.save();
    }

    dragenter(event){
        event.stopPropagation();
        if ((this.element === Note.dragged) || (!Note.dragged)) {
            return;
        }
        this.element.className += ' under';
    }

    dragover(event){
        event.preventDefault();
        if ((this.element === Note.dragged) || (!Note.dragged)) {
            return;
        }
    }

    dragleave(event){
        event.stopPropagation();
        if ((this.element === Note.dragged) || (!Note.dragged)) {
            return;
        }
        this.element.classList.remove('under');
    }

    drop(event){
        event.stopPropagation();
        if (Note.dragged) {
            this.element.classList.remove('under');
            if ((this.element === Note.dragged) || (!Note.dragged)) {
                return;
            }

            if (this.element.parentElement === Note.dragged.parentElement) {
                const notesArray = Array.from(this.element.parentElement.querySelectorAll('*')),
                    underElementIndex = notesArray.indexOf(this.element),
                    draggedIndex = notesArray.indexOf(Note.dragged);

                if (underElementIndex > draggedIndex) {
                    this.element.parentElement.insertBefore(Note.dragged, this.element.nextElementSibling);
                } else {
                    this.element.parentElement.insertBefore(Note.dragged, this.element);
                }
            } else {
                this.element.parentElement.insertBefore(Note.dragged, this.element);
            }
        } else if (Column.dragged) {
            const columnElement = this.element.closest('.column');
            columnElement.classList.remove('under');
            const columnsArray = Array.from(document.querySelectorAll('.column')),
                underElementIndex = columnsArray.indexOf(columnElement),
                draggedIndex = columnsArray.indexOf(Column.dragged);

            if (underElementIndex > draggedIndex) {
                columnElement.parentElement.insertBefore(Column.dragged, columnElement.nextElementSibling);
            } else {
                columnElement.parentElement.insertBefore(Column.dragged, columnElement);
            }
        }

    }
}
Note.idCounter = 8;
Note.dragged = null;

