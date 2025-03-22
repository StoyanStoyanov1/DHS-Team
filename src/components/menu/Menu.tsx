import {
    LifeBuoy,
    LogOut,
    Plus,
    Settings,
    Users,
    Scissors,
    Calendar,
    Clock,
    AlertTriangle,
    CreditCard,
    CalendarCheck,
    UserCog,
    Store,
    User,
    Bell,
    Heart,
    History,
    HelpCircle,
    ChevronRight,
  } from "lucide-react"
  
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";

  import { useRouter } from "next/navigation"; 

  import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
  import { faUserCircle } from '@fortawesome/free-solid-svg-icons';

  import routes from "@/utils/routes";
  
  export default function Menu() {
    const router = useRouter();

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="group relative inline-flex items-center justify-center rounded-full w-10 h-10 bg-gray-100 hover:bg-gray-200 transition-all duration-300">
            <FontAwesomeIcon icon={faUserCircle} size="2x" style={{ color: '#4CAF50' }} className="transform group-hover:scale-110 transition-transform duration-300" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-primary"></span>
            </span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-72" align="end">
          {/* User Info */}
          <div className="flex items-center space-x-4 p-4 border-b">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center transform hover:scale-110 transition-transform duration-300">
              <FontAwesomeIcon icon={faUserCircle} size="2x" style={{ color: '#4CAF50' }} />
            </div>
            <div>
              <p className="text-sm font-medium">Max Mustermann</p>
              <p className="text-xs text-gray-500">max@example.com</p>
            </div>
          </div>

          {/* Quick Actions */}
          <DropdownMenuGroup>
            <DropdownMenuItem className="group flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors duration-300">
              <div className="flex items-center">
                <Bell className="mr-2 h-4 w-4 transform group-hover:scale-110 transition-transform duration-300" />
                <span>Benachrichtigungen</span>
              </div>
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-white transform group-hover:scale-110 transition-transform duration-300">3</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="group flex items-center cursor-pointer hover:bg-gray-50 transition-colors duration-300">
              <Heart className="mr-2 h-4 w-4 transform group-hover:scale-110 transition-transform duration-300" />
              <span>Favoriten</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="group flex items-center cursor-pointer hover:bg-gray-50 transition-colors duration-300">
              <History className="mr-2 h-4 w-4 transform group-hover:scale-110 transition-transform duration-300" />
              <span>Verlauf</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          {/* Main Navigation */}
          <DropdownMenuGroup>
            <DropdownMenuItem className="group flex items-center cursor-pointer hover:bg-gray-50 transition-colors duration-300">
              <Calendar className="mr-2 h-4 w-4 transform group-hover:scale-110 transition-transform duration-300" />
              <span>Meine Termine</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="group flex items-center cursor-pointer hover:bg-gray-50 transition-colors duration-300">
              <Scissors className="mr-2 h-4 w-4 transform group-hover:scale-110 transition-transform duration-300" />
              <span>Meine Behandlungen</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="group flex items-center cursor-pointer hover:bg-gray-50 transition-colors duration-300">
              <Store className="mr-2 h-4 w-4 transform group-hover:scale-110 transition-transform duration-300" />
              <span>Meine Produkte</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          {/* Settings & Help */}
          <DropdownMenuGroup>
            <DropdownMenuItem className="group flex items-center cursor-pointer hover:bg-gray-50 transition-colors duration-300">
              <Settings className="mr-2 h-4 w-4 transform group-hover:scale-110 transition-transform duration-300" />
              <span>Einstellungen</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="group flex items-center cursor-pointer hover:bg-gray-50 transition-colors duration-300">
              <HelpCircle className="mr-2 h-4 w-4 transform group-hover:scale-110 transition-transform duration-300" />
              <span>Hilfe & Support</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          {/* Logout */}
          <DropdownMenuItem className="group flex items-center text-red-600 cursor-pointer hover:bg-red-50 transition-colors duration-300">
            <LogOut className="mr-2 h-4 w-4 transform group-hover:scale-110 transition-transform duration-300" />
            <span>Abmelden</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
  