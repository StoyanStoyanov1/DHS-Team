import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SearchBar() {
  return (
    <div className="flex items-center w-full sm:w-1/3 border rounded-full overflow-hidden shadow-lg bg-white">
      <select className="w-1/4 p-3 bg-gray-50 border-r text-gray-600 rounded-l-full focus:outline-none focus:ring-2 focus:ring-gray-200">
        <option>All</option>
      </select>
      <Input
        placeholder="Search products..."
        className="flex-1 p-3 text-gray-800 border-none rounded-none focus:outline-none focus:ring-2 focus:ring-gray-200"
      />
      <Button className="bg-green-600 text-white px-6 py-3 rounded-r-full font-medium shadow-lg hover:bg-green-700 transition transform active:scale-95">
        Search
      </Button>
    </div>
  );
}
