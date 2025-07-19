import { LayoutDashboard, UserPlus, FileText, Settings } from "lucide-react";
export const navItems = [
	{
		name: "Home",
		href: "/dashboard",
		icon: LayoutDashboard,
	},
	{
		name: "Propose Appeal",
		href: "/dashboard/appeal",
		icon: UserPlus,
	},
	{
		name: "Appeal Records",
		href: "/dashboard/admin",
		icon: FileText,
	},
	{
		name: "Settings",
		href: "/dashboard/settings",
		icon: Settings,
	},
];
