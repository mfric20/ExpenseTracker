"use client";

import { XMarkIcon } from "@heroicons/react/24/outline";

interface ChildComponentProps {
    setToggleHamburgerMenu: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function MobileNavBar({
    setToggleHamburgerMenu,
}: ChildComponentProps) {
    return (
        <div className="py-10 px-10 flex flex-col">
            <div className="flex justify-end">
                <XMarkIcon
                    onClick={() => setToggleHamburgerMenu(false)}
                    className="w-10 hover:cursor-pointer"
                />
            </div>
        </div>
    );
}
