import { DOMAIN, PATH, FILES_PATH } from '../constant/server.js';

// Consts
const fileUploadPath = DOMAIN + PATH + FILES_PATH;
const fileDownloadPrefix = DOMAIN + '/';

/**
 * Function that uploads a file to a cross origin enabled server
 * @param  {file} file - File from input type file
 * @param  {function} progressCallback - Gets called on progress with the upload, gets percentage
 * @param  {function} doneCallback - Gets called when finished/failed uploading, arguments (err, hash)
 * @return {function} - A function to cancel the upload
 */
export function uploadFile(file, progressCallback, doneCallback) {
    const formData = new FormData();
	formData.append('file', file);

	const xhr = new XMLHttpRequest();

    // When the browser supports progress checking to upload, and progressCallback is passed
	if (progressCallback && xhr.upload) {
        let prevPercentage = -1;
		xhr.upload.addEventListener('progress', e => {
            const percentage = Math.ceil(e.loaded / e.total * 100);
            if (prevPercentage !== percentage) {
                progressCallback(percentage);
                prevPercentage = percentage;
            }
        }, false);
	}

	xhr.open('POST', fileUploadPath, true);
	xhr.send(formData);

	xhr.onreadystatechange = function(e) {
		if (xhr.readyState === 4) {
			if (xhr.status === 200) {
                const responseText = xhr.responseText;
				try {
                    const hash = JSON.parse(responseText);
                    doneCallback(undefined, hash);
				} catch (ex) {
                    // response isn't a JSON. return as string
                    doneCallback(undefined, responseText);
				}
			} else {
				doneCallback(e);
			}
		}
	};

    // Return a function to abort upload
    return () => {
        xhr.abort();
    }
}

/**
 * Get a url to download the file from by giving id (hash)
 * @param  {string} hash - hash recevied from the uploadFile
 * @return {string} url to get the resource from
 */
export function getUrlByHash(hash) {
    return fileDownloadPrefix + hash;
}
