//const fs = require('fs');
//
//export function createJSON(data, name) {
//
//    const jsonString = JSON.stringify(data, null, 2); // The `null` and `2` parameters format the JSON with indentation
//
//    fs.writeFileSync(`${name}.json`, jsonString, (err) => {
//        if (err) {
//            console.error('Error writing JSON to file:', err);
//        } else {
//            console.log('JSON file has been saved.');
//        }
//    });
//}

export function createAndDownloadJSON({data, name}) {

    try{
        const jsonString = JSON.stringify(data, null, 2);

        const blob = new Blob([jsonString], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${name}.json`;
        //console.log('link.download created:', link.download);
        //console.log('Download link created:', link.href);
        link.click();

        // Cleanup: Revoke the object URL after download
        URL.revokeObjectURL(link.href);        
    }

    catch (error) {
        console.error('Error creating or downloading JSON file:', error);
    }
}

