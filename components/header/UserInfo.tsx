"use client"
import { useAuth } from '@/contexts/authContext'

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import departmentData from "@/public/departments.json"

const formSchema = z.object({
    department: z.string().nonempty("Please select a department."),
    section: z.string().nonempty("Please select a section."),
});
const UserInfo = () => {
    const { user, profilemutation, isOpenModal, logout } = useAuth();
    const [sections, setSections] = useState<string[] | undefined>([]);
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            department: "",
            section: ""
        },
    });

    const departments: string[] = departmentData.map(d => d.name);

    const handleDeptChange = (value) => {
        const sections = departmentData.find(d => d.name === value)?.sections;
        setSections(sections);

    }
    const handleSubmit = (data: z.infer<typeof formSchema>) => {

        const updateUser = {
            sap: user?.sap,
            ...data

        }
        profilemutation.mutate(updateUser);

        form.reset({
            department: "",
            section: ""
        },)
    };


    return (

        <Card className={`max-w-sm bg-[#e6f4ed] absolute right-0 z-10 ${isOpenModal ? "block" : "hidden"} `}>
            <CardHeader>
                <CardTitle>{user?.name}</CardTitle>
                <CardDescription>{user?.designation}, {user?.section}, {user?.department} department</CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-end">
                <Button variant="secondary" className='bg-warning' onClick={logout}>Log out</Button>
            </CardFooter>
            <CardContent>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-3 border-2 p-4 '>
                        <h2 className='text-center'>Update Information</h2>
                        <FormField
                            control={form.control}
                            name='department'
                            render={({ field }) => (
                                <FormItem>
                                    <Select onValueChange={(value) => { handleDeptChange(value); field.onChange(value) }} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a Department" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className='bg-white'>
                                            {departments.map((dept) => <SelectItem key={dept} value={dept}>{dept}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='section'
                            render={({ field }) => (
                                <FormItem>
                                    <Select onValueChange={(value) => { field.onChange(value) }} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a Section" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className='bg-white'>
                                            {sections?.map((sec) => <SelectItem key={sec} value={sec}>{sec}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" variant="secondary" className="mt-4">
                            Update
                        </Button>
                    </form>
                </Form>
            </CardContent>

        </Card>



    )
}

export default UserInfo 