"use client"
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import categoryData from '@/public/category.json';
import assetLists from '@/public/assetList.json';


const formSchema = z.object({
    categoryName: z.string().nonempty("Please select a category."),
    subCategoryName: z.string().nonempty("Please select a category."),

    acquiValue: z.string().nonempty("Please write acquisition value of the asset."),
    assetName: z.string().nonempty("Please write the asset name."),
    assetNumber: z.string().length(12, "Asset Number must be 12 digit.").nonempty()
    ,


})
const Register = () => {
    const [categories, setCategories] = useState<string[]>([]);
    const [subCategories, setSubCategories] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('')
    const [prefix, setPrefix] = useState('');
    const [remainingDigits, setRemainingDigits] = useState<string>('');


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            categoryName: "",
            subCategoryName: "",
            acquiValue: "",
            assetName: "",
            assetNumber: "",

        }
    })


    useEffect(() => {
        const category = categoryData.map((c) => c.category)
        setCategories(category)
    }, []);


    const handleCategoryChange = (value: string) => {
        setSelectedCategory(value)
        const selectedCategoryData = categoryData.find(c => c.category === value);
        if (selectedCategoryData) {
            const subCategoryData: string[] = selectedCategoryData?.subCategory;
            setSubCategories(subCategoryData)
        }
        updatePrefix();
    }
    const updatePrefix = () => {
        const acquivalue = form.getValues('acquiValue');
        const selectedCategoryData = categoryData.find((c) => c.category === selectedCategory);

        if (Number(acquivalue) <= 5000) {
            setPrefix("10");

        }

        else if (selectedCategoryData?.assetCode) {
            setPrefix(String(selectedCategoryData.assetCode));
        }
    }
    const handleAcquivalueChange = (value: string) => {
        if (/^\d*$/.test(value)) {
            form.setValue("acquiValue", value);
            form.clearErrors("acquiValue");
            updatePrefix();
        }
        else {
            form.setError("acquiValue", { message: "Only number is valid for input in this field" })
        }

    }
    const handleAssetNumberChange = (value: string) => {
        if (/^\d*$/.test(value) && value.length <= 10) {
            setRemainingDigits(value);
            form.setValue("assetNumber", prefix + value.padStart(10, "0"));
            form.clearErrors("assetNumber")
        }
        else {
            form.setError("assetNumber", { message: "Only number is valid" })
        }
    }

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values);
        form.reset({
            categoryName: "",
            subCategoryName: "",
            acquiValue: "",
            assetName: "",
            assetNumber: "",
        })
        setPrefix("");
        setRemainingDigits("")
    }

    return (
        <div>
            <h2>Total assets {assetLists.length}</h2>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                        control={form.control}
                        name='categoryName'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Select a category</FormLabel>
                                <Select onValueChange={(value) => { handleCategoryChange(value); field.onChange(value) }} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
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

                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a sub category      " />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {subCategories.map((category, idx) => <SelectItem key={idx} value={category}>{category}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>

                        )}
                    />
                    <FormField
                        control={form.control}
                        name='acquiValue'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Acquisition Value</FormLabel>
                                <FormControl>
                                    <Input disabled={selectedCategory === ""} placeholder="Write purchase value of the asset" {...field} value={field.value || ""}
                                        onChange={(e) => handleAcquivalueChange(e.target.value)} />
                                </FormControl>
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
                                    <Input disabled={selectedCategory === ""} placeholder="Assat Name" {...field} value={field.value || ""} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>

                        )}
                    />
                    <FormField
                        control={form.control}
                        name='assetNumber'
                        render={() => (
                            <FormItem>
                                <FormLabel>Asset Number</FormLabel>
                                <FormControl>
                                    <div className='flex'>
                                        <Input
                                            className='w-20'
                                            value={prefix}
                                            readOnly
                                            disabled
                                            placeholder='prefix'
                                        />
                                        <Input
                                            className='flex-1' placeholder="Asset number without zero" value={remainingDigits}
                                            onChange={(e) => handleAssetNumberChange(e.target.value)}
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>

                        )}
                    />

                    <Button type='submit'>Submit</Button>
                </form>
            </Form>
        </div>
    )
}

export default Register