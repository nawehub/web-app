import React, {useState} from "react";
import {BusinessesTable} from "@/app/dashboard/my-businesses/_components/businesses-table";
import {useListBusinessQuery} from "@/hooks/repository/use-business";
import {BusinessDetailsModal} from "@/app/dashboard/my-businesses/_components/business-details-modal";
import {BusinessData} from "@/lib/services/business";
import {ApproveRejectDialog} from "@/app/dashboard/my-businesses/_components/approve-reject-dialog";

export default function Businesses() {
    const [viewBusinessOpen, setViewBusinessOpen] = React.useState(false);
    const [selectedBusiness, setSelectedBusiness] = useState<BusinessData | null>(null);
    const [showAlert, setShowAlert] = React.useState(false);
    const [selectedStatus, setSelectedStatus] = useState<"Approve" | "Reject">();
    const {data, isLoading} = useListBusinessQuery();
    const handleView = (business: BusinessData) => {
        setSelectedBusiness(business);
        setViewBusinessOpen(true);
    };
    return (
        <div className="">
            <BusinessesTable data={data?.businesses! || []} loading={isLoading} onView={handleView}  />
            <ApproveRejectDialog businessId={selectedBusiness?.id!} action={selectedStatus as "Approve" | "Reject"}
                                 openAlert={showAlert} openAlertAction={setShowAlert}/>
            <BusinessDetailsModal open={viewBusinessOpen} onOpenChange={setViewBusinessOpen} business={selectedBusiness} showAlert={setShowAlert} onStatusChange={setSelectedStatus} />
        </div>
    );
}
