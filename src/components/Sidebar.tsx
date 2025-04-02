import Image from "next/image";
import Link from "next/link";

import DottedSeparator from "./DottedSeparator";
import Navigation from "./Navigation";
import WorkspaceSwitcher from "./WorkspaceSwitcher";
import Projects from "./Projects";

const Sidebar = () => {
  return (
    <aside className="h-full bg-neutral-100 p-4 w-full">
      <Link href={"/"}>
        <Image src={"/logo.svg"} alt="Logo" width={164} height={48}></Image>
      </Link>
      <DottedSeparator className="my-4"></DottedSeparator>
      <WorkspaceSwitcher></WorkspaceSwitcher>
      <DottedSeparator className="my-4"></DottedSeparator>
      <Navigation></Navigation>
      <DottedSeparator className="my-4"></DottedSeparator>
      <Projects></Projects>
    </aside>
  );
};

export default Sidebar;
