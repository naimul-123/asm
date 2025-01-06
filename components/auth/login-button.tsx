"use client"
import { useRouter } from "next/navigation";

interface LoginButtonProps {
    children: React.ReactNode;
    mode?: "modal" | "redirect";
    asChild?: boolean;
}
const LoginButton = (
    {
        children,
        mode = "redirect",
        asChild
    }: LoginButtonProps) => {

    const router = useRouter();

    const onClick = () => {
        router.push("/asset_entry");
    }
    if (mode === "modal") {
        return (
            <span>TODO:</span>
        )
    }
    return (
        <span onClick={onClick}>{children}</span>
    )
}

export default LoginButton  