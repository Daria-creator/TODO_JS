$(() => {
  const ENTER_KEY = 13;
  const COUNT_OF_TASKS_ON_ONE_PAGE = 5;

  let arrObjectsTodo = [];
  let currentArray = [];
  let currentPage = 1;
  let currentTab = 'button-all';

  const getRandomId = () => Math.random();

  const renderTodo = (array = []) => {
    let strTodo = '';
    let checkedTodo = '';
    array.forEach((item) => {
      checkedTodo = item.status === true ? 'checked' : '';
      strTodo += `<li id=" ${item.idTodo} "> <input
      type="checkbox" class="checkbox-for-one" ${checkedTodo}>
      <span>${item.item}</span> <input 
      type="button" class="button-del" value='del'> </input></li>`;
    });
    $('#todo-list').html(strTodo);
  };

  const renderPagination = () => {
    let strButtons = '';
    let classActive = '';
    currentArray.forEach((item, index) => {
      const checkNeedPagination = index % COUNT_OF_TASKS_ON_ONE_PAGE;
      if (checkNeedPagination === 0) {
        const indexOfPage = index / COUNT_OF_TASKS_ON_ONE_PAGE;
        const uniqueId = getRandomId();
        classActive = indexOfPage + 1 === Number(currentPage) ? 'active' : ' ';
        strButtons += `<input type="button" class="buttons-pagination ${classActive}"
        id="${uniqueId}" value="${indexOfPage + 1}">`;
      }
    });
    $('#todo-pagination').html(strButtons);
  };

  const outputCountTodo = () => {
    const countOfCompleted = arrObjectsTodo.filter((item) => item.status === true).length;
    const countOfUnCompleted = arrObjectsTodo.length - countOfCompleted;
    $('#count-todo').text(` ${countOfCompleted} : ${countOfUnCompleted} `);
  };

  const showTabs = (isCompleted) => arrObjectsTodo.filter((item) => item.status === isCompleted); 

  const makePaginationTodo = () => {
    const leftBorder = COUNT_OF_TASKS_ON_ONE_PAGE * (currentPage - 1);
    const rightBorder = currentPage * COUNT_OF_TASKS_ON_ONE_PAGE;
    return currentArray.slice(leftBorder,rightBorder);
  };

  const tabsFilter = () => {
    $('.tabs-todo').removeClass('active');
    $('#currentTab').addClass('active');
    if(currentTab === 'button-all'){
      $('#button-all').addClass('active');
      currentArray = arrObjectsTodo;
    } else {
      const isCompleted = currentTab === 'button-completed' ? true : false;     
      currentArray = showTabs(isCompleted);
    }
    if (currentTab === 'button-completed') {
      $('#button-completed').addClass('active');
    } else if (currentTab === 'button-uncompleted') {
      $('#button-uncompleted').addClass('active');
    }
  };

  const makeAllChecked = (check) => {
    const $ButtonAllCheck = $('#button-all-check');
    const isAllChecked = check;
    if (!isAllChecked) {
      $ButtonAllCheck.addClass('active')
    } else {
      $ButtonAllCheck.removeClass('active');
    }
  };

  const checkAllTodo = () => {
    const isAllChecked = $('#button-all-check').hasClass('active');
    arrObjectsTodo.forEach((item) => {
      const objectTodo = item;
      objectTodo.status = !isAllChecked;
    });
    makeAllChecked(isAllChecked);
    tabsFilter();
    outputCountTodo();
    renderTodo(makePaginationTodo());
    renderPagination();
  };

  const checkAreAllTodoMarked = () => {
    const isAllChecked = arrObjectsTodo.every((item) => item.status === true);
    makeAllChecked(!isAllChecked);
  };

  const checkOneTodo = function () {
    const idCheckedTodo = Number($(this).parent()
      .attr('id'));
    arrObjectsTodo.forEach((item) => {
      const objectTodo = item;
      if (objectTodo.idTodo === idCheckedTodo) {
        if (objectTodo.status === false) {
          objectTodo.status = true;
        } else {
          objectTodo.status = false;
        }
      }
    });
    checkAreAllTodoMarked();
    tabsFilter();
    if(makePaginationTodo().length === 0){
      currentPage = Math.ceil(currentArray.length / COUNT_OF_TASKS_ON_ONE_PAGE);
    }
    renderTodo(makePaginationTodo());
    renderPagination();
    outputCountTodo();
  };

  const deleteOneTodo = function () {
    const id = Number($(this).parent()
      .attr('id'));
    arrObjectsTodo.forEach((item, index) => {
      if (item.idTodo === id) {
        arrObjectsTodo.splice(index, 1);
      }
    });
    checkAreAllTodoMarked();
    tabsFilter();
    if(makePaginationTodo().length === 0){
      currentPage = Math.ceil(currentArray.length / COUNT_OF_TASKS_ON_ONE_PAGE);
    }
    renderTodo(makePaginationTodo());
    renderPagination();
    outputCountTodo();
    if (arrObjectsTodo.length === 0) {
      $('.elements-work-with-tasks').hide();
    }
  };

  const deleteAllCompleted = () => arrObjectsTodo.filter((item) => item.status === false);

  const editTodo = function () {
    const idThis = Number($(this).attr('id'));
    const textTodo = $(this).find('span')
      .html();
    const str = ` <input class="edit-todo" id="${idThis}" >`;
    $(this).replaceWith($(str));
    const $EditTodo = $('.edit-todo');
    $EditTodo.val(textTodo);
    $EditTodo.focus();
  };

  const addElements = () => {
    $('#button-all-check').removeClass('active');
    const todoInput = $.trim(_.escape($('#todo-input').val()));
    if (todoInput.length !== 0) {
      const uniqueId = getRandomId();
      const objectTodo = { idTodo: uniqueId, item: todoInput, status: false };
      arrObjectsTodo.push(objectTodo);
      outputCountTodo();
      $('.elements-work-with-tasks').show();
      if (currentTab === 'button-completed') {
        currentTab = 'button-all';
      }
      tabsFilter();
      currentPage = Math.ceil(arrObjectsTodo.length / COUNT_OF_TASKS_ON_ONE_PAGE);
      renderTodo(makePaginationTodo());
      renderPagination();
    }
    $('#todo-input').val('');
  };

  const deleteCompletedTodo = () => {
    arrObjectsTodo = deleteAllCompleted();
    currentTab = 'button-all';
    tabsFilter();
    outputCountTodo(arrObjectsTodo);
    if(makePaginationTodo().length === 0){
      currentPage = Math.ceil(currentArray.length / COUNT_OF_TASKS_ON_ONE_PAGE);
    }
    renderTodo(makePaginationTodo());
    renderPagination();
    if (arrObjectsTodo.length === 0) {
      $('#button-all-check').removeClass('active');
      $('.elements-work-with-tasks').hide();
    }
  };

  const saveEditTodo = () => {
    const $EditTodo = $('.edit-todo');
    const todoInput = $.trim(_.escape($EditTodo.val()));
    if (todoInput.length !== 0) {
      const idThis = Number($EditTodo.attr('id'));
      arrObjectsTodo.forEach((item) => {
        if (idThis === item.idTodo) {
          const objectTodo = item;
          objectTodo.item = todoInput;
        }
      });
    }
    tabsFilter();
    renderTodo(makePaginationTodo());
    renderPagination();
    $('#todo-input').focus();
  };

  $('#button-add').on('click', addElements);
  $('#button-all-check').on('click', checkAllTodo);
  $('body').on('click', '.checkbox-for-one', checkOneTodo);
  $('body').on('click', '.button-del', deleteOneTodo);
  $('#button-del-completed').on('click', deleteCompletedTodo);
  $('#todo-list').on('dblclick', 'li', editTodo);
  $('#todo-pagination').on('click', '.buttons-pagination', function () {
    $('.buttons-pagination').removeClass('active');
    currentPage = $(this).attr('value');
    $(this).addClass('active');
    renderTodo(makePaginationTodo(currentArray));
  });
  $('#todo-list').on('keydown', '.edit-todo', (event) => {
    if (event.which === ENTER_KEY) {
      saveEditTodo();
    }
  });

  $('#todo-input').on('keydown', (event) => {
    if (event.which === ENTER_KEY) {
      addElements();
    }
  });

  $('.tabs-todo').on('click', function () {
    currentTab = $(this).attr('id');
    currentPage = 1;
    tabsFilter();
    renderTodo(makePaginationTodo());
    renderPagination(makePaginationTodo());
  });

  $('#todo-list').on('blur', '.edit-todo', saveEditTodo);
});
