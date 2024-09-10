"use client";

import { useState } from "react";
import Providers from "~/app/providers";
import MobileNavBar from "./mobileNavBar";
import TopNav from "./topnav";

interface ChildComponentProps {
    children: React.ReactNode;
}

export default function BodyComponent({ children }: ChildComponentProps) {
    const [toggleHamburgerMenu, setToggleHamburgerMenu] =
        useState<boolean>(false);

    return (
        <div>
            {toggleHamburgerMenu ? (
                <MobileNavBar setToggleHamburgerMenu={setToggleHamburgerMenu} />
            ) : (
                <>
                    <Providers>
                        <TopNav
                            setToggleHamburgerMenu={setToggleHamburgerMenu}
                        />

                        {children}
                    </Providers>
                </>
            )}
        </div>
    );
}
