/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment, useEffect, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";
import { useRecoilState, useRecoilValue } from "recoil";
import { selectState } from "../../../../recoil/select-state";
import { useTranslation } from "react-i18next";
import { changeLanguage } from "../../../../recoil/change-language";

function TodoState() {
  const { t } = useTranslation();

  const state = [
    { name: t("content.All") },
    { name: t("content.Todo") },
    { name: t("content.In progress") },
    { name: t("content.Pending") },
    { name: t("content.Done") },
  ];

  const [stateValue, setStateValue] = useState(state[0]);
  const [selectedState, setSelectedState] = useRecoilState(selectState);
  const language = useRecoilValue(changeLanguage);

  useEffect(() => {
    setStateValue(state[0]);
  }, [language]);

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
  }, [selectedState]);

  useEffect(() => {
    setStateValue({ name: t(`content.${selectedState.name}`) });
  }, [selectedState]);

  return (
    <>
      <div className="flex justify-end items-end padding-class mb-2">
        <div className="flex flex-wrap justify-end items-end">
          <Listbox value={selectedState} onChange={setSelectedState}>
            <div className="relative mt-1 w-40">
              <Listbox.Button className="relative w-full cursor-default shadow-md rounded-lg bg-white py-2 pl-3 pr-10 text-left focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
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
                              selectedState ? "font-normal" : "font-normal"
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

export default TodoState;
