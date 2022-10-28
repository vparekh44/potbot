import { useTheme } from "next-themes";


export default function Home() {
  const { theme, setTheme } = useTheme()

  
  return (
    <div className="flex items-center justify-center h-screen flex-col gap-4">
      <h1 className="text-primary text-5xl">HELLO FROM TAILWIND</h1>
      <button className="btn btn-active btn-secondary" onClick={() => setTheme('dark')}>Dark Mode</button>
      <button className="btn btn-active btn-secondary" onClick={() => setTheme('light')}>Light Mode</button>
    </div>
  );
}
