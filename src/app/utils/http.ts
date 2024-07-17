import { message } from 'antd';
import axios, { AxiosHeaders, AxiosInstance, AxiosResponse, RawAxiosRequestHeaders } from 'axios'

interface IResOptions {
    useAccessToken?: boolean
}


class Http {
    axiosClient: AxiosInstance
    constructor() {
        this.axiosClient = axios.create({
            baseURL: 'http://localhost:6868',
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
            }
        })
    }

    public async get(url: string, params: any) {
        try {
            const result = await this.axiosClient.get(url, { params });
            return result
        } catch (error) {
            message.error('Có lỗi')
            console.log(error)
        }
    }

    private async _handleRefreshToken(): Promise<void> {
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
                const result = await this.axiosClient.post('/api/auth/refreshtoken', {
                    refreshToken
                })
                if (result.data) {
                    localStorage.setItem('accessToken', result.data.accessToken)
                }
            } else {
                localStorage.clear()
            }
        } catch (error) {
            localStorage.clear()
        }
    }
    public async getWithAutoRefreshToken(url: string, options: IResOptions): Promise<any> {
        try {
            const requestHeader: RawAxiosRequestHeaders | AxiosHeaders = {};

            if (options.useAccessToken) {
                const accessToken = localStorage.getItem('accessToken');
                if (accessToken) {
                    requestHeader.authorization = `Bearer ${accessToken}`;
                }
            }
            const result = await this.axiosClient.get(url, {
                headers: requestHeader
            });
            return result.data;
        } catch (error) {
            try {
                // @ts-ignore
                if (error.response && error.response.status === 401) {
                    await this._handleRefreshToken();
                    if (localStorage.getItem('accessToken') !== null)
                        return await this.getWithAutoRefreshToken(url, options);
                    else
                        throw error;
                } else {
                    throw error;
                }
            } catch (error) {
                throw error;
            }
        }
    }


    public async postWithAutoRefreshToken(url: string, data: any, options: IResOptions): Promise<any> {
        try {
            const requestHeader: (RawAxiosRequestHeaders) | AxiosHeaders = {};
            if (options.useAccessToken) {
                requestHeader.authorization = `Bearer ${localStorage.getItem('accessToken')}`
            }
            const result = await this.axiosClient.post(url, data, {
                headers: requestHeader
            })
            return result.data
        } catch (error) {
            try {
                // @ts-ignore
                if (error.response && error.response.status === 401) {
                    await this._handleRefreshToken();
                    if (localStorage.getItem('accessToken') !== null)
                        return await this.postWithAutoRefreshToken(url, data, options);
                    else
                        throw error;
                } else {
                    throw error;
                }
            }
            catch (error) {
                throw error;
            }
        }
    }
    public async postWithAutoRefreshTokenMultipart(url: string, data: any, options: IResOptions): Promise<any> {
        try {
            const requestHeader: (RawAxiosRequestHeaders) | AxiosHeaders = {};
            if (options.useAccessToken) {
                requestHeader.authorization = `Bearer ${localStorage.getItem('accessToken')}`
            }
            requestHeader['Content-Type'] = 'multipart/form-data'
            const result = await this.axiosClient.post(url, data, {
                headers: requestHeader
            })
            return result.data
        } catch (error) {
            try {
                // @ts-ignore
                if (error.response && error.response.status === 401) {
                    await this._handleRefreshToken();
                    if (localStorage.getItem('accessToken') !== null)
                        return await this.postWithAutoRefreshToken(url, data, options);
                    else
                        throw error;
                } else {
                    throw error;
                }
            }
            catch (error) {
                throw error;
            }
        }
    }
    public async putWithAutoRefreshToken(url: string, data: any, options: IResOptions): Promise<any> {
        try {
            const requestHeader: (RawAxiosRequestHeaders) | AxiosHeaders = {};

            if (options.useAccessToken) {
                requestHeader.authorization = `Bearer ${localStorage.getItem('accessToken')}`
            }
            const result = await this.axiosClient.put(url, data, {
                headers: requestHeader
            })

            return result.data
        } catch (error) {
            try {
                // @ts-ignore
                if (error.response && error.response.status === 401) {
                    await this._handleRefreshToken();
                    if (localStorage.getItem('accessToken') !== null)
                        return await this.putWithAutoRefreshToken(url, data, options);
                    else
                        throw error;
                } else {
                    throw error;
                }
            }
            catch (error) {
                throw error;
            }
        }
    }
    public async deleteWithAutoRefreshToken(url: string, options: IResOptions): Promise<any> {
        try {
            const requestHeader: RawAxiosRequestHeaders | AxiosHeaders = {};

            if (options.useAccessToken) {
                requestHeader.authorization = `Bearer ${localStorage.getItem('accessToken')}`;
            }

            const result = await this.axiosClient.delete(url, {
                headers: requestHeader
            });

            return result.data;
        } catch (error) {
            try {
                // @ts-ignore
                if (error.response && error.response.status === 401) {
                    await this._handleRefreshToken();
                    if (localStorage.getItem('accessToken') !== null)
                        return await this.deleteWithAutoRefreshToken(url, options);
                    else
                        throw error;
                } else {
                    throw error;
                }
            }
            catch (error) {
                throw error;
            }
        }
    }

}

const http = new Http()

export default http