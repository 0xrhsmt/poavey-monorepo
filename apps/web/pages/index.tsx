import Image from 'next/image'

export default function IndexPage() {
  return (
    <div>
      <Image
      src="/logo.png"
      alt="Picture of the author"
      width={750}
      height={111.375}
    />
    </div>
  );
}
