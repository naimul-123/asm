"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/contexts/authContext"
import { useRouter } from "next/navigation"



const FormSchema = z.object({
    sap: z.string().length(8, {
        message: "SAP Number must be 8 digit.",
    }),
})

const LogIn = () => {
    const router = useRouter();
    const redirect = router.query?.redirect || "/";
    // const { loginmutation, loginError } = useAuth()
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            sap: "",
        },
    })
    async function onSubmit(data: z.infer<typeof FormSchema>) {
        const response = await fetch("/apis/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...data })

        })

        if (response.ok) {

            router.push(redirect);
        }
        else {
            alert("Login failed")
        }
    }

    return (
        <div className="p-3 mx-auto my-3 max-w-sm rounded-lg shadow-lg bg-[#e6f4ed]">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 ">
                    <FormField
                        control={form.control}
                        name="sap"
                        render={({ field }) => (
                            <FormItem >
                                <FormControl className="input input-bordered flex items-center gap-2">
                                    <Input placeholder="sap id" {...field} value={field.value}
                                        className="grow"
                                    />
                                </FormControl>
                                {/* <p className="text-red-500">{loginError}</p> */}
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex justify-end">

                        <button type="submit" className="btn bg-[#007f40] text-white text-lg hover:bg-[#007f40]/80 " >Log In</button>
                    </div>
                </form>
            </Form>
        </div>
    )
}

export default LogIn