"use client"

import { getData, postData } from '@/lib/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { createContext, useContext, useRef, useState } from 'react'
interface User {
    sap: number;
    name: string;
    designation: string;
    department?: string;
    section?: string;
    cell?: string;
    chember?: string
}
import Swal from 'sweetalert2'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
interface AssetContextType {


    setAssetData: () => void;
    setSelectedDepartment: () => void;
    setSelectedSection: () => void;
    selectedDepartment: string;
    selectedSection: string;
    form: () => void;
    hasnoAssetNo: boolean;
    setHasnoAssetNo: () => void;
    handleHasAsset: () => void;
    getAssetData: () => void;
}

const AssetContext = createContext<AssetContextType | undefined>(undefined);
export const AssetProvider = ({ children }: Readonly<{
    children: React.ReactNode;
}>) => {
    const [assetData, setAssetData] = useState<Asset[]>([])
    const [selectedDepartment, setSelectedDepartment] = useState<string>();
    const [selectedSection, setSelectedSection] = useState<string>();
    const [hasnoAssetNo, setHasnoAssetNo] = useState<boolean>(false);
    const formSchema = z.object({
        hasnoAssetNo: z.boolean().default(false).optional(),
        assetNumber: z.string()
            .optional()
            .refine(
                (val) =>
                    hasnoAssetNo || (val && val.length === 12),
                {
                    message:
                        "Asset Number must be 12 digits if hasnoAssetNo is false.",
                }
            ),
        categoryName: z.string()
            .nonempty("Please select a category.")
            .refine((val) => hasnoAssetNo || val)
        ,
        subCategoryName: z.string()
            .nonempty("Please select a sub category.")
            .refine((val) => hasnoAssetNo || val)
        ,
        assetName: z.string()
            .nonempty("Please write the asset name.")
            .refine((val) => hasnoAssetNo || val),
        location: z.string().nonempty("Asset location must not be inputed."),
        department: z.string().nonempty("Select a department."),
        section: z.string().nonempty("Select a section."),
    })
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            hasnoAssetNo: false,
            categoryName: "",
            subCategoryName: "",
            location: "",
            assetName: "",
            assetNumber: "",
            department: selectedDepartment || "",
            section: selectedSection || ""

        }
    })

    const getAssetData = async () => {
        const assetNo = form.getValues('assetNumber');
        console.log(assetNo);
        if (assetNo?.length === 12) {
            const res = await axios.get(`/apis/getAsset/?assetNo=${assetNo}`);
            if (res.data) {
                form.setValue("categoryName", res.data.categoryName || "");
                form.setValue("assetName", res.data.assetDescription || "");
                form.setValue("subCategoryName", res.data.subCategoryName || ""); // Set subCategoryName here
            }
        }
    };
    const assetMutation = useMutation({
        mutationFn: async (data) => postData('/apis/assetInfo', data),
        onSuccess: async (result) => {

            if (result.data.success) {
                localStorage.removeItem('assetData')
                setAssetData([]);
                setSelectedDepartment('')
                setSelectedSection('')
                form.reset({
                    hasnoAssetNo: false,
                    categoryName: "",
                    subCategoryName: "",
                    assetName: "",
                    assetNumber: "",
                    location: "",
                    department: "",
                    section: ""
                })
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Assets have been saved successfully.",
                    showConfirmButton: false,
                    timer: 1500
                });

            }

        },
        onError: (error) => {
            Swal.fire({
                position: "top-end",
                icon: "error",
                title: error,
                showConfirmButton: false,
                timer: 1500
            });
        }
    });
    const handleHasAsset = (v: boolean) => {
        setHasnoAssetNo(v);
        form.reset({
            hasnoAssetNo: v,
            categoryName: "",
            subCategoryName: "",
            assetName: "",
            assetNumber: "",
            location: "",
            department: selectedDepartment || "",
            section: selectedSection || ""
        })
    }

    const assetInfo = { assetMutation, assetData, setAssetData, form, setSelectedDepartment, selectedDepartment, setSelectedSection, selectedSection, hasnoAssetNo, handleHasAsset, getAssetData }


    return (
        <AssetContext.Provider value={assetInfo}>
            {children}
        </AssetContext.Provider>
    )
}

export const useAssetContext = () => {

    const context = useContext(AssetContext)
    if (!context) {
        throw new Error("UseAssetcontext must be used with an auth provider")
    }
    return context;
}