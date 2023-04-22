import Image from "next/image";
import Link from "next/link";
import { ChevronRightIcon } from '@heroicons/react/24/solid'


export default function IndexPage() {
  return (
    <div className="flex flex-col m-auto justify-center items-center w-full h-full">
      <div className="flex flex-col items-center justify-center max-w-[60rem] text-center py-10 px-4 sm:px-6 lg:px-8 mt-[-7%]">
        <Image
          src="/logo.png"
          alt="Picture of the author"
          width={750}
          height={111.375}
        />
        <p className="mt-3 text-2xl text-gray-400">
          POAP + SURVEY = POAVEY
        </p>
        <div className="mt-5 flex flex-col justify-center items-center gap-2 sm:flex-row sm:gap-3">
          <Link
            href={"/events/new"}
            className="w-full sm:w-auto inline-flex justify-center items-center gap-x-3 text-center border-2 text-primary border-primary shadow-sm text-2xl text-fuchsia-700 hover:text-accent hover:border-accent focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-accent transition py-2.5 px-6"
          >
            <ChevronRightIcon className="w-5 h-5"/>Let's do Surveys
          </Link>
        </div>
      </div>
    </div>
  );
}
