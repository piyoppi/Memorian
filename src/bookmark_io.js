export default class bookmarkIO{

    static save(data){
        let blob = new Blob(new Array(JSON.stringify( data )), { "type" : "text/plain" });
        let buffer_a = document.createElement("a");
        buffer_a.href = window.URL.createObjectURL(blob);
        let evt = document.createEvent('MouseEvent');
        evt.initEvent("click", true, false);
        buffer_a.download = "memorian_data.txt";
        buffer_a.dispatchEvent( evt );
    }
}
