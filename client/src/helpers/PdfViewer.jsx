const PdfViewer = ({ fileUrl }) => {
    const googleDocsUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl)}&embedded=true`;
  
    return (
      <div className="pdf-viewer">
        <iframe
          src={googleDocsUrl}
          title="PDF Viewer"
          width="100%"
          height="600px"
          style={{ border: 'none' }}
        >
          This browser does not support PDFs. Please download the PDF to view it:
          <a href={fileUrl}>Download PDF</a>
        </iframe>
      </div>
    );
  };
  
  export default PdfViewer;
  