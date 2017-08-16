export default class bookmarkIO{

    static save(data){
        let blob = new Blob(new Array(JSON.stringify( data )), { "type" : "text/plain" });
        let buffer_a = document.createElement("a");
        buffer_a.href = window.URL.createObjectURL(blob);
        buffer_a.download = "memorian_data.txt";
        buffer_a.click();
    }

    static load(){
        let elemInput = document.createElement("input");
        elemInput.type = "file";
        elemInput.onchange = (e) => {
            if( elemInput.files.length < 1 ) throw "LoadFileError";
            let reader = new FileReader();
            reader.onload = (evt) => {
                let dataJSON = ( evt.target.result );
                console.log(dataJSON);
                let data = JSON.parse(dataJSON);
                console.log(data);
            };
            reader.onerror = (evt) => { console.log("err"); };
            reader.readAsText(elemInput.files[0]);
        };
        elemInput.click();
    }
}
