Application.load();

document
    .querySelector('[data-action-addColumn]')
    .addEventListener('click', event => {
        const column = new Column();
        document.querySelector('.columns').appendChild(column.element);
        Application.save();
    });
