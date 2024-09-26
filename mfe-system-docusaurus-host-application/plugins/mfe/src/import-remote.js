const fetchWebPackRemoteEntry = (url, scope) => {
	const script = document.createElement('script');
	script.src = url;
	script.type = 'text/javascript';
	script.async = true;

	const promise = new Promise((resolve) => {
		script.onload = () => {
			console.log(`window[scope]:`, window[scope]);
			resolve(window[scope]);
		};
	});

	document.head.appendChild(script);

	return promise;
};

const fetchModuleRemoteEntry = (url, scope) => {
	const script = document.createElement('script');
	script.type = 'module';
	script.innerHTML = `
      (async () => {
        const module = await import("${url}");
        window['${scope}'] = module;
        if (window['scopeLoading']['${scope}']) {
          window['scopeLoading']['${scope}'](module);
          delete window['scopeLoading']['${scope}'];
        }
      })();
    `;

	const promise = new Promise((resolve) => {
		window['scopeLoading'] = window['scopeLoading'] || {};
		window['scopeLoading'][scope] = resolve;
	});

	document.head.appendChild(script);

	return promise;
};

const fetchRemoteEntry = (url, scope, type) => {
	console.log(`type:`, type);
	if (type === 'module') {
		return fetchModuleRemoteEntry(url, scope);
	}

	return fetchWebPackRemoteEntry(url, scope);
};

let promise = undefined;
const initSharingScope = () => {
	if (!promise) {
		promise = __webpack_init_sharing__('default');
	}

	return promise;
};

export const importRemote = async (url, scope, module, type) => {
	let container = window[scope];

	if (!container) {
		container = await fetchRemoteEntry(url, scope, type);
		await initSharingScope();
		await container.init(__webpack_share_scopes__.default);
	}

	let factory = await container.get(module);

	return factory();
};
