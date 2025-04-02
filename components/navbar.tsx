'use client'

import { Link } from '@heroui/link'
import { Navbar as HeroUINavbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenu, NavbarMenuItem, NavbarMenuToggle } from '@heroui/navbar'
import { Tab, Tabs } from '@heroui/tabs'
import NextLink from 'next/link'
import { usePathname } from 'next/navigation'

import { ThemeSwitch } from '@/components/theme-switch'
import { siteConfig } from '@/config/site'
import { texts } from '@/constants/helperTexts'
import { useAuth } from '@/contexts/auth'
import { logout } from '@/utils/actions'
import { Button } from '@heroui/button'
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@heroui/dropdown'

export const Navbar = () => {
	const auth = useAuth()
	const user = auth?.user
	const path = usePathname()

	return (
		<HeroUINavbar position="sticky">
			<NavbarContent className="basis-1/5 sm:basis-full" justify="start">
				<NavbarBrand as="li" className="gap-3 max-w-fit">
					<p className="font-bold text-inherit">Ahmediye</p>
				</NavbarBrand>
			</NavbarContent>

			<NavbarContent className="hidden sm:flex " justify="center">
				<NavbarItem>
					<Tabs selectedKey={path} variant="underlined">
						{siteConfig.navItems.map(item => (
							<Tab key={item.href} as={NextLink} href={item.href} title={item.label} />
						))}
					</Tabs>
				</NavbarItem>
			</NavbarContent>

			<NavbarContent className="hidden sm:flex" justify="end">
				<NavbarItem className="hidden sm:flex  gap-6">
					<ThemeSwitch />
					{user && (
						<Dropdown>
							<DropdownTrigger>
								<Button variant="ghost" color="primary">
									{user.email}
								</Button>
							</DropdownTrigger>
							<DropdownMenu>
								<DropdownItem key="delete" className="text-danger" color="danger" onPress={logout}>
									Çıkış Yap
								</DropdownItem>
							</DropdownMenu>
						</Dropdown>
					)}
				</NavbarItem>
			</NavbarContent>

			<NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
				<ThemeSwitch />
				<NavbarMenuToggle />
			</NavbarContent>

			<NavbarMenu>
				<div className="mx-4 mt-2 flex flex-col gap-2">
					{siteConfig.navMenuItems.map((item, index) => (
						<NavbarMenuItem key={`${item}-${index}`}>
							<Link color={item.href === path ? 'primary' : 'foreground'} href={item.href} size="lg">
								{item.label}
							</Link>
						</NavbarMenuItem>
					))}
					{user && (
						<NavbarMenuItem className="text-danger">
							<Link color="danger" size="lg" onPress={logout}>
								{texts.logout}
							</Link>
						</NavbarMenuItem>
					)}
				</div>
			</NavbarMenu>
		</HeroUINavbar>
	)
}
