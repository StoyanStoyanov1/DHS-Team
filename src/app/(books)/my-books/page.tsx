import BookGrid from "@/components/books/BookGrid";
import { books } from "@/utils/dataBooksTest";

export default function MyBooks() {
  return (
    <> 
      <BookGrid books={books}/>
    </>
  );
}
