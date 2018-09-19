var log = function () {
  console.log.apply(console, arguments);
};

// 绑定回车事件
var bindEventEnter = function () {
  todoContainer.addEventListener("keydown", function (event) {
    log("container keydown", event, event.target);
    var target = event.target;
    if (event.key === "Enter") {
      log("按了回车");
      // 失去焦点
      target.blur();
      // 阻止默认行为的发生, 也就是不插入回车
      event.preventDefault();
      // 更新 todo
      var index = indexOfElement(target.parentElement);
      log("update index", index);
      // 把元素在 todoList 中更新
      todoList[index].task = target.innerHTML;
      // todoList.splice(index, 1)
      saveTodos();
    }
  });
};
// 绑定失焦事件
var bindEventBlur = function () {
  todoContainer.addEventListener("blur", function (event) {
    log("container blur", event, event.target);
    var target = event.target;
    if (target.classList.contains('todo-label')) {
      log('update and save');
      target.setAttribute('contenteditable', 'false');
      var index = indexOfElement(target.parentElement);
      log("update", index);
      todoList[index].task = target.innerHTML;
      saveTodos();
    }
  }, true);
};
// 绑定点击add事件
var bindEventAdd = function () {
  //获取todo内容
  addButton.addEventListener("click", function () {
    var todoInput = document.querySelector("#id-input-todo");
    var todoValue = todoInput.value;
    var todo = {
      task: todoValue,
      time: currentTime(),
      done: false
    };
    todoList.push(todo);
    saveTodos();
    insertTodo(todo); //添加到todo栏
  });
};
// 绑定按钮事件
var bindEventButton = function () {
  todoContainer.addEventListener("click", function (event) {
    log("container click", event, event.target);
    var target = event.target;
    if (target.classList.contains("todo-done")) {
      log("done");
      var todoDiv = target.parentElement;
      var index = indexOfElement(todoDiv);
      todoList[index].done = !todoList[index].done;
      toggleClass(todoDiv, "done");
      saveTodos();
    } else if (target.classList.contains("todo-delete")) {
      var todoDiv = target.parentElement;
      log(todoDiv);
      var index = indexOfElement(todoDiv);
      log("delete index", index);
      todoDiv.remove();
      todoList.splice(index, 1); //不用delete，delete只删除值，而下标位置还在
      saveTodos();
    } else if (target.classList.contains("todo-edit")) {
      var todoDiv = target.parentElement;
      var span = todoDiv.children[3];
      log('edit', span);
      span.setAttribute('contenteditable', true);
      span.focus();
    }
  });
};
// 绑定事件集合
var bindEvents = function () {
  bindEventAdd();
  bindEventButton();
  bindEventEnter();
  bindEventBlur();
};
// 添加到todo栏
var insertTodo = function (todo) {
  var t = templateTodo(todo);
  var todoContainer = document.querySelector("#id-todo-container");
  todoContainer.insertAdjacentHTML("beforeend", t);
};
// 生成添加的html语句
var templateTodo = function (todo) {
  var t = `
  <div class="todo-cell">
  <button class="todo-done">Done</button>
  <button class="todo-delete">Delete</button>
  <button class="todo-edit">Edit</button>
  <span class='todo-label' contenteditable='false'>${todo.task}</span>
  <span>${todo.time}</span>
  `;
  if (todo.done)
    t = `
  <div class="todo-cell done">
  <button class="todo-done">Done</button>
  <button class="todo-delete">Delete</button>
  <button class="todo-edit">Edit</button>
  <span class='todo-label' contenteditable='false'>${todo.task}</span>
  <span>${todo.time}</span>
  `;
  return t;
};
// 开关某个element的class
var toggleClass = function (element, className) {
  if (element.classList.contains(className)) {
    element.classList.remove(className);
  } else {
    element.classList.add(className);
  }
};
// 返回当前时间
var currentTime = function () {
  var date = new Date();
  var Y = date.getFullYear() + "-";
  var M =
    (date.getMonth() + 1 < 10 ?
      "0" + (date.getMonth() + 1) :
      date.getMonth() + 1) + "-";
  var D = (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " ";
  var h =
    (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":";
  var m =
    (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) +
    ":";
  var s = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
  return Y + M + D + h + m + s;
};
// 保存todolist 到localStorage 每个网页最多存5M
var saveTodos = function () {
  var s = JSON.stringify(todoList);
  localStorage.todoList = s;
};
// 加载todoLists
var loadTodos = function () {
  var s = localStorage.todoList;
  return JSON.parse(s);
};
// 返回自己在父元素的下标
var indexOfElement = function (element) {
  var parent = element.parentElement;
  for (var i = 0; i < parent.children.length; i++) {
    var e = parent.children[i];
    if (e === element) return i;
  }
};
// 初始化
var initTodos = function () {
  todoList = loadTodos();
  for (let i = 0; i < todoList.length; i++) {
    var todo = todoList[i];
    insertTodo(todo);
  }
};
//变量
var todoList = [];
var todoContainer = document.querySelector("#id-todo-container");
var addButton = document.querySelector("#id-button-add");

// 入口
var __main__ = function () {
  bindEvents();
  initTodos();
};

__main__();