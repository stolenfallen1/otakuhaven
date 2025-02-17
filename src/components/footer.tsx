import Link from "next/link"
import { Instagram, Facebook, Linkedin, Github } from "lucide-react"

export default function Footer() {
    return (
        <div className="container mx-auto px-4 py-8 md:py-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-4 lg:gap-8 mb-4">
                {/* Brand Section */}
                <div className="col-span-1 sm:col-span-2 md:col-span-1 flex flex-col justify-center items-center gap-3">
                    <Link href="/" className="text-2xl font-bold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors">
                        OtakuHaven
                    </Link>
                    <p className="text-center text-sm md:text-base text-muted-foreground max-w-[250px]">
                        Your ultimate destination for anime merchandise and collectibles
                    </p>
                </div>

                {/* Shop Section */}
                <div className="flex flex-col items-center md:items-center">
                    <h4 className="text-lg font-semibold mb-2 text-foreground">Shop</h4>
                    <ul className="space-y-2 text-center md:text-center">
                        <li><Link href="/new-arrivals" className="text-sm md:text-base text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400 transition-colors">New Arrivals</Link></li>
                        <li><Link href="/best-sellers" className="text-sm md:text-base text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Best Sellers</Link></li>
                        <li><Link href="/sale" className="text-sm md:text-base text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Sale</Link></li>
                    </ul>
                </div>

                {/* Connect Section */}
                <div className="flex flex-col items-center sm:items-center md:items-center space-y-4">
                    <div className="text-center">
                        <h4 className="text-lg font-semibold mb-2 text-foreground">Connect with the Developer</h4>
                        <ul className="flex items-center justify-center space-x-6">
                            <li>
                                <Link 
                                    href="https://www.linkedin.com/in/jhon-llyod-quizeo-b17b56260/" 
                                    target="_blank" 
                                    className="text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                                >
                                    <Linkedin className="hover:scale-110 transition-transform" />
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    href="https://www.instagram.com/llyd_qzo/" 
                                    target="_blank" 
                                    className="text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                                >
                                    <Instagram className="hover:scale-110 transition-transform" />
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    href="https://www.facebook.com/stolenfallen1/" 
                                    target="_blank" 
                                    className="text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                                >
                                    <Facebook className="hover:scale-110 transition-transform" />
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    href="https://github.com/stolenfallen1" 
                                    target="_blank" 
                                    className="text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                                >
                                    <Github className="hover:scale-110 transition-transform" />
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className="text-center">
                        <h4 className="text-lg font-semibold text-foreground">For Direct Contacts</h4>
                        <p className="text-sm md:text-base text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                            Email: stolenfallen1@gmail.com
                        </p>
                    </div>
                </div>
            </div>
            <div className="border-t dark:border-border pt-6">
                <p className="text-center text-xs md:text-sm text-muted-foreground">
                    © {new Date().getFullYear()} OtakuHaven. All rights reserved.
                </p>
            </div>
        </div>
    )
}