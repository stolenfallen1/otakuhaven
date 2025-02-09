import { Button } from "@/components/ui/button";

export default function SignUp() {
    return (
        <div className="container mx-auto max-w-md px-4 py-16">
        <h1 className="text-3xl font-bold text-center mb-8">Sign Up</h1>
        <form className="space-y-4">
            <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
                Full Name
            </label>
            <input
                id="name"
                type="text"
                className="w-full px-3 py-2 border rounded-md"
                required
            />
            </div>
            <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
                Email
            </label>
            <input
                id="email"
                type="email"
                className="w-full px-3 py-2 border rounded-md"
                required
            />
            </div>
            <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
                Password
            </label>
            <input
                id="password"
                type="password"
                className="w-full px-3 py-2 border rounded-md"
                required
            />
            </div>
            <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirm Password
            </label>
            <input
                id="confirmPassword"
                type="password"
                className="w-full px-3 py-2 border rounded-md"
                required
            />
            </div>
            <Button type="submit" className="w-full">
                Sign Up
            </Button>
        </form>
        </div>
    );
}