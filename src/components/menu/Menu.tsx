import {
    LifeBuoy,
    LogOut,
    Plus,
    Settings,
    Users,
    BookOpen,
    BookHeart,
    Bookmark,
    Pen,
    Clock,
    AlertTriangle,
    LogIn,
    Clipboard 
  } from "lucide-react"
  
  import { Button } from "@/components/ui/button"
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";

  import { useLanguage } from "@/context/language/LanguageContext";

  import menuTranslate from "@/utils/translate/menuTranslate";
  
  export default function Menu() {
    const { language } = useLanguage();

    return (
      <DropdownMenu >
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="cursor-pointer">{menuTranslate[language].menu}</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>example@email.com</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup >
            <DropdownMenuItem >
            <BookOpen />
            <span>{menuTranslate[language].myBooks}</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <BookHeart  />
              <span>{menuTranslate[language].favoriteBooks}</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Bookmark />
              <span>{menuTranslate[language].favoriteGenres}</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Plus size={19} />
                <span style={{ marginLeft: "6px" }}>{menuTranslate[language].create}</span>
                </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem>
                    <Bookmark />
                    <span>{menuTranslate[language].genre}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Pen />
                    <span>{menuTranslate[language].author}</span>
                  </DropdownMenuItem>
                 
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuItem>
              <Clock />
              <span>{menuTranslate[language].pendingBooks}</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <AlertTriangle />
              <span>{menuTranslate[language].reportedIssues}</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Users />
            <span>{menuTranslate[language].users}</span>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Settings />
            <span>{menuTranslate[language].settings}</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <LifeBuoy />
            <span>{menuTranslate[language].support}</span>
          </DropdownMenuItem>
         
          <DropdownMenuItem>
            <LogOut />
            <span>{menuTranslate[language].logOut}</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <LogIn />
            <span>{menuTranslate[language].logIn}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
  