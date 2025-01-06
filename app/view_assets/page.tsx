"use client"
import { useMutation, useQuery } from '@tanstack/react-query';
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
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import departmentData from "@/public/departments.json"
import axios from 'axios';
interface AssetLocation {
    department: string;
    section: string;
    location: string
}
interface Asset {
    assetNumber: string;
    categoryName: string;
    subCategoryName: string;
    assetName: string;
    assetLocation: AssetLocation;
}
const FormSchema = z.object({
    department: z.string().nonempty("Select a department."),
    section: z.string().nonempty("Select a section."),
})

const ViewAssets = () => {

    const [sectionInfo, setSectionInfo] = useState<{ department: string, section: string } | null>()
    const departments: string[] = departmentData.map(d => d.name);
    const [sections, setSections] = useState<string[] | undefined>([]);
    const handleDeptChange = (value: string) => {
        const sections = departmentData.find(d => d.name === value)?.sections;
        setSections(sections);

    }

    const { data: assetData = [], isLoading } = useQuery({
        queryKey: ["assets", sectionInfo],
        queryFn: async () => {
            if (!sectionInfo) return [];
            const res = await axios.get(`/apis/sectionAsset?department=${sectionInfo?.department}&section=${sectionInfo?.section}`)
            return res.data
        },
        enabled: !!sectionInfo
    })
    console.log(assetData);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            department: "",
            section: ""
        },
    })

    function onSubmit(data: z.infer<typeof FormSchema>) {
        setSectionInfo(data)
        form.reset()

    }



    return (
        <div className='max-w-screen-lg mx-auto'>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-x-3 grid grid-cols-3 mx-auto max-w-screen-sm">
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
                                <Select onValueChange={(value) => { field.onChange(value); }} value={field.value}>
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
                    <Button type="submit" variant="secondary" >Search</Button>
                </form>
            </Form>






            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="">SL</TableHead>
                        <TableHead>Asset Number</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Sub Category</TableHead>
                        <TableHead>Asset Name</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Section</TableHead>
                        <TableHead>Location</TableHead>

                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading && (
                        <TableRow>
                            <TableCell colSpan={8}>Loading...</TableCell>
                        </TableRow>
                    )}
                    {assetData.length > 0 ? assetData?.map((asset, idx) => {
                        const { assetNumber, categoryName, subCategoryName, assetName, currentLocation } = asset;
                        const { department, section, location } = currentLocation
                        return (
                            <TableRow key={assetNumber}>

                                <TableCell className="font-medium">{idx + 1}</TableCell>
                                <TableCell>{assetNumber}</TableCell>
                                <TableCell>{categoryName}</TableCell>
                                <TableCell>{subCategoryName}</TableCell>
                                <TableCell>{assetName}</TableCell>
                                <TableCell>{department}</TableCell>
                                <TableCell>{section}</TableCell>
                                <TableCell>{location}</TableCell>

                            </TableRow>)
                    }
                    ) :
                        <TableRow>
                            <TableCell colSpan={8}>No data found</TableCell>
                        </TableRow>

                    }

                </TableBody>
            </Table>

        </div>
    )
}

export default ViewAssets