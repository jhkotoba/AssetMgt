export const getFetch = (url, option) => {
	
	let blind = document.querySelector('.blind');
	blind?.classList.add('on');
	
	return new Promise((resolve, reject) => {
		fetch(url, {
			method: 'GET',				
			mode: 'cors',
			cache: 'default',
			credentials: 'same-origin',
			headers: {
				'Content-Type': 'application/json',
			},
			redirect: 'follow',
			referrer: 'no-referrer',
		})
		.then(response => response.json())
		.then(data => resolve(data))
		.catch(error => reject(error))
		.finally(() => blind?.classList.remove('on'));
	})
}

export const postFetch = param => {
	
	let blind = document.querySelector('.blind')
	blind?.classList.add('on');
	
	return new Promise((resolve, reject) => {
		fetch(param.url, {
			method: 'POST',				
			mode: 'cors',
			cache: 'default',
			credentials: 'same-origin',
			headers: {
			'Content-Type': 'application/json',
			},
			redirect: 'follow',
			referrer: 'no-referrer',
			body: JSON.stringify(param.body)
		})
		.then(response => response.json())
		.then(data => resolve(data))
		.catch(error => reject(error))
		.finally(() => blind?.classList.remove('on'));
	})
}