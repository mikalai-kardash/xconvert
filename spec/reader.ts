import * as fs from 'fs';

function read(file: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        
        fs.readFile(file, (err, data) => {
            
            if (err) {
                reject(err);
                return;
            }

            resolve(data.toString());
        });
        
    });
}

export {
    read as readFile
}