"use client"

import { postData } from '@/lib/api';
import { useMutation, UseMutationResult } from '@tanstack/react-query';
import axios, { AxiosResponse } from 'axios';
import React, { createContext, Dispatch, SetStateAction, useContext, useState } from 'react';
import Swal from 'sweetalert2';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, UseFormReturn } from 'react-hook-form';
import { z } from 'zod';

interface AssetLocation {
    department: string;
    section: string;
    location: string;
}

interface Asset {
    hasnoAssetNo: boolean;
    categoryName: string;
    subCategoryName: string;
    location: string;
    assetName: string;
    assetNumber: string;
    department: string;
    section: string;
    assetLocation: AssetLocation;
}

interface AssetContextType {
    setAssetData: Dispatch<SetStateAction<Asset[]>>;
    setSelectedDepartment: Dispatch<SetStateAction<string | null>>;
    setSelectedSection: Dispatch<SetStateAction<string | null>>;
    selectedDepartment: string | null;
    selectedSection: string | null;
    form: UseFormReturn<z.ZodSchema<Asset>>;
    hasnoAssetNo: boolean;
    setHasnoAssetNo: Dispatch<SetStateAction<boolean>>;
    handleHasAsset: (v: boolean) => void;
    getAssetData: () => void;
    assetMutation: UseMutationResult<AxiosResponse, Error, Asset>;
    assetData: Asset[];
    formSchema: z.ZodSchema<Asset>;
}

const AssetContext = createContext<AssetContextType | null>(null);

export const AssetProvider = ({ children }: { children: React.ReactNode }) => {
    const [assetData, setAssetData] = useState<Asset[]>([]);
    const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
    const [selectedSection, setSelectedSection] = useState<string | null>(null);
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
            .refine((val) => hasnoAssetNo || val),
        subCategoryName: z.string()
            .nonempty("Please select a sub category.")
            .refine((val) => hasnoAssetNo || val),
        assetName: z.string()
            .nonempty("Please write the asset name.")
            .refine((val) => hasnoAssetNo || val),
        location: z.string().nonempty("Asset location must not be inputed."),
        department: z.string().nonempty("Select a department."),
        section: z.string().nonempty("Select a section."),
    });

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
    });

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

    const assetMutation: UseMutationResult<AxiosResponse, Error, Asset> = useMutation({
        mutationFn: async (data: Asset) => postData('/apis/assetInfo', data),
        onSuccess: async (result) => {
            if (result.data.success) {
                localStorage.removeItem('assetData');
                setAssetData([]);
                setSelectedDepartment(null);
                setSelectedSection(null);
                form.reset({
                    hasnoAssetNo: false,
                    categoryName: "",
                    subCategoryName: "",
                    assetName: "",
                    assetNumber: "",
                    location: "",
                    department: "",
                    section: ""
                });
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
                title: error.message,
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
        });
    };

    const assetInfo = {
        assetMutation,
        assetData,
        setAssetData,
        form,
        setSelectedDepartment,
        selectedDepartment,
        setSelectedSection,
        selectedSection,
        hasnoAssetNo,
        setHasnoAssetNo,
        handleHasAsset,
        getAssetData,
        formSchema
    };

    return (
        <AssetContext.Provider value={assetInfo}>
            {children}
        </AssetContext.Provider>
    );
};

export const useAssetContext = () => {
    const context = useContext(AssetContext);
    if (!context) {
        throw new Error("useAssetContext must be used within an AssetProvider");
    }
    return context;
};
