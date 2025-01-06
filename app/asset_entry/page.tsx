"use client"
import AssetEntryForm from '@/components/forms/AssetEntryForm'
import { Button } from '@/components/ui/button'
import React, { useEffect, useState } from 'react'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { MdDeleteForever } from "react-icons/md";
import { useAuth } from '@/contexts/authContext'
import { useAssetContext } from '@/contexts/assetContext'
import Swal from 'sweetalert2'
import ProtectedRoute from '@/components/ProtectedRoute'

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



const AssetEntry: React.FC = () => {
    const { assetMutation, assetData, setAssetData, selectedDepartment, setSelectedDepartment, selectedSection, setSelectedSection } = useAssetContext();

    useEffect(() => {
        const localAsset: Asset[] = JSON.parse(localStorage.getItem('assetData')) || [];
        setAssetData(localAsset)
    }, [setAssetData])
    const getFormData = (val: Asset): void => {

        const localAsset: Asset[] = JSON.parse(localStorage.getItem('assetData')) || []
        const isExist = localAsset?.find(asset => asset.assetNumber === val.assetNumber)
        if (isExist) {
            alert("This asset already added to list of this section")
        }
        else {
            const updateAssets = [...localAsset, val];
            localStorage.setItem("assetData", JSON.stringify(updateAssets));
            setAssetData(updateAssets);
        }
    }

    type HandleRemove = (assetNum: string) => void
    const handleRemove: HandleRemove = (assetNum) => {
        const localAsset = JSON.parse(localStorage.getItem('assetData'));
        const remainingList: Asset[] = localAsset?.filter(asset => asset.assetNumber !== assetNum)
        localStorage.setItem("assetData", JSON.stringify(remainingList))
        setAssetData(remainingList)
    }

    const handleFinalSubmit = () => {

        if (assetData.length > 0) {
            assetMutation.mutate(assetData)
        }
        else {
            Swal.fire({
                position: "top-end",
                icon: "error",
                title: "You have no data to save.",
                showConfirmButton: false,
                timer: 1500
            });
        }




    }

    return (
        <ProtectedRoute>
            <div className='max-w-screen-lg mx-auto'>
                <AssetEntryForm getFormData={getFormData} />
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
                            <TableHead>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {assetData?.map((asset, idx) => {
                            const { assetNumber, categoryName, subCategoryName, assetName, assetLocation } = asset;
                            const { department, section, location } = assetLocation
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
                                    <TableCell onClick={() => handleRemove(assetNumber)}><MdDeleteForever /></TableCell>
                                </TableRow>)
                        }
                        )}

                    </TableBody>
                </Table>
                <div className='flex justify-end text-center'>

                    <Button type='submit' variant="secondary" className='my-8' onClick={handleFinalSubmit}>Submit</Button>
                </div>
            </div>
        </ProtectedRoute>

    )
}

export default AssetEntry
