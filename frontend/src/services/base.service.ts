import axios, {AxiosError} from "axios";
import {appConfig} from "../configs/app.config.ts";

const BaseService = axios.create({
    baseURL: appConfig.apiBaseUrl,
    timeout: 50000,
    proxy: false,
    headers: {'Content-Type': 'application/json'},
})

BaseService.interceptors.response.use(async (response) => response, (error) => errorHandler(error));

function errorHandler(error: AxiosError) {
    if (error.response && error.response.status === 401) {
        alert('Unauthorized access');
        throw error;
    }

    let message;
    if (error.response && error.response.data) message = (error.response.data as { message: string; }).message;
    else message = error.message;

    alert(message);
}

export default BaseService
