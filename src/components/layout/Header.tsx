import { BarChart3, ChevronDown, Menu, X } from "lucide-react";
import { Link, useLocation, matchPath } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { NewsletterPopover } from "../NewsletterPopover";
import { useScreenSize } from "@/hooks/useScreenSize";

export function Header() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const toggleMenu = useCallback(() => setMenuOpen((prev) => !prev), []);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const LanguageButtons = ({ className }: { className?: string }) => (
    <div className={cn("flex items-center gap-2", className)}>
      <button
        onClick={() => changeLanguage("en")}
        className={cn(i18n.language === "en" && "bg-black-1 rounded-full px-1")}
      >
        🇬🇧
      </button>
      <button
        onClick={() => changeLanguage("sv")}
        className={cn(i18n.language === "sv" && "bg-black-1 rounded-full px-1")}
      >
        🇸🇪
      </button>
    </div>
  );

  interface NavLink {
    label: string;
    icon?: JSX.Element;
    path: string;
    sublinks?: { label: string; path: string; shortcut?: string }[];
  }

  const NAV_LINKS: NavLink[] = [
    {
      label: t("header.companies"),
      icon: <BarChart3 className="w-4 h-4" aria-hidden="true" />,
      path: "/companies",
    },
    {
      label: t("header.municipalities"),
      icon: <BarChart3 className="w-4 h-4" aria-hidden="true" />,
      path: "/municipalities",
    },
    { path: "/about", label: t("header.about") },
    { path: "/insights", label: t("header.insights") },
    { path: "/methodology", label: t("header.methodology") },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black-2 h-10 lg:h-12">
      <div className="container mx-auto px-4 flex items-center justify-between pt-2 lg:pt-0">
        <Link to="/" className="flex items-center gap-2 text-base font-medium">
          Klimatkollen
        </Link>

        <button
          className="lg:hidden text-white"
          onClick={toggleMenu}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6 ml-auto">
          <Menubar className="border-none bg-transparent h-full">
            {NAV_LINKS.map((item) =>
              item.sublinks ? (
                <MenubarMenu key={item.label}>
                  <MenubarTrigger
                    className={cn(
                      "flex items-center gap-2 px-3 py-3 h-full transition-all text-sm",
                      location.pathname.startsWith(item.path)
                        ? "bg-black-1 text-white"
                        : "text-grey hover:text-white"
                    )}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                    <ChevronDown className="w-4 h-4" />
                  </MenubarTrigger>
                  <MenubarContent>
                    {item.sublinks.map((sublink) => (
                      <MenubarItem key={sublink.path}>
                        <Link
                          to={sublink.path}
                          className="flex justify-between w-full"
                        >
                          {sublink.label}
                          {sublink.shortcut && (
                            <MenubarShortcut>
                              {sublink.shortcut}
                            </MenubarShortcut>
                          )}
                        </Link>
                      </MenubarItem>
                    ))}
                  </MenubarContent>
                </MenubarMenu>
              ) : (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-2 px-3 py-3 h-full text-sm",
                    matchPath(item.path, location.pathname)
                      ? "bg-black-1 text-white"
                      : "text-grey hover:text-white"
                  )}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              )
            )}
            <div className="ml-4 h-full flex items-center">
              <LanguageButtons className={"hidden md:flex mx-4 "} />
              <NewsletterPopover
                isOpen={isSignUpOpen}
                setIsOpen={setIsSignUpOpen}
                buttonText={t("header.newsletter")}
              />
            </div>
          </Menubar>
        </nav>

        {/* Mobile Fullscreen Menu */}
        {menuOpen && (
          <div className="fixed inset-0 w-full h-full z-100 flex p-8 mt-10 bg-black-2">
            <div className="flex flex-col gap-6 text-lg">
              <LanguageButtons />
              {NAV_LINKS.map((link) => (
                <div key={link.path} className="flex flex-col">
                  <Link
                    to={link.path}
                    onClick={toggleMenu}
                    className="flex items-center gap-2"
                  >
                    {link.icon}
                    {link.label}
                  </Link>
                  {link.sublinks && (
                    <div className="flex flex-col gap-2 pl-4 mt-2">
                      {link.sublinks.map((sublink) => (
                        <Link
                          key={sublink.path}
                          to={sublink.path}
                          className="flex items-center gap-2 text-sm text-gray-400"
                        >
                          {sublink.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
