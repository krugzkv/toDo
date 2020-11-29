const initDataToDo = key =>
  localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)) : [];
const updateDataToDo = (key, todoData) =>
  localStorage.setItem(key, JSON.stringify(todoData));

const createToDo = (title, form, list) => {
  const todoContainer = document.createElement('div');
  const todoRow = document.createElement('div');
  const todoHeader = document.createElement('h1');
  const wrapperForm = document.createElement('div');
  const wrapperList = document.createElement('div');
  todoHeader.textContent = title;
  todoContainer.classList.add('container');
  todoRow.classList.add('row');
  todoHeader.classList.add('text-center', 'mb-5');
  wrapperForm.classList.add('col-6');
  wrapperList.classList.add('col-6');
  wrapperForm.append(form);
  wrapperList.append(list);
  todoHeader.textContent = title;
  todoRow.append(wrapperForm, wrapperList);
  todoContainer.append(todoHeader, todoRow);
  return todoContainer;
}

const createFormToDo = () => {
  const form = document.createElement('form');
  const input = document.createElement('input');
  const textArea = document.createElement('textarea');
  const btnSubmit = document.createElement('button');
  input.placeholder = 'Заголовок';
  textArea.placeholder = 'Описание';
  btnSubmit.textContent = 'Добавить';
  btnSubmit.type = 'submit';
  form.classList.add('form-group');
  input.classList.add('form-control', 'mb-3');
  textArea.classList.add('form-control', 'mb-3');
  btnSubmit.classList.add('btn', 'btn-primary', 'btn-lg', 'btn-block');
  form.append(input, textArea, btnSubmit);
  return { input, textArea, btnSubmit, form }
}

const createListToDo = () => {
  const listToDo = document.createElement('ul');
  listToDo.classList.add('list-group');
  return listToDo;
}

const createItemToDo = (item, listToDo) => {
  const itemToDo = document.createElement('li');
  const btnItem = document.createElement('button');
  itemToDo.classList.add('list-group-item', 'p-0', 'mb-3', 'border-0');
  btnItem.classList.add('list-item', 'btn', 'btn-block', 'border-primary', 'rounded-pill', item.success ? 'btn-success' : 'btn-light')
  btnItem.textContent = item.nameToDo;
  btnItem.id = item.id;
  itemToDo.append(btnItem);
  listToDo.append(itemToDo);

}

const addToDoItem = (key, todoData, listToDo, nameToDo, descriptionToDo) => {
  const id = `todo${(+new Date()).toString(16)}`;
  todoData.push({ id, nameToDo, descriptionToDo, success: false })
  updateToDo(listToDo, todoData, key);
  console.log(todoData);
}

const createModal = () => {
  const modalElem = document.createElement('div');
  const modalDialog = document.createElement('div');
  const modalContent = document.createElement('div');
  const modalHeader = document.createElement('div');
  const modalBody = document.createElement('div');
  const modalFooter = document.createElement('div');
  const itemTitle = document.createElement('h2');
  const itemDescription = document.createElement('h2');
  const btnClose = document.createElement('button');
  const btnReady = document.createElement('button');
  const btnDelete = document.createElement('button');

  modalElem.classList.add('modal');
  modalDialog.classList.add('modal-dialog');
  modalContent.classList.add('modal-content');
  modalHeader.classList.add('modal-header');
  modalBody.classList.add('modal-body');
  modalFooter.classList.add('modal-footer');
  itemTitle.classList.add('modal-title');
  btnClose.classList.add('close', 'btn-modal');
  btnReady.classList.add('btn', 'btn-success', 'btn-modal');
  btnDelete.classList.add('btn', 'btn-danger', 'btn-delete', 'btn-modal');
  btnClose.innerHTML = '&times;';
  btnReady.textContent = 'Выполнено';
  btnDelete.textContent = 'Удалить';
  modalDialog.append(modalContent);
  modalContent.append(modalHeader, modalBody, modalFooter);
  modalHeader.append(itemTitle, btnClose);
  modalBody.append(itemDescription);
  modalFooter.append(btnReady, btnDelete);
  modalElem.append(modalDialog);

  const closeModal = event => {
    const target = event.target;
    if (target.classList.contains('btn-modal') || target === modalElem) {
      modalElem.classList.remove('d-block');
    }
  };
  const showModal = (titleToDo, descriptionToDo, id) => {
    modalElem.dataset.idItem = id;
    modalElem.classList.add('d-block');
    itemTitle.textContent = titleToDo;
    itemDescription.textContent = descriptionToDo;

  }
  modalElem.addEventListener('click', closeModal);
  return { modalElem, btnReady, btnDelete, showModal }
}

const updateToDo = (listToDo, todoData, key) => {
  listToDo.textContent = '';
  todoData.forEach(item => createItemToDo(item, listToDo));
  updateDataToDo(key, todoData);

}

const initToDo = (selector) => {
  const key = prompt('Ты кто?');
  const todoData = initDataToDo(key);
  const wrapper = document.querySelector(selector);
  const formToDo = createFormToDo();
  const listToDo = createListToDo();
  const modal = createModal();
  const todoApp = createToDo(key, formToDo.form, listToDo);

  document.body.append(modal.modalElem);

  wrapper.append(todoApp);

  formToDo.form.addEventListener('submit', event => {
    event.preventDefault();
    formToDo.input.classList.remove('is-invalid');
    formToDo.textArea.classList.remove('is-invalid');

    if (formToDo.input.value.trim() && formToDo.textArea.value.trim()) {
      const id = `todo${(+new Date()).toString(16)}`;
      addToDoItem(key, todoData, listToDo, formToDo.input.value, formToDo.textArea.value);
      formToDo.form.reset();

    } else {
      if (!formToDo.input.value) {
        formToDo.input.classList.add('is-invalid');
      }
      if (!formToDo.textArea.value) {
        formToDo.textArea.classList.add('is-invalid');
      }
    }
  })

  listToDo.addEventListener('click', event => {
    const target = event.target;
    if (target.classList.contains('list-item')) {
      const item = todoData.find(elem => elem.id === target.id);
      modal.showModal(item.nameToDo, item.descriptionToDo, item.id);
    }
  });

  modal.btnReady.addEventListener('click', () => {
    const itemToDo = todoData.find(elem => elem.id === modal.modalElem.dataset.idItem);
    itemToDo.success = !itemToDo.success;
    updateToDo(listToDo, todoData, key);
  });

  modal.btnDelete.addEventListener('click', () => {
    const index = todoData.findIndex(elem => elem.id === modal.modalElem.dataset.idItem);
    todoData.splice(index, 1);
    updateToDo(listToDo, todoData, key);
  });

  document.title = key;

  updateToDo(listToDo, todoData, key);
}

initToDo('.app');