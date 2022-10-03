import { useState, useCallback } from "react";
import { save } from "../utils/pdf";

// export interface Pdf {
//   name: string;
//   file: File;
//   pages: Promise<any>[];
// }

export default () => {
  const [name, setName] = useState("");
  const [pageIndex, setPageIndex] = useState(-1);
  const [dimensions, setDimensions] = useState();
  const [file, setFile] = useState();
  const [pages, setPages] = useState([]);
  const [isMultiPage, setIsMultiPage] = useState(false);
  const [isFirstPage, setIsFirstPage] = useState(false);
  const [isLastPage, setIsLastPage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const currentPage = pages[pageIndex];

  const setDimensionsHandler = useCallback(setDimensions, [setDimensions]);

  const nextPage = () => {
    const newPageIndex = pageIndex + 1;
    setPageIndex(pageIndex + 1);
    setIsFirstPage(newPageIndex === 0);
    setIsLastPage(newPageIndex === pages.length - 1);
  };

  const previousPage = () => {
    const newPageIndex = pageIndex - 1;
    setPageIndex(newPageIndex);
    setIsFirstPage(newPageIndex === 0);
    setIsLastPage(newPageIndex === pages.length - 1);
  };

  const setActivePage = (number) => {
    const index = number - 1;

    if (index === 0) {
      setPageIndex(0);
      setIsFirstPage(true);
      setIsLastPage(false);
    } else if (index === pages.length - 1) {
      setPageIndex(index);
      setIsFirstPage(false);
      setIsLastPage(true);
    } else {
      setPageIndex(index);
      setIsFirstPage(false);
      setIsLastPage(false);
    }
    // setPageIndex(number - 1)
  };

  const initialize = async ({ name, file, pages: _pages }) => {
    const multi = _pages.length > 1;
    setTotalPages(_pages.length);
    setName(name);
    setFile(file);
    setPages(_pages);
    setPageIndex(0);
    setIsMultiPage(multi);
    setIsFirstPage(true);
    setIsLastPage(_pages.length === 1);
  };

  const savePdf = async (attachments) => {
    if (isSaving || !file) return;

    setIsSaving(true);

    try {
      await save(file, attachments, name);
    } catch (e) {
      console.log(e);
    } finally {
      setIsSaving(false);
    }
  };

  return {
    currentPage,
    dimensions,
    setDimensions: setDimensionsHandler,
    name,
    setName,
    pageIndex,
    setPageIndex,
    file,
    setFile,
    nextPage,
    pages,
    savePdf,
    initialize,
    isMultiPage,
    previousPage,
    isFirstPage,
    isLastPage,
    isSaving,
    totalPages,
    setActivePage,
  };
};
