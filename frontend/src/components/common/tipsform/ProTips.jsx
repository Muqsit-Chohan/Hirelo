import { Lightbulb } from "lucide-react";

export default function ProTip({ title, message }) {
  return (
    <div className="flex items-start p-2 rounded-xl bg-gradient-to-r from-emerald-50 to-emerald-100 shadow-md border border-emerald-200">
      <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-r from-green-600 to-emerald-400 text-white shadow">
        <Lightbulb className="transition-transform hover:scale-[1.3] duration-300" />
      </div>
      <div className="ml-4">
        <h3 className="text-md font-bold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-600">{message}</p>
      </div>
    </div>
  );
}
