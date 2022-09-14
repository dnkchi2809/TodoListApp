import React, { useEffect, useState, Fragment, useRef } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { selectAllItems } from "../../../recoil/select-all-items";
import { selectArrayItems } from "../../../recoil/select-many-items";
import TodoCard from "./todo-item/todo-card";
import TodoCardAdd from "./todo-item/todo-card-add";
import TodoState from "./todo-item/todo-state";
import { Transition } from "@headlessui/react";
import { useTimeoutFn } from "react-use";
import { selectState } from "../../../recoil/select-state";
import { pageNavigate } from "../../../recoil/page-navigate";
import { todoLocalStorageChange } from "../../../recoil/todo-localstorage-change";

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
  const [todoStorageChange, setTodoStorageChange] = useRecoilState(
    todoLocalStorageChange
  );

  const [todoListStorage, setTodoListStorage] = useState([]);
  const [selectAll, setSelectAll] = useRecoilState(selectAllItems);
  const setArrayItems = useSetRecoilState(selectArrayItems);

  const [selectedState] = useRecoilState(selectState);

  const setSelectedPage = useSetRecoilState(pageNavigate);

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
  }, [setSelectedPage]);

  useEffect(() => {
    setIsShowing(false);
    resetIsShowing();
  }, [resetIsShowing]);

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

  const [storage, setStorage] = useState([]);

  useEffect(() => {
    setStorage(JSON.parse(localStorage.getItem("todoList") || "[]"));
  }, []);

  useEffect(() => {
    if (todoStorageChange) {
      setStorage(JSON.parse(localStorage.getItem("todoList") || "[]"));
      setTodoStorageChange(false);
    }
  }, [setTodoStorageChange, todoStorageChange]);

  useEffect(() => {
    // const storage = JSON.parse(localStorage.getItem("todoList") || "[]");
    if (selectedState.name == "All") {
      setTodoListStorage(storage);
    } else {
      const filterTodoState = storage.filter((todo: Todo) => {
        return todo.state == selectedState.name;
      });
      setTodoListStorage(filterTodoState);
    }
  }, [selectedState.name, storage]);

  useEffect(() => {
    setTotalPage(Math.ceil(todoListStorage.length / limit));
    setRows(todoListStorage.slice((page - 1) * limit, page * limit));
  }, [page, todoListStorage]);

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
