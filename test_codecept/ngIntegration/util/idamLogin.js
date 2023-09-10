

const axios = require('axios')

var {parse} = require('node-html-parser');
const reportLogger = require('../../codeceptCommon/reportLogger');
const axiosInstance = axios.create({
    withCredentials: true,
    maxRedirects: 0,
    validateStatus: null
})
class IdamLogin{
    constructor(){
        this.conf = {
            xuiBaseUrl: 'http://localhost:3000',
            idamBaseUrl: 'https://idam-web-public.aat.platform.hmcts.net',
            idamClientId: 'xuiwebapp',
        }

        this.authToken = '';

       

        this.xuiCookies = {}
        this.idamCookies = {}

        this.xuiLoginResponse = {}
        this.idamLoginGetResponse = {};
        this.idamAuthorizeResponse = {};
        this.idamLoginresponse = {};
        this.xuiCallbackResponse = {}
        this.userDetailsResponse = {};

    }

    withCredentials(username, password){
        this.username = username;
        this.password = password
    }

    async do(){
        this.xuiLoginResponse = {}
        this.idamLoginGetResponse = {};
        this.idamAuthorizeResponse = {};
        this.idamLoginresponse = {};
        this.xuiCallbackResponse = {}
        this.userDetailsResponse = {};

        let loginWorkFlowError = null;
        let counter = 0;
        while(counter < 3){
            try {
                await this.onXuiLogin()
                await this.onIdamAuthorize()
                await this.onIdamLoginGet()
                await this.onIdamLoginPost()
                await this.onXuiCallback()
                await this.getUserDetails()


                const authTokenCookie = this.xuiCallbackResponse.details.setCookies.find(c => c.name === '__auth__')
                this.authToken = authTokenCookie.value
                return;

            } catch (err) {
                loginWorkFlowError = err;
                reportLogger.AddMessage('************* Login error *************')
            }
            counter++;
        }
        throw loginWorkFlowError;
        

    }

    getResponseStatus(response){
        return {
            status:response.status,
            data:response.data,
            // headers:response.headers,
            // error: response.err ? response.err.message : null
        }
    }

    getCookiesFromSetCookies(rawCookies){
        const cookies = []
        if (!Array.isArray(rawCookies)){
            reportLogger.AddMessage(`raw cookies : ${rawCookies}`)
            throw new Error('Idamlogin process, Cookies error: ' + rawCookies);
        }
        for (const strCookie of rawCookies){
            const cookiesParts = strCookie.split(';');
            const naveValue = cookiesParts[0].split('=');
            cookies.push({
                name: naveValue[0],
                value: naveValue[1]
            })
        }
        return cookies;
    }

    getCookieString(cookiesList){
        let cookieStr = cookiesList.map(cookie => `${cookie.name}=${cookie.value}`).join(';')
        return cookieStr;
    }

    async onXuiLogin(){
        const response = await new Promise(async (resolve,reject) => {
            const starTime = Date.now();

            const interval = setInterval(async () => {
                const response = await axiosInstance.get(this.conf.xuiBaseUrl + '/auth/login')
                const elapsedTime = (Date.now() - starTime)/1000
                if (response.headers.location !== undefined) {
                    clearInterval(interval)
                    resolve(response)
                } else if (elapsedTime > 30){
                    clearInterval(interval)
                    reject('API: onXuiLogin error, no idam redirect url returned');
                }else{
                    reportLogger.AddMessage('API: XUI login waiting for IDAM redirect url')
                }
            }, 1000)
            setTimeout(() => {
                clearInterval(interval)
            }, 35 * 1000)

          
           
        });
        // const response = await axiosInstance.get(this.conf.xuiBaseUrl + '/auth/login')
        this.xuiLoginResponse.status = this.getResponseStatus(response)
        
        this.xuiLoginResponse.details =  {
            response,
            idamAuthorizeUrl:`${response.headers.location}`,
            setCookies: this.getCookiesFromSetCookies(response.headers['set-cookie'])
        }
        reportLogger.AddMessage('API: XUI login call success')

    }



    async onIdamAuthorize() {
        if (this.xuiLoginResponse === null) { throw new Error('xuiLogin required') }

        reportLogger.AddMessage('API: IDAM Authorize url ' + this.xuiLoginResponse.details.idamAuthorizeUrl)
        const response = await axiosInstance.get(this.xuiLoginResponse.details.idamAuthorizeUrl)
        if(response.status === 200){
            return;
        }
        const redirectlocation = response.headers.location;
        const redirect_url = redirectlocation.split('redirect_uri')[1];

        const redirectQueryParams = redirect_url.split('callback&')[1].split('&').map(params => {
            const nameValue = params.split('=')
            return {
                name: nameValue[0],
                value: nameValue[1]
            }
        })

        this.idamAuthorizeResponse.status = this.getResponseStatus(response);
        this.idamAuthorizeResponse.details = {
            response,
            idamLoginRedirect: redirectlocation,
            setCookies: this.getCookiesFromSetCookies(response.headers['set-cookie']),
            state: redirectQueryParams.find(param => param.name === 'state').value,
            nonce: redirectQueryParams.find(param => param.name === 'nonce').value
        }
        reportLogger.AddMessage('API: IDAM authorize call success')

    }

    async onIdamLoginGet() {
        if (this.xuiLoginResponse === null) { throw new Error('idam authorize required') }
        const cookiesString = `${this.getCookieString(this.xuiLoginResponse.details.setCookies)}`
        const response = await axiosInstance.get(this.xuiLoginResponse.details.idamAuthorizeUrl,{
            headers:{
                Cookie: cookiesString
            }
        })
        var docRoot = parse(response.data);
        var csrfElement = docRoot.querySelector("input[name='_csrf']");

        this.idamLoginGetResponse.status = this.getResponseStatus(response)
        this.idamLoginGetResponse.details = {
            response,
            idamLoginRedirect: response.headers.location,
            csrf:csrfElement.attributes.value,

        }
        reportLogger.AddMessage('API: IDAM get call success')

    }



    async onIdamLoginPost(){
        const formdata = {
            username: this.username,
        password: this.password,
        selfRegistrationEnabled: 'false',
        mojLoginEnabled: 'true',
        _csrf: this.idamLoginGetResponse.details.csrf

        }
        const cookiesString = `${this.getCookieString(this.xuiLoginResponse.details.setCookies)};seen_cookie_message=yes; cookies_policy={"essential":true,"analytics":false,"apm":false}; cookies_preferences_set=false`


        const params = new URLSearchParams(formdata);
        let response = null;
        try{
            response = await axiosInstance.post(this.xuiLoginResponse.details.idamAuthorizeUrl,
                params,
                {
                    maxRedirects: 0,
                    validateStatus: null,
                    headers: {
                        Cookie: cookiesString,
                        'content-type': 'application/x-www-form-urlencoded',
                        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7'
                    }
                }
            );
        }catch(err){
            throw err
        }
        this.idamLoginresponse.status = this.getResponseStatus(response);
        this.idamLoginresponse.details = {
            xuiCallback:response.headers.location,
            setCookies: this.getCookiesFromSetCookies(response.headers['set-cookie'])

        }
        reportLogger.AddMessage('API: IDAM login post call success')

    }

    async onXuiCallback(){
        const response = await axiosInstance.get(`${this.idamLoginresponse.details.xuiCallback}`,{
            headers:{
                Cookie : this.getCookieString(this.xuiLoginResponse.details.setCookies)
            }
        })
        this.xuiCallbackResponse.status = this.getResponseStatus(response);
        this.xuiCallbackResponse.details = {
            setCookies: this.getCookiesFromSetCookies(response.headers['set-cookie'])
        }
        reportLogger.AddMessage('API: XUI callback call success')

    }


    async getUserDetails(){

        const cookies = await this.getCookieString(this.xuiCallbackResponse.details.setCookies)
        const response = await axiosInstance.get(`${this.conf.xuiBaseUrl}/api/user/details`, {
            headers: {
                Cookie: cookies
            }
        })
        this.userDetailsResponse.status = this.getResponseStatus(response);
        this.userDetailsResponse.details = {data:response.data}
        return response.data;
    }

    async getUserDetailsWithCookieString(cookieString) {
        const response = await axiosInstance.get(`${this.conf.xuiBaseUrl}/api/user/details`, {
            headers: {
                Cookie: cookieString
            }
        })
        this.userDetailsResponse.status = this.getResponseStatus(response);
        this.userDetailsResponse.details = { data: response.data }
        return response.data;
    }
    

}

module.exports = new IdamLogin();


