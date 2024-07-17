import { ModeToggle } from "~/components/ui/modetoggle";

export default function TopNav() {
  return (
    <nav className="border-secondary flex flex-row justify-between border-b p-4 text-xl font-bold">
      <div className="my-auto select-none hover:cursor-pointer">
        <span className="text-blue-600">Expense</span>Tracker
      </div>
      <div className="flex flex-row gap-4">
        <ModeToggle />
        <div className="m-auto select-none text-lg font-semibold hover:cursor-pointer hover:underline">
          Sign In
        </div>
      </div>
    </nav>
  );
}
