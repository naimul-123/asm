"use client"
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useEffect, useState } from 'react'
import { z } from 'zod'
import categoryData from '@/public/category.json';
import { Checkbox } from '../ui/checkbox'
import departmentData from "@/public/departments.json"
import { useAssetContext } from '@/contexts/assetContext'

type AssetEntryFormProps = {
    getFormData: (data: Record<string, any>) => void;
};

const AssetEntryForm: React.FC<AssetEntryFormProps> = ({ getFormData }) => {
    const [sections, setSections] = useState<string[] | undefined>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [subCategories, setSubCategories] = useState<string[]>([]);

    const { selectedDepartment, setSelectedDepartment, selectedSection, form, setSelectedSection, hasnoAssetNo, handleHasAsset, getAssetData, formSchema } = useAssetContext();



    const departments: string[] = departmentData.map(d => d.name);

    const handleDeptChange = (value: string) => {
        setSelectedDepartment(value)
        const sections = departmentData.find(d => d.name === value)?.sections;
        setSections(sections);

    }

    const handleSectionChange = (value: string) => {
        setSelectedSection(value)
    }






    useEffect(() => {
        const category = categoryData.map((c) => c.category)
        setCategories(category)
    }, []);



    const handleCategoryChange = (value: string) => {
        const selectedCategoryData = categoryData.find(c => c.category === value);
        if (selectedCategoryData) {
            const subCategoryData: string[] = selectedCategoryData?.subCategory;
            setSubCategories(subCategoryData)
        }

    }










    function onSubmit(values: z.infer<typeof formSchema>) {
        const assetInfo = {
            categoryName: values.categoryName,
            subCategoryName: values.subCategoryName,
            assetName: values.assetName,
            assetNumber: values.assetNumber,
            assetLocation: {
                location: values.location,
                department: values.department,
                section: values.section,
            }
        }
        getFormData(assetInfo)
        form.reset({
            hasnoAssetNo: false,
            categoryName: "",
            subCategoryName: "",
            assetName: "",
            assetNumber: "",
            location: "",
            department: selectedDepartment || "",
            section: selectedSection || ""
        })
    }

    return (
        <div className='max-w-screen-lg  mx-auto my-2 text-[#007f40]'>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='grid grid-cols-6 gap-3  items-start'>
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
                                <Select onValueChange={(value) => { field.onChange(value); handleSectionChange(value) }} value={field.value}>
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
                    <FormField
                        control={form.control}
                        name="hasnoAssetNo"
                        render={({ field }) => (
                            <FormItem className='col-span-full  font-bold'>
                                <FormControl>
                                    <Checkbox

                                        checked={field.value}
                                        onCheckedChange={(value) => { handleHasAsset(value); field.onChange(value); }}
                                    />
                                </FormControl>

                                <FormLabel>
                                    This asset has no number?
                                </FormLabel>
                            </FormItem>
                        )}
                    />


                    <FormField
                        control={form.control}
                        name="assetNumber"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Asset Number</FormLabel>
                                <FormControl>
                                    <Input placeholder="Type 12 digit asset Number" disabled={hasnoAssetNo} {...field} onBlur={getAssetData} />
                                </FormControl>

                                <FormMessage />
                            </FormItem>
                        )}
                    />



                    <FormField
                        control={form.control}
                        name='categoryName'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Select a category</FormLabel>
                                <Select disabled={!hasnoAssetNo} onValueChange={(value) => { handleCategoryChange(value); field.onChange(value) }} value={field.value}>
                                    <FormControl >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className='bg-[#e6f4ed]'>
                                        {categories.map((category, idx) => <SelectItem key={idx} value={category}>{category}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name='subCategoryName'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Sub category</FormLabel>
                                {
                                    hasnoAssetNo ? <Select
                                        disabled={!hasnoAssetNo}
                                        onValueChange={(val) => field.onChange(val)}
                                        value={field.value} // Ensure this is bound to the form's value
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a sub category" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className='bg-[#e6f4ed]'>
                                            {subCategories.map((category, idx) => (
                                                <SelectItem key={idx} value={category} className='hover:bg-slate-100'>
                                                    {category}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select> :
                                        <Input disabled={!hasnoAssetNo} placeholder="Assat Name" {...field} value={field.value || ""} className='text-[#007f40]' />



                                }

                                <FormMessage />
                            </FormItem>
                        )}
                    />


                    <FormField
                        control={form.control}
                        name='assetName'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Asset Name</FormLabel>
                                <FormControl>
                                    <Input disabled={!hasnoAssetNo} placeholder="Assat Name" {...field} value={field.value || ""} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>

                        )}
                    />


                    <FormField
                        control={form.control}
                        name='location'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Asset location</FormLabel>
                                <FormControl>
                                    <Input placeholder="Assat location" {...field} value={field.value || ""} className='text-[#007f40]' />
                                </FormControl>
                                <FormMessage />
                            </FormItem>

                        )}
                    />





                    <Button type='submit' variant="secondary" className='my-8'>Add</Button>

                </form>
            </Form>
        </div>
    )
}

export default AssetEntryForm