import React, { useEffect, useState, Fragment, useRef } from "react";
import { useRecoilState } from "recoil";
import { selectAllItems } from "../../../Recoil/select-all-items";
import { selectArrayItems } from "../../../Recoil/select-many-items";
import TodoCard from "./TodoItem/todo-card";
import TodoCardAdd from "./TodoItem/todo-card-add";
import TodoState from "./TodoItem/todo-state";
import { Transition } from "@headlessui/react";
import { useTimeoutFn } from "react-use";
import { selectState } from "../../../Recoil/select-state";
import { pageNavigate } from "../../../Recoil/page-navigate";

interface Todo {
  id: number;
  label: string;
  detail: string;
  createDate: string;
  state: string;
  folderId: number;
  history: {
    historyId: number;
    updateDate: string;
  }[];
}

function MainBody() {
  const [todoListStorage, setTodoListStorage] = useState([]);
  const [selectAll, setSelectAll] = useRecoilState(selectAllItems);
  const [arrayItems, setArrayItems] = useRecoilState(selectArrayItems);

  const [selectedState] = useRecoilState(selectState);

  const [, setSelectedPage] = useRecoilState(pageNavigate);

  const [isShowing, setIsShowing] = useState(false);
  const [, , resetIsShowing] = useTimeoutFn(() => setIsShowing(true), 500);

  const [inputSelectAll, setInputSelectAll] = useState(false);

  const selectAllInput = useRef<HTMLInputElement>(null);

  const limit = 10;

  const [page, setPage] = useState(1);

  const [totalPage, setTotalPage] = useState(0);

  const [rows, setRows] = useState([]);

  const onSelectAllClick = () => {
    setInputSelectAll(!inputSelectAll);
    if (selectAllInput.current?.checked) {
      setSelectAll(true);
    } else {
      setArrayItems([]);
      setSelectAll(false);
    }
  };

  const onWindowWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    const y = event.deltaY;
    if (y > 0) {
      if (page < totalPage) {
        setPage(page + 1);
      }
    } else {
      if (page > 1) {
        setPage(page - 1);
      }
    }
  };

  useEffect(() => {
    setSelectedPage("home");
  });

  useEffect(() => {
    setIsShowing(false);
    resetIsShowing();
  }, [page, resetIsShowing, selectedState]);

  useEffect(() => {
    if (selectAll) {
      const newArrayItems: number[] = [];
      todoListStorage.map((todoItem: Todo) => {
        newArrayItems.push(Number(todoItem.id));
      });
      setArrayItems(newArrayItems);
    }
  }, [selectAll, setArrayItems, todoListStorage]);

  useEffect(() => {
    if (!selectAll) {
      setInputSelectAll(false);
    }
  }, [selectAll]);

  useEffect(() => {
    const folderListStorage = JSON.parse(
      localStorage.getItem("folderList") || "[]"
    );
    if (folderListStorage.length == 0) {
      localStorage.setItem(
        "folderList",
        JSON.stringify([
          {
            id: 0,
            name: "Default Folder",
            todoItemArray: [],
            createDate: new Date().toISOString().slice(0, 10),
          },
        ])
      );
    }
  }, []);

  useEffect(() => {
    if (selectedState.name == "All") {
      setTodoListStorage(JSON.parse(localStorage.getItem("todoList") || "[]"));
    } else {
      const todoListStorage = JSON.parse(
        localStorage.getItem("todoList") || "[]"
      );
      const filterTodoState = todoListStorage.filter((todo: Todo) => {
        return todo.state == selectedState.name;
      });
      setTodoListStorage(filterTodoState);
    }
  }, [todoListStorage, selectAll, arrayItems, selectedState.name]);

  useEffect(() => {
    setTotalPage(Math.ceil(todoListStorage.length / limit));
    setRows(todoListStorage.slice((page - 1) * limit, page * limit));
  }, [todoListStorage, page]);

  return (
    <div>
      <div>
        <TodoState />
      </div>
      <div className="flex padding-class">
        <div className="w-1/2 flex items-center">
          <input
            ref={selectAllInput}
            id="idSelectAll"
            checked={inputSelectAll}
            type="checkbox"
            onChange={onSelectAllClick}
            className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />{" "}
          &nbsp; Select All
        </div>
        <div className="w-1/2 flex justify-end">
          <div className="w-14">
            <TodoCardAdd />
          </div>
        </div>
      </div>

      <Transition
        as={Fragment}
        show={isShowing}
        enter="transform transition duration-[1000ms] linear"
        enterFrom="opacity-0 scale-50"
        enterTo="opacity-100 scale-100"
        leave="transform duration-200 transition ease-in-out"
        leaveFrom="opacity-100 scale-100 "
        leaveTo="opacity-0 scale-50 "
      >
        <div className="flex flex-wrap" onWheel={onWindowWheel}>
          {rows.length > 0
            ? rows.map((todoItem: Todo, index) => {
                return (
                  <>
                    <div className="col-todo-list" key={"todoCardItem" + index}>
                      <TodoCard {...todoItem} />
                    </div>
                  </>
                );
              })
            : null}
        </div>
      </Transition>
    </div>
  );
}

export default MainBody;
