import { useRouter } from "next/router";
import { useEffect, useState, Fragment } from "react";
import { useRecoilState } from "recoil";
import { openDeleteTodoModal } from "../../../recoil/openDeleteTodoModal";
import { openEditTodoModal } from "../../../recoil/openEditTodoModal";
import { selectAllItems } from "../../../recoil/selectAllItems";
import { selectArrayItems } from "../../../recoil/selectManyItems";
import { todoItemSelect } from "../../../recoil/todoItemSelect";
import DeleteTodoModal from "../Modal/DeleteTodoModal";
import EditTodoModal from "../Modal/EditTodoModal";
import { Transition } from '@headlessui/react';
import { useTimeoutFn } from 'react-use';


function TodoCard(props) {
    const router = useRouter();

    const [openModalEditTodo, setOpenModalEditTodo] = useRecoilState(openEditTodoModal);
    const [openModalDeleteTodo, setOpenModalDeleteTodo] = useRecoilState(openDeleteTodoModal);

    const [selectItem, setSelectItem] = useRecoilState(todoItemSelect);
    const [selectAll, setSelectAll] = useRecoilState(selectAllItems);
    const [arrayItems, setArrayItems] = useRecoilState(selectArrayItems);

    let [isShowing, setIsShowing] = useState(false);
    let [, , resetIsShowing] = useTimeoutFn(() => setIsShowing(true), 500);

    const onEditTodoClick = () => {
        setSelectItem(props.item);
        setOpenModalEditTodo(true);
    }

    const onDeleteTodoClick = () => {
        setSelectItem(props.item);
        setOpenModalDeleteTodo(true);
    }

    const onSelectTodoItemClick = () => {
        router.push({
            pathname: '/todo/[todoItemId]',
            query: { todoItemId: props.item.id },
        }).then(() => {
            router.reload();
        })
    }

    const onSelectManyItemClick = () => {
        setSelectAll(false);

        const item = document.getElementById(props.item.id)

        if (item.checked) {
            setArrayItems([...arrayItems, item.value])
        }
        else {
            let newArrayItems = [];
            newArrayItems = arrayItems.filter((element) => {
                return element !== item.value
            })
            setArrayItems(newArrayItems);
        }
    }

    useEffect(() => {
        setIsShowing(false)
        resetIsShowing()
    }, []);

    useEffect(() => {
        if (isShowing) {
            if (selectAll) {
                document.getElementById(props.item.id).checked = true;
            }
            else if (arrayItems.length == 0) {
                document.getElementById(props.item.id).checked = false;
            }
        }
    }, [selectAll])

    return (
        <>
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
                <div className="px-3 py-4 w-full h-40 bg-blue-200 rounded-lg border border-blue-200 shadow-md dark:bg-blue-800 dark:border-blue-700">
                    <div className="mb-3 flex">
                        <div className="w-4/5" onClick={onSelectTodoItemClick}>
                            <p className="text-lg font-medium">{props.item.label}</p>
                        </div>
                        <div className="w-1/5 flex justify-end">
                            <input id={props.item.id} type="checkbox" value={props.item.id} onClick={onSelectManyItemClick} className="selectItemClass w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                        </div>
                    </div>
                    <div className="mb-3">
                        <input value={props.item.detail} readOnly className="w-full rounded-lg p-4"></input>
                    </div>
                    <div className="flex">
                        <div className="w-1/2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6" onClick={onEditTodoClick}>
                                <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                            </svg>
                        </div>
                        <div className="w-1/2 flex justify-end">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6" onClick={() => onDeleteTodoClick(props.item.detail)}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                        </div>
                    </div>
                </div>
            </Transition>

            <EditTodoModal />
            <DeleteTodoModal />
        </>
    )
}

export default TodoCard