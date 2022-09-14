import { Fragment, useEffect, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";
import { useRecoilState } from "recoil";
import { selectStateOfItem } from "../../../../recoil/select-state-of-item";
import { useTranslation } from "react-i18next";

function TodoStateOfItem() {
  const { t } = useTranslation();

  const state = [
    { name: t("content.Todo") },
    { name: t("content.In progress") },
    { name: t("content.Pending") },
    { name: t("content.Done") },
  ];

  const [stateValue, setStateValue] = useState(state[0]);
  const [selectedState, setSelectedState] = useRecoilState(selectStateOfItem);

  useEffect(() => {
    switch (selectedState.name) {
      case "Tất cả": {
        setSelectedState({ name: "All" });
        break;
      }
      case "Cần làm": {
        setSelectedState({ name: "Todo" });
        break;
      }
      case "Đang thực hiện": {
        setSelectedState({ name: "In progress" });
        break;
      }
      case "Đang đợi": {
        setSelectedState({ name: "Pending" });
        break;
      }
      case "Hoàn thành": {
        setSelectedState({ name: "Done" });
        break;
      }
    }
  }, [selectedState, setSelectedState]);

  useEffect(() => {
    setStateValue({ name: t(`content.${selectedState.name}`) });
  }, [t, selectedState.name]);

  return (
    <>
      <div className="flex mb-2">
        <div className="flex justify-center items-center text-gray-600 text-blue-500 mr-5">
          {t("content.State")}:
        </div>
        <div className="flex flex-wrap">
          <Listbox value={selectedState} onChange={setSelectedState}>
            <div className="relative mt-1 w-40">
              <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                <span className="block truncate">{t(stateValue.name)}</span>
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
                  {state.map((stateItem, stateIndex) => (
                    <Listbox.Option
                      key={stateIndex}
                      className={({ active }) =>
                        `relative cursor-default select-none py-2 pl-10 pr-4 ${
                          active
                            ? "bg-amber-100 text-amber-900"
                            : "text-gray-900"
                        }`
                      }
                      value={stateItem}
                    >
                      {(selectedState) => (
                        <>
                          <span
                            className={`block truncate ${
                              selectedState ? "font-medium" : "font-normal"
                            }`}
                          >
                            {stateItem.name}
                          </span>
                          {stateItem.name == stateValue.name ? (
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
