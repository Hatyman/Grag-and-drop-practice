const Note = {
    idCounter: document.querySelectorAll('[data-note-id]').length,
    dragged: null,
    process(noteElement) {
        noteElement.addEventListener('dblclick', event => {
            noteElement.setAttribute('contentEditable', 'true');
            noteElement.removeAttribute('draggable');
            noteElement.closest('.column').removeAttribute('draggable');
            noteElement.focus();
        });

        noteElement.addEventListener('blur', event => {
            if (!noteElement.innerText.trim()) {
                return noteElement.remove();
            }
            noteElement.innerText = noteElement.innerText.trim();
            noteElement.removeAttribute('contentEditable');
            noteElement.setAttribute('draggable', 'true');
            noteElement.closest('.column').setAttribute('draggable', 'true');
        });


        noteElement.addEventListener('dragstart', Note.dragstart);
        noteElement.addEventListener('dragend', Note.dragend);
        noteElement.addEventListener('dragenter', Note.dragenter);
        noteElement.addEventListener('dragover', Note.dragover);
        noteElement.addEventListener('dragleave', Note.dragleave);
        noteElement.addEventListener('drop', Note.drop);
    },
    dragstart(event){
        Note.dragged = this;
        this.className += ' dragged';
    },
    dragend(event){
        Note.dragged = null;
        this.classList.remove('dragged');
    },
    dragenter(event){
        if (this === Note.dragged) {
            return;
        }
        this.className += ' under';
    },
    dragover(event){
        if (this === Note.dragged) {
            return;
        }
        event.preventDefault();
    },
    dragleave(event){
        if (this === Note.dragged) {
            return;
        }
        this.classList.remove('under');
    },
    drop(event){
        event.stopPropagation();

        if (this === Note.dragged) {
            return;
        }
        this.classList.remove('under');

        if (this.parentElement === Note.dragged.parentElement) {
            const notesArray = Array.from(this.parentElement.querySelectorAll('*')),
                underElementIndex = notesArray.indexOf(this),
                draggedIndex = notesArray.indexOf(Note.dragged);

            if (underElementIndex > draggedIndex) {
                this.parentElement.insertBefore(Note.dragged, this.nextElementSibling);
            } else {
                this.parentElement.insertBefore(Note.dragged, this);
            }
        } else {
            this.parentElement.insertBefore(Note.dragged, this);
        }
    }
};