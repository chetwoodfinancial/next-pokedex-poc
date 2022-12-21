// components/layout.js
export default function Layout({ children }) {
  return (
    <>
      <main className="w-screen h-screen">
        <div className="flex flex-row justify-center pt-20">{children}</div>
      </main>
    </>
  );
}
