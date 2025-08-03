"use client";
import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarBrand,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
} from "@heroui/navbar";
import { Button, ButtonGroup } from "@heroui/button";
import { Kbd } from "@heroui/kbd";
import { Link } from "@heroui/link";
import { Input } from "@heroui/input";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { Card, CardBody } from "@heroui/card";

import { SearchIcon, CartIcon, ContactIcon } from "@/components/icons";
import { useEffect, useState } from "react";
import { SearchResultProduct } from "@/interfaces/Product";
import { getProductsByKeyword } from "@/sanity/services/ProductService";
import { useDebounceCallback } from "@/config/hooks";
export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useUser();
  const [keyword, setKeyword] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResultProduct[]>([]);
  const handleSearch = useDebounceCallback(async () => {
    if (!keyword) {
      setSearchResults([]);
      return;
    }
    const searchRes = await getProductsByKeyword({ keyword: keyword });
    setSearchResults(searchRes);
  });
  useEffect(() => {
    handleSearch();
  }, [keyword]);
  const searchInput = (
    <div className="relative w-full">
      <Input
        aria-label="Search"
        classNames={{
          inputWrapper: `
        bg-white/10 
        backdrop-blur-sm 
        border border-white/10 
        hover:bg-white/10 
        focus-within:bg-white/10 
        focus-within:border-white/20 
        transition-colors
      `,
          input: "text-sm text-white placeholder-white/50",
        }}
        endContent={
          <Kbd className="hidden lg:inline-block" keys={["command"]}>
            K
          </Kbd>
        }
        value={keyword}
        onChange={(e) => setKeyword(e?.target?.value || "")}
        labelPlacement="outside"
        placeholder="Search..."
        startContent={
          <SearchIcon className="text-base text-white/30 pointer-events-none flex-shrink-0" />
        }
        type="search"
      />
      {searchResults.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-[#191A1C] border border-white/10 rounded-md shadow-lg z-50">
          {searchResults.map((product) => (
            <Link
              key={product.slug}
              href={`/product/${product.slug}`}
              className="flex items-center px-4 py-2 hover:bg-white/10 transition text-white"
              onClick={() => {
                setSearchResults([]);
                setKeyword("");
              }}
            >
              <img
                src={product.coverImage}
                alt={product.title}
                className="w-10 h-10 object-cover rounded mr-3"
              />
              <span className="text-sm font-medium">{product.title}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <HeroUINavbar
      className="sticky top-0 bg-black/40 backdrop-blur-md text-white border-b border-white/10 shadow-xl z-50
           before:absolute before:bottom-0 before:left-0 before:h-[1px] before:w-full 
           before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent"
      maxWidth="xl"
      onMenuOpenChange={setIsMenuOpen}
    >
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand className="gap-3 max-w-fit transition-transform hover:scale-[1.01]">
          <Link
            className="flex items-center gap-2 hover:text-yellow-400 transition-colors duration-300"
            href="/"
          >
            <img
              src="/logo-bg-transparent.png"
              style={{
                height: "4em",
              }}
            />
          </Link>
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
      </NavbarContent>
      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden lg:flex">{searchInput}</NavbarItem>
        <NavbarItem className="flex items-center gap-4">
          <ButtonGroup variant="solid">
            <Button
              isIconOnly
              as={Link}
              className="bg-white/10 text-white hover:bg-white/20 hover:scale-[1.05] transition duration-300  shadow-sm"
              href="/cart"
            >
              <CartIcon />
            </Button>
            <Button
              isIconOnly
              as={Link}
              className="bg-white/10 text-white hover:bg-white/20 hover:scale-[1.05] transition duration-300  shadow-sm"
              href="/contact"
            >
              <ContactIcon />
            </Button>
          </ButtonGroup>
          <SignedOut>
            <SignInButton mode="modal">
              <Button className="bg-white/10 text-white hover:bg-white/20 hover:scale-[1.05] transition duration-300 shadow-sm">
                Sign In
              </Button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <UserButton />
          </SignedIn>
        </NavbarItem>
      </NavbarContent>
      <NavbarMenu className="bg-[#191A1C] text-white px-4 py-6 space-y-4 flex flex-col justify-between">
        <div className="flex flex-col gap-2">
          {/* Search */}
          <NavbarMenuItem>
            <div className="px-2">{searchInput}</div>
          </NavbarMenuItem>
          <div>
            {/* Cart Link */}
            <NavbarMenuItem onClick={() => setIsMenuOpen(false)}>
              <Link href="/cart" className="block w-full">
                <Card className="w-full bg-white/5 backdrop-blur-md hover:bg-white/10 transition rounded-md shadow-sm">
                  <CardBody className="flex items-center gap-3 px-4 py-3 text-white flex-row">
                    <CartIcon className="text-white" />
                    <span className="text-base font-medium">Cart</span>
                  </CardBody>
                </Card>
              </Link>
            </NavbarMenuItem>

            {/* Contact Link */}
            <NavbarMenuItem>
              <Link
                href="/contact"
                className="block w-full"
                onClick={() => setIsMenuOpen(false)}
              >
                <Card className="w-full bg-white/5 backdrop-blur-md hover:bg-white/10 transition rounded-md shadow-sm">
                  <CardBody className="flex items-center gap-3 px-4 py-3 text-white flex-row">
                    <ContactIcon className="text-white" />
                    <span className="text-base font-medium">Contact</span>
                  </CardBody>
                </Card>
              </Link>
            </NavbarMenuItem>
          </div>
        </div>

        <NavbarMenuItem>
          <div className="px-2">
            <SignedOut>
              <SignInButton mode="modal">
                <Button className="w-full" variant="solid">
                  Sign In
                </Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <div className="w-full px-4 pt-6">
                <div className="w-full bg-white/5 backdrop-blur-md rounded-lg shadow-sm flex flex-col gap-3 px-4 py-3">
                  {/* User Info */}
                  <div className="flex items-center gap-3">
                    <UserButton
                      appearance={{
                        elements: {
                          avatarBox: "w-10 h-10",
                        },
                      }}
                    />
                    <div className="text-sm text-white">
                      <p className="font-semibold">{user?.fullName}</p>
                      <p className="text-white/60 text-xs break-all">
                        {user?.primaryEmailAddress?.emailAddress}
                      </p>
                    </div>
                  </div>

                  {/* Logout Button */}
                  <SignOutButton>
                    <Button
                      fullWidth
                      variant="ghost"
                      className="bg-white/10 text-white hover:bg-white/20 transition text-sm font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Logout
                    </Button>
                  </SignOutButton>
                </div>
              </div>
            </SignedIn>
          </div>
        </NavbarMenuItem>
      </NavbarMenu>
    </HeroUINavbar>
  );
};
