import React, { useState } from "react";

import { Image, Layer, Stage, Star, Text } from "react-konva";
import { Pagination } from "semantic-ui-react";
import useImage from "use-image";
import Empty from "../../lib/react-pdf-editor/components/Empty";
import MenuBar from "../../lib/react-pdf-editor/components/MenuBar";
import Page from "../../lib/react-pdf-editor/components/Page";
import { AttachmentTypes } from "../../lib/react-pdf-editor/entities";
import useAttachments from "../../lib/react-pdf-editor/hooks/useAttachments";
import usePdf from "../../lib/react-pdf-editor/hooks/usePdf";
import useUploader, {
  UploadTypes,
} from "../../lib/react-pdf-editor/hooks/useUploader";
import { ggID } from "../../lib/react-pdf-editor/utils/helpers";

const LionImage = (props) => {
  const [image] = useImage("https://konvajs.org/assets/lion.png");
  return <Image {...props} image={image} />;
};

const TestPdf = () => {
  const [pdfSize, setPdfSize] = useState({ width: 0, height: 0 });
  const [texts, setTexts] = useState([
    {
      id: 1,
      x: 0,
      y: 0,
      isDragging: false,
    },
  ]);

  const [images, setImages] = useState([
    {
      id: 1,
      x: 0,
      y: 0,
      isDragging: false,
    },
  ]);

  const {
    file,
    initialize,
    pageIndex,
    isMultiPage,
    isFirstPage,
    isLastPage,
    currentPage,
    isSaving,
    savePdf,
    previousPage,
    nextPage,
    setDimensions,
    name,
    dimensions,
    totalPages,
    setActivePage,
  } = usePdf();
  const {
    add: addAttachment,
    allPageAttachments,
    pageAttachments,
    reset: resetAttachments,
    update,
    remove,
  } = useAttachments();

  const initializePageAndAttachments = (pdfDetails) => {
    initialize(pdfDetails);
    const numberOfPages = pdfDetails.pages.length;
    resetAttachments(numberOfPages);
  };

  const {
    inputRef: pdfInput,
    handleClick: handlePdfClick,
    isUploading,
    onClick,
    upload: uploadPdf,
  } = useUploader({
    use: UploadTypes.PDF,
    afterUploadPdf: initializePageAndAttachments,
  });
  const {
    inputRef: imageInput,
    handleClick: handleImageClick,
    onClick: onImageClick,
    upload: uploadImage,
  } = useUploader({
    use: UploadTypes.IMAGE,
    afterUploadAttachment: addAttachment,
  });

  const addText = () => {
    const newTextAttachment = {
      id: ggID(),
      type: AttachmentTypes.TEXT,
      x: 0,
      y: 0,
      width: 120,
      height: 25,
      size: 16,
      lineHeight: 1.4,
      fontFamily: "Times-Roman",
      text: "Enter Text Here",
    };
    addAttachment(newTextAttachment);
  };

  const hiddenInputs = (
    <>
      <input
        data-testid="pdf-input"
        ref={pdfInput}
        type="file"
        name="pdf"
        id="pdf"
        accept="application/pdf"
        onChange={uploadPdf}
        onClick={onClick}
        style={{ display: "none" }}
      />
      <input
        ref={imageInput}
        type="file"
        id="image"
        name="image"
        accept="image/*"
        onClick={onImageClick}
        style={{ display: "none" }}
        onChange={uploadImage}
      />
    </>
  );

  const handleSavePdf = () => savePdf(allPageAttachments);

  const handleDragStart = (e) => {
    const id = e.target.id();
    setTexts(
      texts.map((text) => {
        return {
          ...text,
          isDragging: text.id === id,
        };
      }),
    );
  };
  const handleDragEnd = (e) => {
    setTexts(
      texts.map((text) => {
        return {
          ...text,
          isDragging: false,
        };
      }),
    );
  };

  return (
    <div className="mx-auto" style={{ margin: 30, width: "90%" }}>
      {hiddenInputs}
      <MenuBar
        savePdf={handleSavePdf}
        addText={addText}
        addImage={handleImageClick}
        savingPdfStatus={isSaving}
        uploadNewPdf={handlePdfClick}
        isPdfLoaded={!!file}
      />
      {!file ? (
        <div>
          <Empty loading={isUploading} uploadPdf={handlePdfClick} />
        </div>
      ) : (
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: 10,
            }}>
            <Pagination
              firstItem={isFirstPage ? null : undefined}
              lastItem={isLastPage ? null : undefined}
              defaultActivePage={1}
              totalPages={totalPages}
              onPageChange={(e, data) => {
                setActivePage(data.activePage);
              }}
            />
          </div>

          {currentPage && (
            <div
              style={{
                position: "relative",
                width: "fit-content",
                marginInline: "auto",
              }}>
              <Page
                setPdfSize={setPdfSize}
                dimensions={dimensions}
                updateDimensions={setDimensions}
                page={currentPage}
              />
              <Stage
                height={pdfSize.height}
                width={pdfSize.width}
                style={{ position: "absolute", top: 0, left: 0 }}>
                <Layer>
                  {/* <Text text="Try to drag a star" /> */}
                  {/* <LionImage /> */}
                  {images.map((images) => (
                    <LionImage
                      key={images.id}
                      id={images.id}
                      x={images.x}
                      y={images.y}
                      draggable
                      onDragStart={handleDragStart}
                      onDragEnd={handleDragEnd}
                    />
                  ))}
                  {texts.map((text) => (
                    <Text
                      key={text.id}
                      id={text.id}
                      x={text.x}
                      y={text.y}
                      draggable
                      onDragStart={handleDragStart}
                      onDragEnd={handleDragEnd}
                      text="afawjf"
                    />
                  ))}
                  {/* {stars.map((star) => (
                    <Star
                      key={star.id}
                      id={star.id}
                      x={star.x}
                      y={star.y}
                      numPoints={5}
                      innerRadius={20}
                      outerRadius={40}
                      fill="#89b717"
                      opacity={0.8}
                      draggable
                      rotation={star.rotation}
                      shadowColor="black"
                      shadowBlur={10}
                      shadowOpacity={0.6}
                      shadowOffsetX={star.isDragging ? 10 : 5}
                      shadowOffsetY={star.isDragging ? 10 : 5}
                      scaleX={star.isDragging ? 1.2 : 1}
                      scaleY={star.isDragging ? 1.2 : 1}
                      onDragStart={handleDragStart}
                      onDragEnd={handleDragEnd}
                    />
                  ))} */}
                </Layer>
              </Stage>
              {/* {dimensions && (
                <Attachments
                  pdfName={name}
                  removeAttachment={remove}
                  updateAttachment={update}
                  pageDimensions={dimensions}
                  attachments={pageAttachments}
                />
              )} */}
            </div>
          )}
        </div>
        // <Grid>
        //   <Grid.Row>
        //     <Grid.Column width={3} verticalAlign="middle" textAlign="left">
        //       {isMultiPage && !isFirstPage && (
        //         <Button circular icon="angle left" onClick={previousPage} />
        //       )}
        //     </Grid.Column>
        //     <Grid.Column width={10}>
        //       {currentPage && (
        //         <Segment
        //           data-testid="page"
        //           compact
        //           stacked={isMultiPage && !isLastPage}>
        //           <div style={{ position: "relative" }}>
        //             <Page
        //               dimensions={dimensions}
        //               updateDimensions={setDimensions}
        //               page={currentPage}
        //             />
        //             {dimensions && (
        //               <Attachments
        //                 pdfName={name}
        //                 removeAttachment={remove}
        //                 updateAttachment={update}
        //                 pageDimensions={dimensions}
        //                 attachments={pageAttachments}
        //               />
        //             )}
        //           </div>
        //         </Segment>
        //       )}
        //     </Grid.Column>
        //     <Grid.Column width={3} verticalAlign="middle" textAlign="right">
        //       {isMultiPage && !isLastPage && (
        //         <Button circular icon="angle right" onClick={nextPage} />
        //       )}
        //     </Grid.Column>
        //   </Grid.Row>
        // </Grid>
      )}
    </div>
  );
};

export default TestPdf;
