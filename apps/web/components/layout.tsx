import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import Link from "next/link";

export default function Layout({ children }) {
  return (
    <>
      <header className="absolute mb-auto flex flex-wrap sm:justify-start sm:flex-nowrap z-50 w-full text-sm py-4">
        <nav
          className="w-full px-4 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8"
          aria-label="Global"
        >
          <div className="flex items-center justify-between">
            <Link href="/">
              <Image
                src="/icon.png"
                alt="Picture of the author"
                width={24}
                height={24}
              />
            </Link>
          </div>
          <div
            id="navbar-collapse-with-animation"
            className="hs-collapse hidden overflow-hidden transition-all duration-300 basis-full grow sm:block"
          >
            <div className="flex flex-col gap-5 mt-5 sm:flex-row sm:items-center sm:justify-end sm:mt-0 sm:pl-5">
              <ConnectButton showBalance={false} label="Connect" />
            </div>
          </div>
        </nav>
      </header>

      <div className="max-w-[70rem] flex flex-col items-center mx-auto w-full h-[100vh] pt-[72px]">
        <main id="content" role="main" className="w-full h-full">
          {children}
        </main>
      </div>
    </>
  );
}
