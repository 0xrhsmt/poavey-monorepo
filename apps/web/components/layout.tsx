import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Layout({ children }) {
  return (
    <>
      <ConnectButton showBalance={false} label="Connect" />
      <main>{children}</main>
    </>
  );
}
