import { useState } from "react";
import { useRecoilState } from "recoil";
import { openDeleteTodoModal } from "../../../recoil/openDeleteTodoModal";
import { openEditTodoModal } from "../../../recoil/openEditTodoModal";
import { todoItemSelect } from "../../../recoil/todoItemSelect";
import DeleteTodoModal from "../Modal/DeleteTodoModal";
import EditTodoModal from "../Modal/EditTodoModal";

function TodoCard(props) {
    const [openModalEditTodo, setOpenModalEditTodo] = useRecoilState(openEditTodoModal);
    const [openModalDeleteTodo, setOpenModalDeleteTodo] = useRecoilState(openDeleteTodoModal);

    const [selectItem, setSelectItem] = useRecoilState(todoItemSelect);

    const onEditTodoClick = () => {
        setSelectItem(props.item);
        setOpenModalEditTodo(true);
    }

    const onDeleteTodoClick = () => {
        setSelectItem(props.item);
        setOpenModalDeleteTodo(true);
    }
    return (
        <>
            <div className="px-3 py-4 w-full h-40 bg-blue-200 rounded-lg border border-blue-200 shadow-md dark:bg-blue-800 dark:border-blue-700">
                <div className="mb-3">
                    <p id={props.item.id} className="text-center text-lg font-medium">{props.item.label}</p>
                </div>
                <div className="mb-3">
                    <input value={props.item.detail} readOnly className="w-full rounded-lg p-4"></input>
                </div>
                <div className="flex">
                    <div className="w-1/2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6" onClick={onEditTodoClick}>
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

            <EditTodoModal/>
            <DeleteTodoModal/>
        </>
    )
}

export default TodoCard