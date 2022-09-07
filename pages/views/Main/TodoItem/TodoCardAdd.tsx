import { useState } from "react";
import { useRecoilState } from "recoil";
import { openAddTodoModal } from "../../../recoil/openAddTodoModal";
import AddTodoModal from "../Modal/AddTodoModal";

function TodoCardAdd() {

    const [openModalAddTodo, setOpenModalAddTodo] = useRecoilState(openAddTodoModal);
    const onAddTodoClick = () => {
        setOpenModalAddTodo(true);
    }

    return (
        <>
            <div className="px-2 py-2 w-full h-full bg-blue-200 rounded-lg border border-blue-200 shadow-xl dark:bg-blue-800 dark:border-blue-700">
                <button className="w-full h-full rounded bg-white flex justify-center items-center py-2" type="button" onClick={onAddTodoClick}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18m9-9H3" />
                    </svg>
                </button>
            </div>

            <AddTodoModal/>
        </>
    )
}

export default TodoCardAdd;