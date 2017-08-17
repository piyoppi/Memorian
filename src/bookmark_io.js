export default class bookmarkIO{

    static save(data){
        let blob = new Blob(new Array(JSON.stringify( data )), { "type" : "text/plain" });
        let buffer_a = document.createElement("a");
        buffer_a.href = window.URL.createObjectURL(blob);
        buffer_a.download = "memorian_data.txt";
        buffer_a.click();
        console.log("save");
    }

    static load(){
        return new Promise( (resolve, reject) => {
            let elemInput = document.createElement("input");
            elemInput.type = "file";
            elemInput.onchange = (e) => {
                if( elemInput.files.length < 1 ) throw "LoadFileError";
                let reader = new FileReader();
                reader.onload = (evt) => {
                    let dataJSON = evt.target.result;
                    resolve(JSON.parse(dataJSON));
                };
                reader.onerror = (evt) => { reject(evt); };
                reader.readAsText(elemInput.files[0]);
            };
            elemInput.click();
        });
    }
}
