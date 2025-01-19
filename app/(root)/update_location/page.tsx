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
    assetNo: z.string().length(12, {
        message: "Asset Number must be 12 digit.",
    }),
})

const UpdateLocation = () => {

    const [assetNo, setAssetNo] = useState('');

    const { data: asset = {}, isLoading } = useQuery({
        queryKey: ['asset', assetNo],
        queryFn: () => getData(`/update_location/api/?assetNo=${assetNo}`)
    })

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            assetNo: "",
        },
    })

    function onSubmit(data: z.infer<typeof FormSchema>) {
        setAssetNo(data.assetNo);
    }


    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-x-3 flex items-center">
                    <FormField
                        control={form.control}
                        name="assetNo"

                        render={({ field }) => (
                            <FormItem >


                                <FormControl className="input input-bordered flex items-center gap-2">
                                    <Input placeholder="Asset Number" {...field} value={field.value}
                                        className="grow"
                                    />

                                </FormControl>

                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit">Search</Button>
                </form>
            </Form>
            {!isLoading &&
                <div className="overflow-x-auto">
                    <table className="table">
                        {/* head */}
                        <thead>
                            <tr>

                                <th>Asset Number</th>
                                <th>Asset Class</th>
                                <th>Asset Name</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* row 1 */}
                            <tr>
                                <th>{asset?.AssetNumber}</th>
                                <th>{asset?.categoryName}</th>
                                <th>{asset?.subCategoryName}</th>
                                <th><span className='btn btn-sm'>Add</span></th>

                            </tr>

                        </tbody>
                    </table>
                </div>
            }
        </div>
    )
}

export default UpdateLocation