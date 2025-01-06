"use client"
import ProtectedRoute from "@/components/ProtectedRoute";
import LinkCard from "@/components/reusable/LinkCard";



export default function Home() {

  const linkData = [
    {
      title: "Login",
      des: "Click here to login",
      link: '/login'
    },
    {
      title: "Sections Assets",
      des: "Click here to see assets of your section asset list",
      link: '/register'
    },
  ]


  return (



    <div className="h-full flex-grow flex flex-col justify-center items-center">
      <h1 className="text-4xl font-bold text-center" >
        Welcome to Deadstock Departemt of Bangladesh Bank, Barishal Office.
      </h1>
    </div>

  );
}
