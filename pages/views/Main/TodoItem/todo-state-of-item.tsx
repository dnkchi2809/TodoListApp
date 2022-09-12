import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";
import { useRecoilState } from "recoil";
import { selectStateOfItem } from "../../../../Recoil/select-state-of-item";

const state = [
  { name: "Todo" },
  { name: "In progess" },
  { name: "Pending" },
  { name: "Done" },
];

function TodoStateOfItem() {
  const [selectedState, setSelectedState] = useRecoilState(selectStateOfItem);

  return (
    <>
      <div className="flex mb-2">
        <div className="flex justify-center items-center text-gray-600 text-blue-500 mr-5">
          State:
        </div>
        <div className="flex flex-wrap">
          <Listbox value={selectedState} onChange={setSelectedState}>
            <div className="relative mt-1 w-40">
              <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                <span className="block truncate">{selectedState.name}</span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <SelectorIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </span>
              </Listbox.Button>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {state.map((state, stateIndex) => (
                    <Listbox.Option
                      key={stateIndex}
                      className={({ active }) =>
                        `relative cursor-default select-none py-2 pl-10 pr-4 ${
                          active
                            ? "bg-amber-100 text-amber-900"
                            : "text-gray-900"
                        }`
                      }
                      value={state}
                    >
                      {(selectedState) => (
                        <>
                          <span
                            className={`block truncate ${
                              selectedState ? "font-medium" : "font-normal"
                            }`}
                          >
                            {state.name}
                          </span>
                          {selectedState ? (
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                              <CheckIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>
        </div>
      </div>
    </>
  );
}

export default TodoStateOfItem;
