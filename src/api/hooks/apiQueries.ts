import { useMutation, useQuery } from "react-query";
import {
  createReceiptMutationFn,
  loadAllReceiptsQueryFn,
  loadAllVehicleQueryFn,
  updateReceiptMutationFn,
} from "../queryFn/apiQueryFn";
import { Vehicle } from "../../model/vehicle";
import { Receipt } from "../../model/receipt";
import axios from "axios";
import { ReceiptDTO } from "../../model/dto";

export const useLoadAllVehicles = () => {
  const {
    data: vehicles,
    isLoading: vehiclesLoading,
    refetch: reloadVehicles,
  } = useQuery({
    queryKey: ["vehicle", "all"],
    queryFn: loadAllVehicleQueryFn,
    initialData: [] as Vehicle[],
  });
  return { vehicles, vehiclesLoading, reloadVehicles };
};

export const useLoadAllReceipts = () => {
  const {
    data: receipts,
    isLoading: receiptsLoading,
    refetch: reloadReceipts,
  } = useQuery({
    queryKey: ["receipts", "all"],
    queryFn: loadAllReceiptsQueryFn,
    initialData: [],
  });
  return { receipts, receiptsLoading, reloadReceipts };
};

export const useCreateRecepit = () => {
  return useMutation({
    mutationKey: ["receipt", "create"],
    mutationFn: (receipt: ReceiptDTO) => createReceiptMutationFn(receipt),
  });
};

export const useUpdateReceipt = () => {
  return useMutation({
    mutationKey: ["receipt", "update"],
    mutationFn: (receipt: ReceiptDTO) => updateReceiptMutationFn(receipt),
  });
};
