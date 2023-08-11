import axios, { AxiosResponse } from "axios";
import { Vehicle } from "../../model/vehicle";
import { Receipt } from "../../model/receipt";
import { ReceiptDTO } from "../../model/dto";

const TOKEN = "clksfg2240000mi08sy0vxafp";
const AUTH_HEADER = { Authorization: `Bearer ${TOKEN}` };
const ALL_VEHICLES = "https://tangro-demo-api.vercel.app/api/vehicles";
const ALL_RECEIPTS = "https://tangro-demo-api.vercel.app/api/receipts";
const CREATE_RECEIPT = "https://tangro-demo-api.vercel.app/api/receipts";
export const loadAllVehicleQueryFn = async () => {
  const response = await axios
    .get(ALL_VEHICLES, { headers: AUTH_HEADER })
    .then(function (response: AxiosResponse) {
      return response.data as Vehicle[];
    })
    .catch((error) => {
      if (axios.isAxiosError(error)) {
        return [] as Vehicle[];
      }
    });

  return response;
};

export const loadAllReceiptsQueryFn = async () => {
  const response = await axios
    .get(ALL_RECEIPTS, { headers: AUTH_HEADER })
    .then(function (response: AxiosResponse) {
      return response.data as Receipt[];
    })
    .catch((error) => {
      if (axios.isAxiosError(error)) {
        return [] as Receipt[];
      }
    });

  return response;
};

export const createReceiptMutationFn = async (receipt: ReceiptDTO) => {
  const response = await axios
    .post(CREATE_RECEIPT, receipt, {
      headers: AUTH_HEADER,
    })
    .then(function (response: AxiosResponse) {
      return response.status === 201;
    })
    .catch((error) => {
      if (axios.isAxiosError(error)) {
        return false;
      }
    });

  return response;
};

export const updateReceiptMutationFn = async (receipt: ReceiptDTO) => {
  const response = await axios
    .post(`${CREATE_RECEIPT}/${receipt.id}`, receipt, {
      headers: AUTH_HEADER,
    })
    .then(function (response: AxiosResponse) {
      return response.status === 200;
    })
    .catch((error) => {
      if (axios.isAxiosError(error)) {
        return false;
      }
    });

  return response;
};
