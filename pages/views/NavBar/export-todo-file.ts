export const ExportFile = (data : string) => {

    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(data);

    const exportFileDefaultName = 'data.json';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}