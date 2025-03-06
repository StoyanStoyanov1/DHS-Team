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
  } from "@/components/ui/dropdown-menu"
  
  export default function Menu() {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">Menu</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>example@email.com</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
            <BookOpen />
            <span>My Books</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <BookHeart  />
              <span>Favorite Books</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Bookmark />
              <span>Favorite Genres</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Plus />
                <span>Create</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem>
                    <Bookmark />
                    <span>Genre</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Pen />
                    <span>Author</span>
                  </DropdownMenuItem>
                 
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuItem>
              <Clock />
              <span>Pending books</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <AlertTriangle />
              <span>Reported Issues</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Users />
            <span>Users</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <LifeBuoy />
            <span>Support</span>
          </DropdownMenuItem>
         
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Settings />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <LogOut />
            <span>Log out</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <LogIn />
            <span>Log in</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
  