import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Book = {
  id: number;
  title: string;
  author: string;
  year: number;
  image: string;
};

interface BookGridProps {
  books: Book[];
}

export default function BookGrid({ books }: BookGridProps) {
  return (
    <div className="flex justify-center mt-4"> 
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {books.map((book) => (
          <Card
          key={book.id}
          className="shadow-md rounded-lg overflow-hidden transform transition-transform hover:scale-105 cursor-pointer w-[150px] h-[230px] p-0"
        >
        
            <CardHeader className="p-0">
              <div className="relative w-full aspect-[1] border border-gray-300 rounded-md overflow-hidden">
                <img
                  src={book.image}
                  alt={book.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            </CardHeader>
            <CardContent className="p-1 text-center">
              <CardTitle className="text-[10px] font-medium">
                {book.title}
              </CardTitle>
              <p className="text-[9px] text-gray-500">{book.author}</p>
              <p className="text-[8px] text-gray-400">{book.year}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
