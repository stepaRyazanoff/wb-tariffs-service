import { WbBoxWarehouseTariffApi } from "./wb-box-api.type";

export type WbBoxTariffsResponse = {
    response?: {
        data?: {
            dtNextBox?: string;
            dtTillMax?: string;
            warehouseList?: WbBoxWarehouseTariffApi[];
        };
    };
};
