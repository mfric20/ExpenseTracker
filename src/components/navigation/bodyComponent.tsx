"use client";

import { useState } from "react";
import Providers from "~/app/providers";
import MobileNavBar from "./mobileNavBar";
import TopNav from "./topnav";
import SideNavBar from "./sideNavBar";

interface ChildComponentProps {
    children: React.ReactNode;
}

export default function BodyComponent({ children }: ChildComponentProps) {
    const [toggleHamburgerMenu, setToggleHamburgerMenu] =
        useState<boolean>(false);

    return (
        <div>
            <Providers>
                {toggleHamburgerMenu ? (
                    <MobileNavBar
                        setToggleHamburgerMenu={setToggleHamburgerMenu}
                    />
                ) : (
                    <>
                        <TopNav
                            setToggleHamburgerMenu={setToggleHamburgerMenu}
                        />
                        <div className="flex flex-row gap-0 md:gap-0">
                            <SideNavBar />
                            {children}
                        </div>
                    </>
                )}
            </Providers>
        </div>
    );
}
