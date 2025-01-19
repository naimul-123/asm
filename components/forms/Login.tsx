"use client"
import { useQuery } from '@tanstack/react-query';
import { getData } from "@/lib/api"
import { useState } from 'react';
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

const FormSchema = z.object({
    sap: z.string().length(8, {
        message: "SAP Number must be 8 digit.",
    }),
})

const LogIn = () => {

    const [sap, setsap] = useState('');

    const { data: employee = {} } = useQuery({
        queryKey: ['employee', sap],
        queryFn: () => getData(`/login/api/?sap=${sap}`)
    })

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            sap: "",
        },
    })

    function onSubmit(data: z.infer<typeof FormSchema>) {
        setsap(data.sap);
    }
    console.log(employee);
    return (
        <div>
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
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit">Log In</Button>
                </form>
            </Form>
        </div>
    )
}

export default LogIn