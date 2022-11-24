import { postFetch } from "/script/common/fetch.js";

// 상수
const constant = {
	aes256: {
		publicKey: "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAoE4wR3nVncCEDxQF7Ev83Dkgcw6041L9eeBJMTohvrGe14h0kEJXAnHIEWGJy47FjTYtFJgm6UdzFTYx+xf4J9xY5XKd0u6sMJUgXAIeaIc4unmhpU615J+B9sFmlqnuPLonhQ8NIq3xZVVnVzuHQiXJxGi36dG6W/+9gPDHHblNV4UKHCTcN2XJn+kfZW/4wyzP89yUMFVhFtkjeZsRTDP02WFJQZxi9JA7wGBImzKsOMDilBtfXA/ZygN6wDxDR3h1q97p8BerGe1ms/fyrdvlI+tvlLtCDjaRA8Pd2glPZi2SJHMhAaMWi1jRmJ0KRmxQxezPiETdaYPUIuKTZwIDAQAB"
	},
	storage: {
		menu: 'y6ub7lY0od7l1oX'
	}
}

// 공통함수
const common = {
	getCodeList: code => {
		return new Promise(resolve, reject => {
			let codeList = sessionStorage.getItem(code);
			if(codeList){
				resolve(codeList);
			}else{
				postFetch({url: '/system/getCodeList', body: {code}})
				.then(res => {
					if(res.resultCode == 'SUCCESS'){
						sessionStorage.setItem(res.data);
						resolve(res.data);
					}else{
						reject(res.message);
					}
				})
			}
		});
	}
}

export { constant, common }