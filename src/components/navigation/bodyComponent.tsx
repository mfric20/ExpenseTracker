"use client";

import { useState } from "react";
import Providers from "~/app/providers";
import MobileNavBar from "./mobileNavBar";
import TopNav from "./topnav";
import SideNavBar from "./sideNavBar";
import { useQuery } from "@tanstack/react-query";
import { Tuser } from "~/types/types";
import axios from "axios";
import ContentComponent from "./contentComponent";

interface ChildComponentProps {
    children: React.ReactNode;
}

export default function BodyComponent({ children }: ChildComponentProps) {
    const [toggleHamburgerMenu, setToggleHamburgerMenu] =
        useState<boolean>(false);

    return (
        <div className="min-h-screen">
            <Providers>
                {toggleHamburgerMenu ? (
                    <MobileNavBar
                        setToggleHamburgerMenu={setToggleHamburgerMenu}
                    />
                ) : (
                    <div className="min-h-screen">
                        <TopNav
                            setToggleHamburgerMenu={setToggleHamburgerMenu}
                        />
                        <ContentComponent children={children} />
                    </div>
                )}
            </Providers>
        </div>
    );
}
