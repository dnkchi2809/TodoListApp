export const ExportFile = (data) => {

    let dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(data);

    let exportFileDefaultName = 'data.json';

    let linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}