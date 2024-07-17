'use client'
const FileUpload = () => {
    const handle = (e:any) => {
        e.preventDefault();
        console.log(e.target.filepdf.files);
        let file = e.target.filepdf.files[0];
        let formData = new FormData();
        formData.append("file", file);
        console.log(formData.get('file'));
        fetch("http://localhost:6868/uploadFile", {
            method: 'POST',
            body: formData
        }).then (res => res.json())
        .then (data => {
            if (data.errors) {
               alert(data.errors)
             }
            else{
                 console.log(data)
             }
        })
    }
    return (<>
    <form action="" onSubmit={handle}>
        <input type="file" name="filepdf"/>
        <input type="submit" value="Send Request" style={{color: 'black'}}/>
    </form>
    </>)
}
export default FileUpload