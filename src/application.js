const Application = {
    save() {
        const object = {
            columns: {
                idCounter: Column.idCounter,
                items: []
            },

            notes: {
                idCounter: Note.idCounter,
                items: []
            }
        };

        document
            .querySelectorAll('.column')
            .forEach(columnElement => {
                const column = {
                    id: parseInt(columnElement.getAttribute('data-column-id')),
                    title: columnElement.querySelector('.column-header').textContent,
                    noteIds: []
                };
                
                columnElement
                    .querySelectorAll('.note')
                    .forEach(noteElement => {
                        const note = {
                            id: parseInt(noteElement.getAttribute('data-note-id')),
                            textContent: noteElement.textContent
                        };

                        object.notes.items.push(note);
                        column.noteIds.push(note.id);
                    });
                
                object.columns.items.push(column);
            });

        const json = JSON.stringify(object);
        localStorage.setItem("trello", json);
        return 1;
    },

    load() {
        const mountPoint = document.querySelector('.columns');
        mountPoint.innerHTML = '';
        if (!localStorage.getItem('trello')) {
            const column = new Column();
            return mountPoint.appendChild(column.element);
        }

        const object = JSON.parse(localStorage.getItem('trello'));

        Note.idCounter = object.notes.idCounter;
        Column.idCounter = object.columns.idCounter;

        for (const columnObject of object.columns.items) {
            const column = new Column(columnObject, object.notes.items);
            mountPoint.appendChild(column.element);
        }

        return 1;
    }
};