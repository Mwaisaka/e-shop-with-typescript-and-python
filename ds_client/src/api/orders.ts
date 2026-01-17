import api from "./axios";

export const fetchOrders = () => 
    api.get("/orders/list-orders/");
export const fetchOrder = (order_id:number) => 
    api.get(`/orders/get-order/${order_id}/`)
export const createOrder = () => 
    api.get("/orders/create-order/");
export const cancelOrder = (order_id:number) => 
    api.get(`/orders/${order_id}/cancel/`);
export const fetchPayments = ()=> 
    api.get("/payments/list-payments/");
export const createPayment = () => 
    api.get("/payments/create/");
export const mpesaCallBack = () => 
    api.get("/payments/mpesa/callback/")