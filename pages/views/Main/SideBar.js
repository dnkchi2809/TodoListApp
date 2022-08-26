function SideBar() {
    return (
        <>
            <div className="h-full w-full shadow-md bg-white">
                <ul className="relative">
                    <li className="relative">
                        <a className="flex items-center text-sm py-4 px-6 h-12 overflow-hidden text-gray-700 text-ellipsis whitespace-nowrap rounded hover:text-gray-900 hover:bg-gray-100 transition duration-300 ease-in-out" href="#!" data-mdb-ripple="true" data-mdb-ripple-color="dark">
                            <i className="fa-solid fa-house"></i>
                            <span>Sidenav link 1</span>
                        </a>
                    </li>
                    <li className="relative">
                        <a className="flex items-center text-sm py-4 px-6 h-12 overflow-hidden text-gray-700 text-ellipsis whitespace-nowrap rounded hover:text-gray-900 hover:bg-gray-100 transition duration-300 ease-in-out" href="#!" data-mdb-ripple="true" data-mdb-ripple-color="dark">
                            <span>Sidenav link 2</span>
                        </a>
                    </li>
                    <li className="relative">
                        <a className="flex items-center text-sm py-4 px-6 h-12 overflow-hidden text-gray-700 text-ellipsis whitespace-nowrap rounded hover:text-gray-900 hover:bg-gray-100 transition duration-300 ease-in-out" href="#!" data-mdb-ripple="true" data-mdb-ripple-color="dark">
                            <span>Sidenav link 3</span>
                        </a>
                    </li>
                </ul>
            </div>
        </>
    )
}

export default SideBar;