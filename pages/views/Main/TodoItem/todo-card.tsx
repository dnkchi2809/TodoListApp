import { useRouter } from "next/router";
import { useEffect, useState, Fragment, useRef } from "react";
import { useRecoilState } from "recoil";
import { openDeleteTodoModal } from "../../../../Recoil/open-delete-todo-modal";
import { openEditTodoModal } from "../../../../Recoil/open-edit-todo-modal";
import { selectAllItems } from "../../../../Recoil/select-allI-iems";
import { selectArrayItems } from "../../../../Recoil/select-many-items";
import { todoItemSelect } from "../../../../Recoil/todo-item-select";
import DeleteTodoModal from "../Modal/delete-todo-modal";
import EditTodoModal from "../Modal/edit-todo-modal";
import { Transition } from '@headlessui/react';
import { useTimeoutFn } from 'react-use';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

interface Todo {
    id: number,
    label: string,
    detail: string,
    createDate: string,
    state: string,
    folderId: number,
    history: {
        historyId: number,
        updateDate: string
    }[]
};

function TodoCard(props: Todo) {
    const router = useRouter();

    const [openModalEditTodo, setOpenModalEditTodo] = useRecoilState(openEditTodoModal);
    const [openModalDeleteTodo, setOpenModalDeleteTodo] = useRecoilState(openDeleteTodoModal);

    const [selectItem, setSelectItem] = useRecoilState(todoItemSelect as any);
    const [selectAll, setSelectAll] = useRecoilState(selectAllItems);
    const [arrayItems, setArrayItems] = useRecoilState(selectArrayItems);    

    const [labelValue, setLabelValue] = useState(props.label)

    let [isShowing, setIsShowing] = useState(false);
    let [, , resetIsShowing] = useTimeoutFn(() => setIsShowing(true), 500);

    const [checkedSkeleton, setCheckedSkeleton] = useState(false);

    const inputSelectTodo = useRef<HTMLInputElement>(null); 
    const [checkedInput, setCheckedInput] = useState(false)

    const onEditTodoClick = () => {
        setSelectItem(props);
        setOpenModalEditTodo(true);
    }

    const onDeleteTodoClick = () => {
        setSelectItem(props);
        setOpenModalDeleteTodo(true);
    }

    const onSelectTodoItemClick = () => {
        router.push({
            pathname: '/todo/[todoItemId]',
            query: { todoItemId: props.id },
        }).then(() => {
            router.reload();
        })
    }

    const onSelectManyItemClick = () => {
        setSelectAll(false);

        setCheckedInput(!checkedInput);

        if (inputSelectTodo.current?.checked) {
            let newArrayTodo = arrayItems;
            newArrayTodo = [...arrayItems, Number(inputSelectTodo.current?.value)];
            setArrayItems(newArrayTodo);
        }
        else {
            let newArrayItems = [];
            newArrayItems = arrayItems.filter((element) => {
                return element !== Number(inputSelectTodo.current?.value)
            })
            setArrayItems(newArrayItems);
        }
    }

    useEffect(() => {
        setIsShowing(false);
        resetIsShowing();
    }, []);

    useEffect(() => {
        setCheckedSkeleton(!checkedSkeleton);
        if(labelValue.length > 15){
            setLabelValue(labelValue.substring(0,15) + "...");
        }    
    }, [isShowing])

    useEffect(() => {
        if (isShowing) {
            if (selectAll) {
                setCheckedInput(true);
            }
            else if (arrayItems.length == 0) {
                setCheckedInput(false);
            }
        }
    }, [selectAll])

    return (
        <>
            {
                !checkedSkeleton
                    ?
                    <Transition
                        as={Fragment}
                        show={isShowing}
                        enter="transform transition duration-[400ms] linear"
                        enterFrom="opacity-0 scale-50"
                        enterTo="opacity-100 scale-100"
                        leave="transform duration-200 transition ease-in-out"
                        leaveFrom="opacity-100 scale-100 "
                        leaveTo="opacity-0 scale-50 "
                    >
                        <div className="px-3 py-4 w-full h-full bg-blue-200 rounded-lg border border-blue-200 shadow-xl dark:bg-blue-800 dark:border-blue-700">
                            <div className="mb-3 flex ">
                                <div className="w-4/5" onClick={onSelectTodoItemClick}>
                                    <p className="text-lg font-medium">{labelValue}</p>
                                </div>
                                <div className="w-1/5 flex justify-end">
                                    <input ref={inputSelectTodo} id={String(props.id)} type="checkbox" checked={checkedInput} value={props.id} onChange={onSelectManyItemClick} className="selectItemClass w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                </div>
                            </div>
                            <div className="mb-3">
                                <textarea value={props.detail} readOnly className="w-full rounded-lg p-4"></textarea>
                            </div>
                            <div className="flex">
                                <div className="w-1/2">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6" onClick={onEditTodoClick}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                                    </svg>
                                </div>
                                <div className="w-1/2 flex justify-end">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6" onClick={onDeleteTodoClick}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </Transition>
                    :
                    <Skeleton className="w-full h-40 rounded-lg" />
            }

            <EditTodoModal />
            <DeleteTodoModal />
        </>
    )
}

export default TodoCard