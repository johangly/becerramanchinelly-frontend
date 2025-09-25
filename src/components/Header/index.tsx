import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import {
	SignedIn,
	SignedOut,
	SignInButton,
	UserButton,
	useSession,
} from "@clerk/clerk-react";
import LogoHeaderIcon from "../../assets/logo-abm2@4x.png";
import "./styles.css";
import LogoHeaderWhiteIcon from "../../assets/backgroud-white.png";
import { useLocation } from "react-router-dom";

const navLinks = [
	{ name: "INICIO", href: "/" },
	{ name: "NOSOTROS", href: "/about" },
	{ name: "SERVICIOS", href: "/services" },
	{ name: "AREA LEGAL", href: "/contact" },
	{ name: "CONTACTO", href: "/contact" },
];

export const Header = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [scrolled, setScrolled] = useState(false);
	const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
	const location = useLocation();
	const { session } = useSession();
	const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth < 768);
			if (window.innerWidth >= 768) {
				setIsOpen(false);
			}
		};

		const handleScroll = () => {
			setScrolled(window.scrollY > 10);
		};

		window.addEventListener("resize", handleResize);
		window.addEventListener("scroll", handleScroll);

		return () => {
			window.removeEventListener("resize", handleResize);
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	// const toggleMenu = () => {
	//     setIsOpen(!isOpen);
	// };

	const menuVariants: Variants = {
		open: {
			opacity: 1,
			x: 0,
			transition: {
				type: "spring",
				stiffness: 300,
				damping: 30,
			},
		},
		closed: {
			opacity: 0,
			x: 100,
			transition: {
				type: "spring",
				stiffness: 300,
				damping: 30,
			},
		},
	};
	return (
		<header
			className={`header ${(scrolled || location.pathname !== '/') ? "scrolled" : ""} px-24`}
		>
			<div className="flex flex-row justify-between items-center w-full">
				<div>
					{(scrolled || location.pathname !== '/') ? (
						<img
							src={LogoHeaderIcon}
							alt="logo"
							className="w-36"
						/>
					) : (
						<img
							src={LogoHeaderWhiteIcon}
							alt="logo"
							className="w-36"
						/>
					)}
				</div>
				<div className="">
					{navLinks.map((link, index) => (
						<a
							key={index}
							href={link.href}
							className="nav-link mx-6"
						>
							{link.name}
						</a>
					))}
					{session?.user &&
						session?.publicUserData?.identifier ===
							adminEmail && (
							<a
                            href="/pagos"
                            className="nav-link mx-6">PAGOS</a>
						)}
					<button className="btn-style505 border border-[#bd9554] px-4 py-2 w-49">
						<span className="text-[#bd9554]">+</span>
						522222480015
					</button>
				</div>
				<div className="auth-buttons">
					<SignedOut>
						<SignInButton mode="modal">
							<button className="sign-in-button">
								Iniciar Sesión
							</button>
						</SignInButton>
					</SignedOut>
					<SignedIn>
						<UserButton afterSignOutUrl="/" />
					</SignedIn>
				</div>
			</div>

			<AnimatePresence>
				{isOpen && isMobile && (
					<motion.div
						className="mobile-menu"
						initial="closed"
						animate="open"
						exit="closed"
						variants={menuVariants}
					>
						<nav className="mobile-nav">
							<ul>
								{navLinks.map((link) => (
									<motion.li
										key={link.name}
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
									>
										<a
											href={link.href}
											className="mobile-nav-link"
											onClick={() =>
												setIsOpen(false)
											}
										>
											{link.name}
										</a>
									</motion.li>
								))}
								<li className="auth-buttons-mobile">
									<SignedOut>
										<SignInButton mode="modal">
											<button className="sign-in-button">
												Iniciar Sesión
											</button>
										</SignInButton>
									</SignedOut>
									<SignedIn>
										<UserButton afterSignOutUrl="/" />
									</SignedIn>
								</li>
							</ul>
						</nav>
					</motion.div>
				)}
			</AnimatePresence>
		</header>
	);
};

export default Header;
